'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Map, ShieldAlert, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import iteraLogo from './itera.png';
import tgeologiLogo from './tgeologi.png';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/regions', label: 'Peta', icon: Map },
    { path: '/mitigation', label: 'Mitigasi', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 border-white/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-leaf-500 text-white flex items-center justify-center font-bold text-xl shadow-inner group-hover:bg-leaf-600 transition-colors">
              G
            </div>
            <span className="font-bold text-xl tracking-tight text-earth-900 uppercase">GEOPUZZLE</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4 pl-4 border-l border-earth-200">
            <Image src={iteraLogo} alt="ITERA Logo" className="h-8 w-auto object-contain" />
            <Image src={tgeologiLogo} alt="Teknik Geologi Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-leaf-100 text-leaf-800 shadow-sm" 
                    : "text-earth-600 hover:bg-earth-200/50 hover:text-earth-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
