'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import iteraLogo from './itera.png';
import tgeologiLogo from './tgeologi.png';

export default function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        transition: { duration: 0.6, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start bg-white overflow-hidden"
    >
      {/* Cinematic Background - Removed Orbs for "Putih Semua" */}
      <div className="absolute inset-0 pointer-events-none">
        {/* All decorative elements removed for minimalist white look */}
      </div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-2xl px-6 text-center pt-10">
        {/* Main Logo Container with Rotating Glow */}
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 bg-gradient-to-tr from-leaf-400/0 via-leaf-400/40 to-earth-400/0 rounded-full blur-2xl"
          />
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.2 }}
            className="relative w-72 h-72 flex items-center justify-center"
          >
            <Image 
              src="/images/logo.png" 
              alt="GeoPuzzle Logo" 
              width={288} 
              height={288} 
              className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(34,197,94,0.5)]" 
              priority
            />
          </motion.div>
        </div>

        {/* Brand Name with Reveal Effect */}
        <div className="overflow-hidden mb-6">
          <motion.h2
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            className="text-4xl font-black text-earth-900 tracking-tight"
          >
            GEOLOGICAL<span className="text-leaf-600">PUZZLE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1.5 }}
            className="text-earth-500 font-medium tracking-[0.4em] text-xs uppercase mt-2"
          >
            MITIGASI BENCANA GEOLOGI
          </motion.p>
        </div>

        {/* Sophisticated Loading Indicator - MOVED HERE */}
        <div className="mb-10 w-full max-w-[280px]">
          <div className="flex justify-between text-xs font-bold text-earth-600 uppercase tracking-widest mb-3 px-1">
            <span>Initializing</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              System Ready
            </motion.span>
          </div>
          <div className="h-1.5 w-full bg-earth-200/40 rounded-full overflow-hidden p-[2px] border border-white/50">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full w-2/3 bg-gradient-to-r from-transparent via-leaf-500 to-transparent rounded-full"
            />
          </div>
        </div>

        {/* Institution Logos with Staggered Entry */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-center gap-8 px-10 py-6 bg-white/50 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Image 
              src={iteraLogo} 
              alt="ITERA Logo" 
              height={140}
              className="h-32 w-auto object-contain brightness-110 drop-shadow-lg" 
            />
          </motion.div>
          
          <div className="w-px h-20 bg-earth-200/60" />
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Image 
              src={tgeologiLogo} 
              alt="Teknik Geologi Logo" 
              height={140}
              className="h-32 w-auto object-contain brightness-110 drop-shadow-lg" 
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
