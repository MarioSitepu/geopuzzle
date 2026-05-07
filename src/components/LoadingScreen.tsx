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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Cinematic Background - Removed Orbs for "Putih Semua" */}
      <div className="absolute inset-0 pointer-events-none">
        {/* All decorative elements removed for minimalist white look */}
      </div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-lg px-6 text-center">
        {/* Main Logo Container with Rotating Glow */}
        <div className="relative mb-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 bg-gradient-to-tr from-leaf-400/0 via-leaf-400/40 to-earth-400/0 rounded-full blur-2xl"
          />
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.2 }}
            className="relative w-32 h-32 rounded-[3rem] bg-gradient-to-br from-leaf-500 to-leaf-700 text-white flex items-center justify-center font-bold text-7xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] border-4 border-white/30 backdrop-blur-sm"
          >
            G
          </motion.div>
        </div>

        {/* Brand Name with Reveal Effect */}
        <div className="overflow-hidden mb-12">
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
            Explore . Learn . Protect
          </motion.p>
        </div>

        {/* Institution Logos with Staggered Entry */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex items-center gap-12 px-12 py-8 bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.05)]"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={iteraLogo} alt="ITERA Logo" className="h-16 w-auto object-contain brightness-110 drop-shadow-md" />
          </motion.div>
          
          <div className="w-px h-12 bg-earth-200/60" />
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={tgeologiLogo} alt="Teknik Geologi Logo" className="h-16 w-auto object-contain brightness-110 drop-shadow-md" />
          </motion.div>
        </motion.div>

        {/* Sophisticated Loading Indicator */}
        <div className="mt-16 w-full max-w-[280px]">
          <div className="flex justify-between text-[10px] font-bold text-earth-400 uppercase tracking-widest mb-3 px-1">
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
      </div>
    </motion.div>
  );
}
