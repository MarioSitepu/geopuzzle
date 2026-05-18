'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Temporarily disabled for testing
    /*
    if (status === 'loading') return;

    // If not logged in and trying to access protected routes
    const isProtectedRoute = pathname.startsWith('/regions');
    
    if (!session && isProtectedRoute) {
      router.push('/login');
    }
    */
  }, [session, status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="w-12 h-12 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
