'use client';

import { usePathname } from 'next/navigation';

export default function GlobalBackground() {
  const pathname = usePathname();
  
  // Check if current path is a puzzle/quiz page
  const isPuzzlePage = pathname?.includes('/puzzle');

  if (isPuzzlePage) return null;

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <img 
        src="/images/background.png" 
        alt="Background" 
        className="w-full h-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-linear-to-b from-earth-100/50 via-transparent to-earth-100/80" />
    </div>
  );
}
