'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

const REGIONS = [
  {
    id: 'kalianda',
    name: 'Kalianda',
    description: 'Kawasan pesisir pantai',
    image: '/images/quizregion/lampung-selatan(menara-siger-kalianda).jpg',
  },
  {
    id: 'pidada',
    name: 'Pidada',
    description: 'Kawasan industri dan pemukiman',
    image: '/images/quizregion/lampung-barat-(danau-suoh).png',
  },
  {
    id: 'rajabasa',
    name: 'Rajabasa',
    description: 'Kawasan pegunungan vulkanik',
    image: '/images/quizregion/lampung-tengah(bukit-batubara).jpg',
  },
];

export default function RegionSelection() {
  const { unlockedRegions } = useGameStore();

  return (
    <PageTransition className="p-4 sm:p-8 max-w-7xl mx-auto relative">
      <div className="mb-10 text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-earth-900 mb-4"
        >
          Pilih Kecamatan di Lampung Selatan
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-earth-600 max-w-2xl mx-auto"
        >
          Pilih kecamatan di kabupaten Lampung Selatan untuk mempelajari potensi bencana geologi yang ada di daerah tersebut.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REGIONS.map((region, index) => {
          const isUnlocked = true; // Force unlock all regions
          
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
                  isUnlocked ? "hover:shadow-2xl hover:-translate-y-2 cursor-pointer" : "cursor-not-allowed opacity-80 grayscale-50"
                )}
              >
                <img 
                  src={region.image} 
                  alt={region.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-earth-900/90 via-earth-900/40 to-transparent" />
                
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
