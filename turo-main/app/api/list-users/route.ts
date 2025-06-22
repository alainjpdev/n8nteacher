// app/api/list-users/route.ts
import { clerkClient } from '@/lib/clerk';

export async function GET() {
  const result = await clerkClient.users.getUserList();

  const simplified = result.data.map(user => ({
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    role: user.publicMetadata?.role || 'none',
  }));

  return Response.json({ users: simplified });
}