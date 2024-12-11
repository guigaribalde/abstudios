import { db } from '@acme/database/client';
import { School, User } from '@acme/database/schema';
import { currentUser } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const isAllowedUser = (user.emailAddresses[0].emailAddress.includes('sierra.studio') || user.emailAddresses[0].emailAddress.includes('alphabest.org'));
  const existingUser = await db.query.User.findFirst({
    where: (users, { eq }) => eq(users.authProviderUserId, user.id),
  });

  if (existingUser) {
    redirect('/app/dashboard');
  }

  const role = isAllowedUser
    ? 'super-admin'
    : 'educator';

  const [school] = await db.insert(School).values({
    name: `${user.firstName}'s School`,
    active: true,
    organizationName: `${user.firstName}'s Org`,
  }).returning();

  await db.insert(User).values({
    name: user.firstName || `${user.firstName}`,
    lastName: user.lastName || null,
    phone: user.phoneNumbers[0].phoneNumber || null,
    email: user.emailAddresses[0].emailAddress,
    imageUrl: user.imageUrl,
    authProviderUserId: user.id,
    role,
    schoolId: school.id,
    active: true,
  });

  // Redirect to dashboard after successful storage
  redirect('/app/dashboard');
}
