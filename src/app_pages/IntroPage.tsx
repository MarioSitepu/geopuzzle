'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Globe, AlertTriangle, ArrowRight, ShieldCheck, HeartPulse, Building, Activity } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function IntroPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const impacts = [
    { icon: HeartPulse, text: "Kematian massal & korban jiwa", color: "text-red-500", bg: "bg-red-50" },
    { icon: Building, text: "Kerusakan infrastruktur & hunian", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: Activity, text: "Gangguan aktivitas & ekonomi", color: "text-amber-500", bg: "bg-amber-50" },
    { icon: ShieldCheck, text: "Penularan wabah & krisis lingkungan", color: "text-leaf-600", bg: "bg-leaf-50" },
  ];

  return (
    <PageTransition className="justify-center items-center p-4 sm:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full space-y-12"
      >
        {/* Definition Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="inline-flex p-4 bg-leaf-100 rounded-3xl text-leaf-600 mb-2">
            <Globe className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-earth-900 tracking-tight">
            APA SIH <span className="text-leaf-600">BENCANA GEOLOGI</span> ITU?
          </h1>
          <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto">
            Bencana geologi merupakan peristiwa alam yang berhubungan dengan proses-proses di dalam bumi dan dapat menyebabkan dampak buruk pada kehidupan manusia, harta benda, dan lingkungan.
          </p>
        </motion.div>

        {/* Impacts Section */}
        <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 sm:p-12 space-y-8 border-white/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <AlertTriangle className="w-32 h-32 text-red-600" />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-earth-900">DAMPAK BURUKNYA APA AJA?</h2>
          </div>

          <p className="text-lg text-earth-700 italic border-l-4 border-red-400 pl-4">
            Dampak buruk yang dihasilkan dapat berupa kematian massal, kerusakan infrastruktur, mengganggu aktifitas manusia, membawa wabah, menyebabkan kerugian yang mendalam dan masih banyak lagi!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {impacts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-white/20">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-earth-800">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-earth-800 rounded-full font-semibold shadow-md hover:bg-earth-50 transition-all duration-300"
            >
              Kembali
            </Link>
            <Link
              href="/regions"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-leaf-600 text-white rounded-full font-bold text-xl shadow-xl shadow-leaf-600/30 hover:bg-leaf-700 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Mulai Menjelajah Peta
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-earth-500 text-sm font-medium">
            Siap untuk memahami potensi bencana di sekitarmu?
          </p>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
