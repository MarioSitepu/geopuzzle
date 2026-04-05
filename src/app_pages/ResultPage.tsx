'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Trophy, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useGameStore } from '../store/useGameStore';

export default function ResultPage() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;
  const searchParams = useSearchParams();
  const score = parseInt(searchParams?.get('score') || '0', 10);
  const isTimeout = searchParams?.get('timeout') === 'true';
  
  const { unlockDisaster } = useGameStore();
  const isSuccess = score >= 70;

  useEffect(() => {
    if (isSuccess && regionId) {
      // Logic to unlock next disaster or region could go here
      // For now, we just ensure current is unlocked
      unlockDisaster(regionId, disasterId || '');
    }
  }, [isSuccess, regionId, disasterId, unlockDisaster]);

  return (
    <PageTransition className="p-4 sm:p-8 max-w-2xl mx-auto w-full flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden"
      >
        {isSuccess && (
          <div className="absolute inset-0 bg-gradient-to-b from-leaf-400/20 to-transparent -z-10" />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl"
          style={{ backgroundColor: isSuccess ? '#eef4ec' : '#fef2f2' }}
        >
          {isSuccess ? (
            <Trophy className="w-12 h-12 text-leaf-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </motion.div>

        <h1 className="text-4xl font-bold text-earth-900 mb-2">
          {isSuccess ? 'Selamat Kamu Berhasil!' : 'Jangan Menyerah!'}
        </h1>
        
        <p className="text-earth-600 mb-8 text-lg">
          {isTimeout 
            ? 'Waktu kamu habis. Coba kerjakan lebih cepat di kesempatan berikutnya.'
            : isSuccess 
              ? 'Kamu telah memahami materi dengan sangat baik.' 
              : 'Masih ada beberapa konsep yang perlu dipelajari lagi.'}
        </p>

        <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-sm border border-earth-100 mb-10">
          <p className="text-sm text-earth-500 font-medium uppercase tracking-wider mb-1">Skor Akhir</p>
          <p className={`text-5xl font-black ${isSuccess ? 'text-leaf-600' : 'text-earth-800'}`}>
            {score}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isSuccess ? (
            <>
              <Link
                href={`/regions/${regionId}/${disasterId}/learn`}
                className="w-full sm:w-auto px-8 py-4 bg-white text-earth-800 rounded-full font-semibold shadow-md hover:bg-earth-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Pelajari Lagi
              </Link>
              <Link
                href={`/regions/${regionId}/${disasterId}/puzzle`}
                className="w-full sm:w-auto px-8 py-4 bg-leaf-600 text-white rounded-full font-semibold shadow-lg hover:bg-leaf-700 transition-colors flex items-center justify-center gap-2"
              >
                Coba Lagi
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/regions/${regionId}`}
                className="w-full sm:w-auto px-8 py-4 bg-white text-earth-800 rounded-full font-semibold shadow-md hover:bg-earth-50 transition-colors flex items-center justify-center gap-2"
              >
                Menu Wilayah
              </Link>
              <Link
                href="/regions"
                className="w-full sm:w-auto px-8 py-4 bg-leaf-600 text-white rounded-full font-semibold shadow-lg hover:bg-leaf-700 transition-colors flex items-center justify-center gap-2"
              >
                Pilih Wilayah Lain
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </PageTransition>
  );
}
