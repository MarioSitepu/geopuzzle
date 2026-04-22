'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, Puzzle, MapPin, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const GEOLOGY_FACTS = [
  {
    title: "Cincin Api Pasifik",
    content: "Indonesia berada di pertemuan tiga lempeng tektonik besar, menjadikannya bagian dari Ring of Fire yang sangat aktif.",
    image: "/images/facts/ring-of-fire.png"
  },
  {
    title: "Benteng Alami",
    content: "Hutan mangrove bertindak sebagai pemecah gelombang alami yang efektif mengurangi dampak tsunami dan banjir rob.",
    image: "/images/facts/mangrove.png"
  },
  {
    title: "Pemicu Longsor",
    content: "Pergerakan tanah sering dipicu oleh curah hujan tinggi pada lereng gundul dengan material vulkanik yang labil.",
    image: "/images/facts/landslide.png"
  },
  {
    title: "Sesar Semangko",
    content: "Pulau Sumatera dilalui oleh Sesar Semangko yang memanjang hingga Lampung, menjadi sumber potensi gempa darat.",
    image: "/images/facts/sesar-semangko.png"
  },
  {
    title: "Anak Krakatau",
    content: "Aktivitas vulkanik Gunung Anak Krakatau di Selat Sunda berpotensi memicu tsunami akibat longsoran bawah laut.",
    image: "/images/facts/krakatau.png"
  }
];
export default function LandingPage() {
  const [currentFact, setCurrentFact] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextFact = useCallback(() => {
    setCurrentFact((prev) => (prev + 1) % GEOLOGY_FACTS.length);
  }, []);

  const prevFact = useCallback(() => {
    setCurrentFact((prev) => (prev - 1 + GEOLOGY_FACTS.length) % GEOLOGY_FACTS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextFact, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextFact]);

  return (
    <PageTransition className="justify-center items-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold text-earth-900 leading-tight tracking-tight">
              Jelajahi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-600 to-earth-600">
                Bencana Geologi
              </span>
            </h1>
            <p className="mt-6 text-lg text-earth-700 max-w-md leading-relaxed">
              Platform pembelajaran interaktif untuk memahami fenomena geologi seperti longsor dan banjir melalui pendekatan gamifikasi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/intro"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-leaf-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-leaf-600/30 hover:bg-leaf-700 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Mulai Menjelajah
            </Link>
            <Link
              href="/mitigation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-earth-800 rounded-full font-semibold text-lg shadow-md hover:bg-earth-100 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              Mitigasi
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-6 pt-8 border-t border-earth-300/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-leaf-100 rounded-xl text-leaf-600">
                <Puzzle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-earth-900">Puzzle Interaktif</h3>
                <p className="text-sm text-earth-600 mt-1">Belajar sambil bermain</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-earth-200 rounded-xl text-earth-700">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-earth-900">Studi Kasus</h3>
                <p className="text-sm text-earth-600 mt-1">Fokus area Lampung</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-leaf-400/20 to-earth-400/20 rounded-[3rem] blur-3xl -z-10" />
          <div className="glass rounded-[2.5rem] p-3 sm:p-4 aspect-square relative overflow-hidden shadow-2xl border-white/50">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentFact}
                src={GEOLOGY_FACTS[currentFact].image} 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                alt={GEOLOGY_FACTS[currentFact].title} 
                className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent rounded-[2rem]" />
            
            <div 
              className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="glass-dark p-5 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-leaf-500/30 rounded-lg">
                      <Info className="w-4 h-4 text-leaf-300" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-leaf-200">Fakta Geologi</p>
                  </div>
                  <div className="flex gap-1">
                    {GEOLOGY_FACTS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentFact ? 'bg-leaf-400 w-4' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative h-20 sm:h-24">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFact}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <h4 className="font-bold text-lg mb-1 text-leaf-50">{GEOLOGY_FACTS[currentFact].title}</h4>
                      <p className="text-sm sm:text-base text-white/90 leading-relaxed line-clamp-3">
                        {GEOLOGY_FACTS[currentFact].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    onClick={prevFact}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-90"
                    aria-label="Previous fact"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextFact}
                    className="p-2 rounded-full bg-leaf-500/80 hover:bg-leaf-600 transition-colors active:scale-90"
                    aria-label="Next fact"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
