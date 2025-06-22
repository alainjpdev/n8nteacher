// app/api/list-users/route.ts
import { clerkClient } from '@/lib/clerk';

export async function GET() {
  try {
    const result = await clerkClient.users.getUserList();

    const simplified = result.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata?.role || 'none',
    }));

    console.log('📋 Lista de usuarios:', simplified);

    return Response.json({ users: simplified });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}