'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Map, ShieldAlert, Home, LogOut, LogIn, User as UserIcon, History } from 'lucide-react';
import { cn } from '../lib/utils';
import iteraLogo from './itera.png';
import tgeologiLogo from './tgeologi.png';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/regions', label: 'Peta', icon: Map },
    { path: '/mitigation', label: 'Mitigasi', icon: ShieldAlert },
    { path: '/history', label: 'Riwayat', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 border-white/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/images/logo.png" 
              alt="GeoPuzzle Logo" 
              width={56} 
              height={56} 
              className="w-14 h-14 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" 
            />
            <span className="font-bold text-xl tracking-tight text-earth-900 uppercase">GEOLOGICALPUZZLE</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4 pl-4 border-l border-earth-200">
            <Image src={iteraLogo} alt="ITERA Logo" className="h-12 w-auto object-contain brightness-110" />
            <Image src={tgeologiLogo} alt="Teknik Geologi Logo" className="h-12 w-auto object-contain brightness-110" />
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-1 sm:gap-4 mr-2">
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
          </div>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-earth-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-earth-900 line-clamp-1">{user.name}</p>
                <p className="text-[10px] text-earth-500 line-clamp-1">{user.email}</p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full border-2 border-leaf-200 overflow-hidden shadow-sm">
                  <img src={user.image || ''} alt={user.name || 'User'} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => signOut()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-white text-red-500 rounded-full shadow-lg border border-earth-100 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-earth-900 text-white rounded-full text-sm font-bold shadow-lg shadow-earth-900/20 hover:bg-black transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
