'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Flame, Mountain, Waves, Lock, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';
import { cn } from '../lib/utils';

const DISASTERS = [
  {
    id: 'longsor',
    name: 'Tanah Longsor',
    icon: Mountain,
    description: 'Memahami Definisi Longsor, Pergerakan Tanah dan Jenis Jenis nya dari sisi keilmuan Geologi',
    color: 'from-amber-500 to-amber-700',
    glow: 'shadow-amber-500/20',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    accent: 'border-amber-200'
  },
  {
    id: 'gunung-api',
    name: 'Gunung Api',
    icon: Flame,
    description: 'Memahami aktivitas vulkanik, jenis erupsi, dan dampak geologi dari gunung berapi.',
    color: 'from-orange-500 to-red-600',
    glow: 'shadow-red-500/20',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
    accent: 'border-orange-200'
  },
  {
    id: 'tsunami',
    name: 'Tsunami',
    icon: Waves,
    description: 'Memahami mekanisme pemicu tsunami, perambatan gelombang, dan dampaknya di pesisir.',
    color: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    accent: 'border-blue-200'
  },
];

export default function DisasterSelection() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const { unlockedDisasters } = useGameStore();
  
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    { 
      id: 'awal', 
      name: 'Awal', 
      description: 'Konsep dasar & terminologi geologi', 
      icon: Sparkles,
      color: 'leaf' 
    },
    { 
      id: 'atas', 
      name: 'Lanjutan', 
      description: 'Analisis risiko & mitigasi kompleks', 
      icon: BookOpen,
      color: 'red' 
    },
  ];
  
  const regionDisasters = unlockedDisasters[regionId || ''] || [];

  const regionNames: Record<string, string> = {
    'bandar-lampung': 'Bandar Lampung',
    'pidada': 'Pidada',
    'panjang': 'Panjang'
  };

  const displayName = regionNames[regionId] || regionId?.replace(/-/g, ' ');

  return (
    <PageTransition className="p-4 sm:p-8 max-w-7xl mx-auto w-full relative">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-leaf-100/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-earth-100/40 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link 
          href="/regions" 
          className="group inline-flex items-center gap-2 text-earth-500 hover:text-earth-900 mb-8 transition-all font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-earth-100">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Kembali ke Pilih Kecamatan
        </Link>
      </motion.div>

      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-leaf-100 text-leaf-700 text-sm font-bold mb-4 border border-leaf-200"
        >
          GeoPuzzle Explorer
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl font-black text-earth-900 mb-6 tracking-tight"
        >
          Kecamatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-earth-700 via-leaf-700 to-earth-500">{displayName}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-earth-600 text-lg max-w-2xl leading-relaxed"
        >
          Pilih tingkatan keahlian Anda untuk memulai modul pembelajaran interaktif mengenai bencana geologi di wilayah ini.
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar: Tingkatan */}
        <div className="lg:w-1/3 w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-earth-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-earth-900 text-white shadow-lg text-lg">1</span>
              Tingkatan
            </h2>
            {selectedLevel && (
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedLevel(null)}
                className="text-sm text-leaf-600 font-bold hover:underline"
              >
                Ganti
              </motion.button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {levels.map((level, idx) => {
              const isActive = selectedLevel === level.id;
              const Icon = level.icon;
              return (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  onClick={() => setSelectedLevel(level.id)}
                  className={cn(
                    "group relative p-6 rounded-[2rem] border-2 transition-all duration-500 text-left overflow-hidden",
                    isActive 
                      ? "border-earth-900 bg-earth-900 text-white shadow-2xl shadow-earth-900/20 translate-x-2" 
                      : "border-white bg-white/60 backdrop-blur-md hover:border-earth-200 hover:shadow-xl hover:translate-x-1"
                  )}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isActive ? "bg-white/20 text-white scale-110" : "bg-earth-100 text-earth-600 group-hover:bg-earth-200"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-xl mb-0.5">Tingkat {level.name}</div>
                      <div className={cn(
                        "text-sm font-medium opacity-70",
                        isActive ? "text-white/80" : "text-earth-500"
                      )}>
                        {level.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="ml-auto w-8 h-8 rounded-full bg-white flex items-center justify-center"
                      >
                        <ChevronRight className="w-5 h-5 text-earth-900" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Subtle background glow for active state */}
                  {isActive && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {!selectedLevel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-[2rem] bg-amber-50 border-2 border-amber-100/50 text-amber-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Tips Belajar</h4>
                    <p className="text-sm leading-relaxed opacity-80">
                      Disarankan untuk mulai dari tingkat <strong>Awal</strong> jika Anda baru pertama kali mempelajari materi ini.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main: Bencana */}
        <div className="lg:w-2/3 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-2xl font-bold flex items-center gap-3 transition-all duration-500",
              !selectedLevel ? "opacity-30" : "opacity-100"
            )}>
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-earth-900 text-white shadow-lg text-lg">2</span>
              Pilih Bencana
            </h2>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 relative">
            <AnimatePresence>
              {!selectedLevel && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border-4 border-dashed border-earth-200/50 p-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 animate-bounce">
                    <Lock className="w-8 h-8 text-earth-300" />
                  </div>
                  <h3 className="text-2xl font-black text-earth-900 mb-2">Bencana Terkunci</h3>
                  <p className="text-earth-500 font-medium max-w-xs">
                    Pilih tingkatan materi terlebih dahulu di panel sebelah kiri untuk membuka modul.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {DISASTERS.map((disaster, index) => {
              const isUnlocked = regionDisasters.includes(disaster.id);
              const Icon = disaster.icon;
              const canClick = selectedLevel && isUnlocked;

              return (
                <motion.div
                  key={disaster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className="group"
                >
                  <Link
                    href={canClick ? `/regions/${regionId}/${disaster.id}/learn?level=${selectedLevel}` : '#'}
                    className={cn(
                      "block relative h-full overflow-hidden rounded-[2.5rem] p-1 transition-all duration-500",
                      canClick 
                        ? `bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-earth-900/10 hover:-translate-y-2` 
                        : "bg-earth-100 cursor-not-allowed grayscale"
                    )}
                  >
                    <div className="relative z-10 p-8 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className={cn(
                          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                          canClick ? `bg-gradient-to-br ${disaster.color} text-white ${disaster.glow}` : "bg-earth-300 text-earth-500"
                        )}>
                          {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                        </div>
                        {canClick && (
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            disaster.bgLight, disaster.textColor
                          )}>
                            Tersedia
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-3xl font-black text-earth-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-500"
                        style={{ backgroundImage: canClick ? `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` : 'none' }}>
                        {disaster.name}
                      </h3>
                      <p className="text-earth-600 font-medium leading-relaxed mb-10 line-clamp-2">
                        {disaster.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className={cn(
                          "flex items-center gap-2 font-bold transition-all duration-300",
                          canClick ? disaster.textColor : "text-earth-400"
                        )}>
                          <span>{canClick ? 'Mulai Eksplorasi' : 'Terkunci'}</span>
                          {canClick && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </div>
                        
                        {/* Decorative background circle */}
                        <div className={cn(
                          "absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-32 h-32 rounded-full transition-all duration-700 opacity-10 group-hover:scale-150 group-hover:opacity-20",
                          canClick ? `bg-gradient-to-br ${disaster.color}` : "bg-earth-300"
                        )} />
                      </div>
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
