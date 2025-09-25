'use client';

import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';

const ConditionalLayout = ({ children }) => {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Public routes that don't need sidebar
  const publicRoutes = ['/login', '/track'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For public routes, don't show sidebar
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // For authenticated routes, show sidebar layout
  // If user is not available but we're not on a public route, show loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // For authenticated routes with user, show sidebar layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-0 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default ConditionalLayout;
