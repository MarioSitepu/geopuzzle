'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { cn } from '../lib/utils';

const REGION_DISASTER_MAP: Record<string, string> = {
  'kalianda': 'tsunami',
  'panjang': 'longsor',
  'rajabasa': 'gunung-api'
};

const DISASTER_INFO: Record<string, { name: string; color: string; glow: string; text: string }> = {
  'tsunami': {
    name: 'Tsunami',
    color: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-700'
  },
  'longsor': {
    name: 'Tanah Longsor',
    color: 'from-amber-500 to-amber-700',
    glow: 'shadow-amber-500/20',
    text: 'text-amber-700'
  },
  'gunung-api': {
    name: 'Gunung Api',
    color: 'from-orange-500 to-red-600',
    glow: 'shadow-red-500/20',
    text: 'text-orange-700'
  }
};

export default function DisasterSelection() {
  const params = useParams();
  const regionId = params?.regionId as string;
  
  const levels = [
    { 
      id: 'awal', 
      name: 'Tingkat Awal', 
      description: 'Konsep dasar, terminologi geologi, dan mitigasi awal.', 
      icon: Sparkles,
      color: 'from-leaf-500 to-emerald-600',
      glow: 'shadow-leaf-500/20',
      textColor: 'text-leaf-700'
    },
    { 
      id: 'atas', 
      name: 'Tingkat Lanjutan', 
      description: 'Analisis risiko kompleks dan strategi mitigasi lanjutan.', 
      icon: BookOpen,
      color: 'from-rose-500 to-red-600',
      glow: 'shadow-red-500/20',
      textColor: 'text-rose-700'
    },
  ];

  const regionNames: Record<string, string> = {
    'kalianda': 'Kalianda',
    'panjang': 'Panjang',
    'rajabasa': 'Rajabasa'
  };

  const displayName = regionNames[regionId] || regionId?.replace(/-/g, ' ');
  const targetDisasterId = REGION_DISASTER_MAP[regionId] || 'longsor';
  const disasterInfo = DISASTER_INFO[targetDisasterId];

  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full relative min-h-[80vh] flex flex-col justify-center">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-leaf-100/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-earth-100/40 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-0 left-0 w-full"
      >
        <Link 
          href="/regions" 
          className="group inline-flex items-center gap-2 text-earth-500 hover:text-earth-900 transition-all font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-earth-100">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Kembali ke Pilih Kecamatan
        </Link>
      </motion.div>

      <div className="text-center mb-16 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 border bg-white shadow-sm uppercase tracking-widest", disasterInfo.text)}
        >
          Modul {disasterInfo.name}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-earth-900 mb-6 tracking-tight"
        >
          Kecamatan <span className="text-transparent bg-clip-text bg-linear-to-r from-earth-700 via-leaf-700 to-earth-500">{displayName}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-earth-600 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Silakan pilih tingkatan materi yang ingin Anda pelajari untuk modul bencana <strong>{disasterInfo.name}</strong> di wilayah ini.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {levels.map((level, idx) => {
          const Icon = level.icon;
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
            >
              <Link
                href={`/regions/${regionId}/${targetDisasterId}/learn?level=${level.id}`}
                className={cn(
                  "group relative block h-full p-8 rounded-[2.5rem] bg-white border-2 border-transparent hover:border-earth-200 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                )}
              >
                <div className="relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    `bg-gradient-to-br ${level.color} ${level.glow} text-white`
                  )}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-earth-900 mb-4">{level.name}</h3>
                  <p className="text-earth-600 font-medium leading-relaxed mb-8">
                    {level.description}
                  </p>
                  
                  <div className={cn("flex items-center gap-2 font-bold", level.textColor)}>
                    Mulai Belajar
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Decorative Background Blur */}
                <div className={cn(
                  "absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl",
                  `bg-gradient-to-br ${level.color}`
                )} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageTransition>
  );
}
