import { db } from '@acme/database/client';
import { Organization, School, User } from '@acme/database/schema';
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

  try {
    const [organization] = await db.insert(Organization).values({
      name: `${user.firstName}'s Org`,
      active: true,
    }).returning();

    const [school] = await db.insert(School).values({
      name: `${user.firstName}'s School`,
      active: true,
      organizationId: organization.id,
    }).returning();

    await db.insert(User).values({
      name: user.firstName || `${user.firstName}`,
      lastName: user.lastName || null,
      phone: user.phoneNumbers?.[0]?.phoneNumber || null,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      authProviderUserId: user.id,
      role,
      schoolId: school.id,
      active: true,
    });
  } catch (e) {
    console.error(e);
  }

  // Redirect to dashboard after successful storage
  redirect('/app/dashboard');
}
