import { db } from '@acme/database/client';
import { User } from '@acme/database/schema';
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

  await db.insert(User).values({
    authProviderUserId: user.id,
    email: user.emailAddresses[0].emailAddress,
    name: user.fullName || `${user.firstName} ${user.lastName}`,
    role,
    imageUrl: user.imageUrl,
  });

  // Redirect to dashboard after successful storage
  redirect('/app/dashboard');
}
