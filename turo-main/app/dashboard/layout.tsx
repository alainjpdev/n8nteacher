import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './layout-client';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth(); // ✅ usar await

  if (!userId) {
    redirect('/sign-in');
  }

  return <DashboardLayoutClient userId={userId}>{children}</DashboardLayoutClient>;
}