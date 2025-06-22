import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/cars',
    '/cars/(.*)',
    '/api/webhooks/(.*)',
    '/sign-in',
    '/sign-up',
  ],
  afterAuth(auth, req) {
    // Handle role-based routing
    if (auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role - this would be handled by checking user metadata
      // For now, we'll allow access and handle role checking in the components
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};