'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, Puzzle, MapPin, ChevronLeft, ChevronRight, Info, ExternalLink, Activity, Map, AlertTriangle, Menu, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';

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
    image: "/images/facts/sesar-semangko.jpg"
  },
  {
    title: "Anak Krakatau",
    content: "Aktivitas vulkanik Gunung Anak Krakatau di Selat Sunda berpotensi memicu tsunami akibat longsoran bawah laut.",
    image: "/images/facts/krakatau.jpg"
  }
];
export default function LandingPage() {
  const [currentFact, setCurrentFact] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { playerName, setPlayerName } = useGameStore();
  const [localName, setLocalName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    // Show modal if the user hasn't set their name globally yet
    if (playerName === null) {
      setShowNameModal(true);
    }
  }, [playerName]);

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
    <PageTransition className="justify-center items-center p-4 sm:p-8 relative min-h-screen overflow-hidden">
      
      {/* Username Modal */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-earth-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-leaf-100/50 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100/30 rounded-full -ml-16 -mb-16 blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-leaf-50 text-leaf-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-leaf-100">
                  <Play className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-3xl font-black text-earth-900 mb-2 tracking-tight">Selamat Datang!</h2>
                <p className="text-earth-600 mb-8 font-medium">Silakan masukkan nama Anda untuk menyimpan riwayat permainan.</p>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (localName.trim()) {
                    setPlayerName(localName.trim());
                    setShowNameModal(false);
                  }
                }}>
                  <input 
                    type="text" 
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Ketik namamu di sini..."
                    className="w-full px-6 py-4 rounded-xl border-2 border-earth-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/20 focus:outline-none mb-6 text-center font-bold text-earth-800 text-xl transition-all shadow-inner"
                    required
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!localName.trim()}
                    className="w-full py-4 bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-leaf-600/30"
                  >
                    Mulai Eksplorasi
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-5 right-5 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-lg text-earth-800 transition-all hover:scale-105 active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay & Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white/95 backdrop-blur-xl z-50 p-6 flex flex-col gap-6 lg:hidden shadow-2xl border-l border-white overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2 mt-4">
                <span className="font-black text-2xl text-earth-900 tracking-tighter">GeoPuzzle<span className="text-leaf-600">.</span></span>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link
                  href="/intro"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 bg-leaf-50 text-leaf-700 rounded-2xl font-bold transition-all hover:bg-leaf-100 active:scale-95"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  Mulai Belajar
                </Link>
                <Link
                  href="/mitigation"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 bg-earth-50 text-earth-700 rounded-2xl font-bold hover:bg-earth-100 transition-all active:scale-95"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  Mitigasi Bencana
                </Link>
                <div className="h-px w-full bg-earth-100 my-2" />
                <a
                  href="https://petabencana.id/map"
                  target="_blank"
                  className="flex items-center gap-4 p-4 bg-amber-50 text-amber-700 rounded-2xl font-bold hover:bg-amber-100 transition-all active:scale-95"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  Peta Bencana
                </a>
                <a
                  href="https://lampung.bmkg.go.id/geo/map_seis.php"
                  target="_blank"
                  className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition-all active:scale-95"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Map className="w-5 h-5" />
                  </div>
                  Gempa Realtime
                </a>
              </div>
              
              <div className="mt-auto pt-8 pb-4">
                <p className="text-sm text-earth-500 font-medium text-center">Platform Edukasi Bencana Geologi Lampung</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-leaf-400/30 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] bg-earth-400/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/3 w-[25rem] h-[25rem] bg-blue-400/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 sm:gap-16 items-center relative z-10 mt-8 sm:mt-12">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/80">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf-600"></span>
              </span>
              <span className="text-xs font-bold text-earth-800 uppercase tracking-widest">
                Sub Wilayah Lampung Selatan
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-earth-950 leading-[1.1] tracking-tight">
              Memahami <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-leaf-600 via-emerald-600 to-earth-600">
                Bencana Geologi
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-earth-700 max-w-md leading-relaxed font-medium">
              Platform Edukatif dan Interaktif melalui gamifikasi puzzle untuk memahami bencana geologi dari pemahaman sisi keilmuan geologis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/intro"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-leaf-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_60px_-15px_rgba(34,197,94,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <Play className="w-5 h-5 fill-current relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Mulai Belajar</span>
            </Link>
            <Link
              href="/mitigation"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-earth-800 border-2 border-white rounded-full font-bold text-lg shadow-lg hover:bg-white hover:border-earth-200 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <BookOpen className="w-5 h-5 text-earth-600 group-hover:text-earth-900 transition-colors" />
              <span>Mitigasi</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 gap-6 pt-10 mt-10 border-t border-earth-300/50"
          >
            <div className="group flex items-start gap-4">
              <div className="p-3 bg-leaf-100 rounded-2xl text-leaf-600 group-hover:bg-leaf-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Puzzle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-earth-900 mb-1">Puzzle Interaktif</h3>
                <p className="text-sm text-earth-600 leading-snug">Belajar Sambil Bermain Puzzle bertema Kebencanaan</p>
              </div>
            </div>
            <div className="group flex items-start gap-4">
              <div className="p-3 bg-earth-200 rounded-2xl text-earth-700 group-hover:bg-earth-700 group-hover:text-white transition-all duration-300 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-earth-900 mb-1">Studi Kasus</h3>
                <p className="text-sm text-earth-600 leading-snug">Berfokus Pada Wilayah Lampung Selatan</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative w-full"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-leaf-400/30 to-earth-400/30 rounded-[3rem] blur-3xl -z-10 animate-pulse" />
          <div className="glass rounded-[2.5rem] p-4 sm:p-5 aspect-square relative overflow-hidden shadow-2xl border-white/60 group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentFact}
                src={GEOLOGY_FACTS[currentFact].image} 
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                alt={GEOLOGY_FACTS[currentFact].title} 
                className="absolute inset-0 w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-linear-to-t from-earth-950/80 via-earth-900/20 to-transparent rounded-[2rem]" />
            
            <div 
              className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="glass-dark p-6 rounded-[2rem] text-white relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-leaf-500/40 rounded-xl backdrop-blur-md">
                      <Info className="w-4 h-4 text-leaf-100" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-leaf-200">Fakta Geologi</p>
                  </div>
                  <div className="flex gap-1.5">
                    {GEOLOGY_FACTS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === currentFact ? 'bg-leaf-400 w-6' : 'bg-white/20 w-1.5'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative h-24 sm:h-28">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFact}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <h4 className="font-extrabold text-xl sm:text-2xl mb-2 text-white">{GEOLOGY_FACTS[currentFact].title}</h4>
                      <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium line-clamp-3">
                        {GEOLOGY_FACTS[currentFact].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    onClick={prevFact}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 active:scale-90 hover:shadow-lg backdrop-blur-md"
                    aria-label="Previous fact"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextFact}
                    className="p-3 rounded-full bg-leaf-500 hover:bg-leaf-400 transition-all duration-300 active:scale-90 hover:shadow-lg hover:shadow-leaf-500/50"
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

      {/* External Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-5xl w-full mt-24 mb-12 relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-earth-900 rounded-2xl text-white shadow-lg shadow-earth-900/20">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black text-earth-900 tracking-tight">
              Pantauan Realtime
            </h3>
          </div>
          <div className="h-px bg-earth-200 flex-1 ml-8 hidden sm:block"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <a
            href="https://lampung.bmkg.go.id/info/daftar/gempa/wilayah/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-6 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm hover:shadow-2xl border border-white hover:border-leaf-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-leaf-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="p-3 bg-leaf-50 rounded-2xl text-leaf-600 group-hover:bg-leaf-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <ExternalLink className="w-5 h-5 text-earth-300 group-hover:text-leaf-600 transition-colors duration-300" />
            </div>
            <h4 className="relative z-10 font-bold text-earth-900 text-base mb-2 group-hover:text-leaf-800 transition-colors">Daftar Gempa Wilayah</h4>
            <p className="relative z-10 text-sm text-earth-600 leading-relaxed font-medium">Data realtime gempa bumi wilayah dari portal BMKG</p>
          </a>

          <a
            href="https://lampung.bmkg.go.id/geo/map_seis.php"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-6 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm hover:shadow-2xl border border-white hover:border-blue-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                <Map className="w-6 h-6" />
              </div>
              <ExternalLink className="w-5 h-5 text-earth-300 group-hover:text-blue-600 transition-colors duration-300" />
            </div>
            <h4 className="relative z-10 font-bold text-earth-900 text-base mb-2 group-hover:text-blue-800 transition-colors">Peta Interaktif Gempa</h4>
            <p className="relative z-10 text-sm text-earth-600 leading-relaxed font-medium">Visualisasi peta kegempaan BMKG interaktif</p>
          </a>

          <a
            href="https://petabencana.id/map"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-6 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm hover:shadow-2xl border border-white hover:border-amber-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-amber-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <ExternalLink className="w-5 h-5 text-earth-300 group-hover:text-amber-600 transition-colors duration-300" />
            </div>
            <h4 className="relative z-10 font-bold text-earth-900 text-base mb-2 group-hover:text-amber-800 transition-colors">Peta Bencana</h4>
            <p className="relative z-10 text-sm text-earth-600 leading-relaxed font-medium">Informasi kebencanaan wilayah secara langsung</p>
          </a>

          <a
            href="https://magma.esdm.go.id/v1"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-6 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm hover:shadow-2xl border border-white hover:border-red-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-red-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <ExternalLink className="w-5 h-5 text-earth-300 group-hover:text-red-600 transition-colors duration-300" />
            </div>
            <h4 className="relative z-10 font-bold text-earth-900 text-base mb-2 group-hover:text-red-800 transition-colors">MAGMA ESDM</h4>
            <p className="relative z-10 text-sm text-earth-600 leading-relaxed font-medium">Pusat data detail kebencanaan geologi (ESDM)</p>
          </a>
        </div>
      </motion.div>
    </PageTransition>
  );
}
