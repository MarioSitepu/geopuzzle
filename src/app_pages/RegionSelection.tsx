'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

const REGIONS = [
  {
    id: 'lampung-selatan',
    name: 'Lampung Selatan',
    description: 'Kawasan pesisir dan perbukitan',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'lampung-barat',
    name: 'Lampung Barat',
    description: 'Kawasan pegunungan rawan longsor',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'lampung-tengah',
    name: 'Lampung Tengah',
    description: 'Kawasan dataran rendah',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'lampung-timur',
    name: 'Lampung Timur',
    description: 'Kawasan pesisir timur',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
  },
];

export default function RegionSelection() {
  const { unlockedRegions } = useGameStore();

  return (
    <PageTransition className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-earth-900 mb-4"
        >
          Pilih Wilayah
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-earth-600 max-w-2xl mx-auto"
        >
          Pilih wilayah di Provinsi Lampung untuk mempelajari potensi bencana geologi yang ada di daerah tersebut.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REGIONS.map((region, index) => {
          const isUnlocked = unlockedRegions.includes(region.id);
          
          return (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={isUnlocked ? `/regions/${region.id}` : '#'}
                className={cn(
                  "group relative block h-80 rounded-3xl overflow-hidden shadow-lg transition-all duration-500",
                  isUnlocked ? "hover:shadow-2xl hover:-translate-y-2 cursor-pointer" : "cursor-not-allowed opacity-80 grayscale-[50%]"
                )}
              >
                <img 
                  src={region.image} 
                  alt={region.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900/90 via-earth-900/40 to-transparent" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{region.name}</h3>
                    {!isUnlocked && (
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {region.description}
                  </p>
                </div>

                {isUnlocked && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-leaf-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    Terbuka
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}
