// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

console.log("✅ Clerk middleware running");

export default authMiddleware({
  publicRoutes: [
    '/', 
    '/sign-in(.*)', 
    '/sign-up(.*)'
  ],
  ignoredRoutes: [
    '/api/webhook(.*)' // 🔥 Esto ignora todos los webhooks y los deja pasar
  ]
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};