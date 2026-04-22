'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

export default function ThemeHandler() {
  const params = useParams();
  const pathname = usePathname();
  const disasterId = params?.disasterId as string;

  useEffect(() => {
    // Check if we are in a banjir-related route
    // We check pathname to catch navigation to the disaster selection page too if desired, 
    // but the user specifically mentioned clicking the puzzle button.
    const isFloodRoute = disasterId === 'banjir' || pathname.includes('/banjir');
    
    if (isFloodRoute) {
      document.documentElement.classList.add('theme-flood');
    } else {
      document.documentElement.classList.remove('theme-flood');
    }
  }, [disasterId, pathname]);

  return null;
}
