'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { LogOut, AlertCircle } from 'lucide-react';

export default function HeaderUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    console.log('Sign out clicked');
    try {
      await signOut(); // Cierra sesión
      window.location.href = '/'; // Redirige manualmente a la home
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-3 p-2 rounded-lg">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex items-center space-x-3 p-2 rounded-lg bg-red-50 border border-red-200">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">Not signed in</p>
          <p className="text-xs text-red-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  const displayName =
    user.fullName ||
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
    user.firstName ||
    user.emailAddresses[0]?.emailAddress ||
    'User';

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.firstName
      ? user.firstName[0].toUpperCase()
      : user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || 'U';

  const email = user.emailAddresses[0]?.emailAddress || 'No email';

  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-medium">{initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate" title={displayName}>
          {displayName}
        </p>
        <p className="text-xs text-gray-500 truncate" title={email}>
          {email}
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}