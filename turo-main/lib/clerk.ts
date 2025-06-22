// lib/clerk.ts
import { ClerkClient, createClerkClient } from '@clerk/backend';

const clerkClient: ClerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export { clerkClient };