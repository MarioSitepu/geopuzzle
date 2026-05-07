'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Droplets, Mountain, Lock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

const DISASTERS = [
  {
    id: 'longsor',
    name: 'Tanah Longsor',
    icon: Mountain,
    description: 'Pahami mekanisme pergerakan tanah dan cara mencegahnya.',
    color: 'from-earth-600 to-earth-400',
    bgLight: 'bg-earth-100',
    textColor: 'text-earth-700',
  },
  {
    id: 'banjir',
    name: 'Banjir',
    icon: Droplets,
    description: 'Pelajari penyebab, dampak, dan mitigasi bencana banjir.',
    color: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
];

export default function DisasterSelection() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const { unlockedDisasters } = useGameStore();
  
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    { id: 'awal', name: 'Awal', description: 'Konsep dasar geologi', color: 'leaf' },
    { id: 'menengah', name: 'Menengah', description: 'Analisis fenomena', color: 'earth' },
    { id: 'atas', name: 'Atas', description: 'Mitigasi kompleks', color: 'red' },
  ];
  
  const regionDisasters = unlockedDisasters[regionId || ''] || [];

  const regionNames: Record<string, string> = {
    'bandar-lampung': 'Bandar Lampung',
    'pidada': 'Pidada',
    'panjang': 'Panjang'
  };

  const displayName = regionNames[regionId] || regionId?.replace(/-/g, ' ');

  // Helper to get color classes based on level and state
  const getLevelStyles = (levelId: string, color: string, isActive: boolean) => {
    if (!isActive) {
      switch (color) {
        case 'leaf': return "border-leaf-200 bg-leaf-50/50 hover:bg-leaf-100 hover:border-leaf-300";
        case 'earth': return "border-earth-200 bg-earth-50/50 hover:bg-earth-100 hover:border-earth-300";
        case 'red': return "border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300";
        default: return "border-earth-200 bg-earth-50";
      }
    }
    
    switch (color) {
      case 'leaf': return "border-leaf-500 bg-leaf-600 text-white shadow-lg shadow-leaf-600/20 -translate-y-1";
      case 'earth': return "border-earth-700 bg-earth-800 text-white shadow-lg shadow-earth-800/20 -translate-y-1";
      case 'red': return "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/20 -translate-y-1";
      default: return "border-leaf-600 bg-leaf-600 text-white";
    }
  };

  const getLevelTextStyles = (levelId: string, color: string, isActive: boolean) => {
    if (!isActive) {
      switch (color) {
        case 'leaf': return "text-leaf-700";
        case 'earth': return "text-earth-800";
        case 'red': return "text-red-700";
        default: return "text-earth-900";
      }
    }
    return "text-white"; 
  };

  const getDescStyles = (levelId: string, color: string, isActive: boolean) => {
    if (!isActive) return "text-earth-500";
    return "text-white/80";
  };

  return (
    <PageTransition className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <Link 
        href="/regions" 
        className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pilih Kecamatan
      </Link>

      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-earth-900 mb-4"
        >
          Kecamatan {displayName}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-earth-600"
        >
          Pilih tingkatan terlebih dahulu, lalu pilih jenis bencana geologi yang ingin Anda pelajari.
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar: Tingkatan */}
        <div className="lg:w-1/4 space-y-4">
          <h2 className="text-xl font-bold text-earth-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-leaf-100 text-leaf-600 flex items-center justify-center text-sm">1</span>
            Pilih Tingkatan
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {levels.map((level) => {
              const isActive = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={cn(
                    "group flex flex-col items-start p-5 rounded-2xl border-[3px] transition-all duration-300 text-left w-full relative overflow-hidden",
                    getLevelStyles(level.id, level.color, isActive)
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={cn(
                      "font-bold text-lg transition-colors duration-300",
                      getLevelTextStyles(level.id, level.color, isActive)
                    )}>
                      Tingkat {level.name}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    getDescStyles(level.id, level.color, isActive)
                  )}>
                    {level.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main: Bencana */}
        <div className="lg:w-3/4">
          <h2 className={cn(
            "text-xl font-bold mb-6 flex items-center gap-2 transition-opacity duration-300",
            !selectedLevel ? "opacity-30" : "opacity-100"
          )}>
            <span className="w-8 h-8 rounded-lg bg-leaf-100 text-leaf-600 flex items-center justify-center text-sm">2</span>
            Pilih Jenis Bencana
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 relative">
            {!selectedLevel && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl border-2 border-dashed border-earth-200">
                <p className="font-bold text-earth-500 bg-white px-6 py-3 rounded-full shadow-lg">
                  Silakan pilih tingkatan di sebelah kiri
                </p>
              </div>
            )}
            
            {DISASTERS.map((disaster, index) => {
              const isUnlocked = regionDisasters.includes(disaster.id);
              const Icon = disaster.icon;
              const canClick = selectedLevel && isUnlocked;

              return (
                <motion.div
                  key={disaster.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    href={canClick ? `/regions/${regionId}/${disaster.id}/learn?level=${selectedLevel}` : '#'}
                    className={cn(
                      "block relative overflow-hidden rounded-3xl p-8 transition-all duration-500",
                      canClick 
                        ? `glass hover:shadow-2xl hover:-translate-y-1 cursor-pointer` 
                        : "bg-earth-200/50 cursor-not-allowed opacity-70"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                      canClick ? `bg-gradient-to-br ${disaster.color} text-white` : "bg-earth-300 text-earth-500"
                    )}>
                      {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-earth-900 mb-3">{disaster.name}</h3>
                    <p className="text-earth-600 mb-8">{disaster.description}</p>
                    
                    <div className={cn(
                      "inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-colors",
                      canClick 
                        ? `${disaster.bgLight} ${disaster.textColor} group-hover:bg-white` 
                        : "bg-earth-300 text-earth-600"
                    )}>
                      {canClick ? 'Mulai Belajar' : (!selectedLevel ? 'Pilih Level Dulu' : 'Terkunci')}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
