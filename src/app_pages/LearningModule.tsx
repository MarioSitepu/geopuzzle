'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Play, FileText, ExternalLink, GraduationCap } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { cn } from '../lib/utils';

const SUPPORTING_MATERIALS: Record<string, Record<string, { title: string; size: string; url: string }[]>> = {
  'kalianda': {
    'gunung-api': [
      { title: 'Jurnal Geologi Gunung Api Vol. 1', size: '3.9 MB', url: '#' },
      { title: 'Jurnal Geologi Gunung Api Vol. 2', size: '365 KB', url: '#' }
    ],
    'tsunami': [
      { title: 'Jurnal Geologi Tsunami 1', size: '2.8 MB', url: '/journal/tsunami/1.pdf' },
      { title: 'Jurnal Geologi Tsunami 2', size: '3.0 MB', url: '/journal/tsunami/2.docx' }
    ],
    'longsor': [
      { title: 'Jurnal Geologi Longsor Vol. 1', size: '365 KB', url: '#' },
      { title: 'Jurnal Geologi Longsor Vol. 2', size: '3.9 MB', url: '#' }
    ]
  },
  'panjang': {
    'gunung-api': [
      { title: 'Jurnal Geologi Gunung Api Vol. 1', size: '3.9 MB', url: '#' },
      { title: 'Jurnal Geologi Gunung Api Vol. 2', size: '365 KB', url: '#' }
    ],
    'tsunami': [
      { title: 'Jurnal Geologi Tsunami 1', size: '2.8 MB', url: '/journal/tsunami/1.pdf' },
      { title: 'Jurnal Geologi Tsunami 2', size: '3.0 MB', url: '/journal/tsunami/2.docx' }
    ],
    'longsor': [
      { title: 'Jurnal Geologi Longsor Vol. 1', size: '365 KB', url: '#' },
      { title: 'Jurnal Geologi Longsor Vol. 2', size: '3.9 MB', url: '#' }
    ]
  },
  'rajabasa': {
    'gunung-api': [
      { title: 'Jurnal Geologi Gunung Api Vol. 1', size: '3.9 MB', url: '#' },
      { title: 'Jurnal Geologi Gunung Api Vol. 2', size: '365 KB', url: '#' }
    ],
    'tsunami': [
      { title: 'Jurnal Geologi Tsunami 1', size: '2.8 MB', url: '/journal/tsunami/1.pdf' },
      { title: 'Jurnal Geologi Tsunami 2', size: '3.0 MB', url: '/journal/tsunami/2.docx' }
    ],
    'longsor': [
      { title: 'Jurnal Geologi Longsor Vol. 1', size: '365 KB', url: '#' },
      { title: 'Jurnal Geologi Longsor Vol. 2', size: '3.9 MB', url: '#' }
    ]
  }
};

export default function LearningModule() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;
  const level = searchParams.get('level') || 'awal';

  const materials = SUPPORTING_MATERIALS[regionId]?.[disasterId] || [
    { title: 'Jurnal Geologi Vol. 1', size: '2.4 MB', url: '#' },
    { title: 'Jurnal Geologi Vol. 2', size: '2.4 MB', url: '#' }
  ];

  // Map level ID to display name and color
  const levelData: Record<string, { name: string, color: string }> = {
    'awal': { name: 'Awal', color: 'bg-leaf-100 text-leaf-700' },
    'atas': { name: 'Lanjutan', color: 'bg-red-100 text-red-700' },
    'lanjutan': { name: 'Lanjutan', color: 'bg-red-100 text-red-700' }
  };

  const currentLevel = levelData[level] || levelData.awal;

  return (
    <PageTransition className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <Link 
        href={`/regions/${regionId}`} 
        className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pilih Bencana
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Level Indicator (Vertical) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-20 w-full flex lg:flex-col items-center gap-6 py-4"
        >
          <div className="flex lg:flex-col items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-xl transition-transform hover:scale-110",
              currentLevel.color.replace('bg-', 'bg-').replace('text-', 'text-').replace('100', '600').replace('200', '700'),
              "text-white"
            )}>
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="hidden lg:block w-px h-16 bg-linear-to-b from-earth-200 to-transparent" />
          </div>
          
          <div className="flex lg:flex-col gap-2 items-center">
            {['awal', 'lanjutan'].map((l) => (
              <div 
                key={l}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-500",
                  (l === level || (l === 'lanjutan' && level === 'atas'))
                    ? "h-10 bg-leaf-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                    : "bg-earth-200"
                )}
              />
            ))}
          </div>

          <div className="lg:[writing-mode:vertical-rl] lg:rotate-180 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-400">
              Current Level
            </span>
            <span className={cn(
              "text-sm font-bold uppercase tracking-[0.2em]",
              currentLevel.color.split(' ')[1]
            )}>
              {currentLevel.name}
            </span>
          </div>
        </motion.div>

        {/* Middle: Video Module */}
        <div className="flex-1 space-y-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[3rem] p-6 sm:p-10 shadow-2xl border-white/60 relative overflow-hidden group"
          >
            {/* Background Decorative Element */}
            <div className={cn(
              "absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-20 -z-10",
              currentLevel.color.split(' ')[0]
            )} />

            <div className="flex items-center gap-5 mb-10">
              <div className={cn(
                "p-4 text-white rounded-3xl shadow-2xl transition-colors duration-500",
                currentLevel.color.replace('100', '600').replace('200', '700').split(' ')[0]
              )}>
                <Play className="w-8 h-8 fill-current" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-earth-900 tracking-tight leading-none mb-2">
                  Video Pembelajaran
                </h2>
                <p className="text-earth-500 font-bold uppercase tracking-widest text-xs">
                  Tingkat {currentLevel.name}
                </p>
              </div>
            </div>
            
            <div className="aspect-video rounded-4xl overflow-hidden bg-earth-900 relative group/video shadow-2xl border-4 border-white/50">
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer group-hover/video:bg-white/40 transition-all border border-white/30"
                >
                  <Play className="w-10 h-10 text-white ml-1 fill-white" />
                </motion.div>
              </div>

              {/* Thumbnail Image */}
              <img 
                src={disasterId === 'gunung-api' 
                  ? "https://images.unsplash.com/photo-1518414911976-95e2ba07aa4c?auto=format&fit=crop&q=80&w=1000"
                  : disasterId === 'tsunami'
                    ? "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&q=80&w=1000"
                    : "https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?auto=format&fit=crop&q=80&w=1000"
                } 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-80 group-hover/video:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-earth-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="mt-10 border-t border-earth-100 pt-10">
              <h3 className="text-2xl font-bold text-earth-900 capitalize mb-4">
                Memahami {disasterId} di {regionId?.replace('-', ' ')}
              </h3>
              <p className="text-earth-600 leading-relaxed text-lg">
                Simak video di atas untuk memahami proses terjadinya {disasterId}, faktor-faktor pemicu, dan dampaknya terhadap lingkungan serta masyarakat sekitar dalam skala keilmuan geologi.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Materials & Action */}
        <div className="lg:w-80 w-full space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 shadow-xl border-white/40"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-earth-200 text-earth-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-earth-900">Materi Pendukung</h2>
            </div>

            <div className="space-y-4">
              {materials.map((material, index) => (
                <a 
                  key={index}
                  href={material.url}
                  target={material.url !== '#' ? "_blank" : undefined}
                  rel={material.url !== '#' ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-3 p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-earth-200 group"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-4 h-4 text-earth-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900 text-sm leading-tight">{material.title}</h4>
                    <p className="text-xs text-earth-500 mt-1 uppercase tracking-tighter">PDF • {material.size}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={`/regions/${regionId}/${disasterId}/puzzle?level=${level}`}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-leaf-600 text-white rounded-4xl font-black text-lg shadow-xl shadow-leaf-600/30 hover:bg-leaf-700 hover:scale-[1.03] hover:-rotate-1 transition-all duration-300 active:scale-95"
            >
              Mulai Puzzle
              <Play className="w-4 h-4 fill-current" />
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
