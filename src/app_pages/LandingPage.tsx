'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Play, BookOpen, Puzzle, MapPin } from 'lucide-react';
import PageTransition from '../components/PageTransition';
export default function LandingPage() {
  return (
    <PageTransition className="justify-center items-center p-4 sm:p-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
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
          className="relative hidden md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-leaf-400/20 to-earth-400/20 rounded-[3rem] blur-3xl -z-10" />
          <div className="glass rounded-[2.5rem] p-4 aspect-square relative overflow-hidden shadow-2xl border-white/50">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" 
              alt="Geological landscape" 
              className="w-full h-full object-cover rounded-[2rem]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 via-transparent to-transparent rounded-[2rem]" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="glass-dark p-4 rounded-2xl text-white">
                <p className="text-sm font-medium text-white/80 mb-1">Fakta Geologi</p>
                <p className="font-semibold">Pergerakan tanah dapat dipicu oleh curah hujan tinggi dan kemiringan lereng.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
