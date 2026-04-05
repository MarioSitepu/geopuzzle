'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Droplets, Mountain, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

const DISASTERS = [
  {
    id: 'banjir',
    name: 'Banjir',
    icon: Droplets,
    description: 'Pelajari penyebab, dampak, dan mitigasi bencana banjir.',
    color: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    id: 'longsor',
    name: 'Tanah Longsor',
    icon: Mountain,
    description: 'Pahami mekanisme pergerakan tanah dan cara mencegahnya.',
    color: 'from-earth-600 to-earth-400',
    bgLight: 'bg-earth-100',
    textColor: 'text-earth-700',
  },
];

export default function DisasterSelection() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const { unlockedDisasters } = useGameStore();
  
  const regionDisasters = unlockedDisasters[regionId || ''] || [];

  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <Link 
        href="/regions" 
        className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Peta
      </Link>

      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-earth-900 mb-4 capitalize"
        >
          {regionId?.replace('-', ' ')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-earth-600"
        >
          Pilih jenis bencana geologi yang ingin Anda pelajari di wilayah ini.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {DISASTERS.map((disaster, index) => {
          const isUnlocked = regionDisasters.includes(disaster.id);
          const Icon = disaster.icon;

          return (
            <motion.div
              key={disaster.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link
                href={isUnlocked ? `/regions/${regionId}/${disaster.id}/learn` : '#'}
                className={cn(
                  "block relative overflow-hidden rounded-3xl p-8 transition-all duration-300",
                  isUnlocked 
                    ? `glass hover:shadow-2xl hover:-translate-y-1 cursor-pointer` 
                    : "bg-earth-200/50 cursor-not-allowed opacity-70"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                  isUnlocked ? `bg-gradient-to-br ${disaster.color} text-white` : "bg-earth-300 text-earth-500"
                )}>
                  {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                
                <h3 className="text-2xl font-bold text-earth-900 mb-3">{disaster.name}</h3>
                <p className="text-earth-600 mb-8">{disaster.description}</p>
                
                <div className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-colors",
                  isUnlocked 
                    ? `${disaster.bgLight} ${disaster.textColor} group-hover:bg-white` 
                    : "bg-earth-300 text-earth-600"
                )}>
                  {isUnlocked ? 'Mulai Belajar' : 'Terkunci'}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}
