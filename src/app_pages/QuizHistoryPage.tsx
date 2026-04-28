'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { History, Trophy, Calendar, MapPin, AlertTriangle, User } from 'lucide-react';
import PageTransition from '../components/PageTransition';

interface QuizHistoryItem {
  id: string;
  playerName: string;
  regionId: string;
  disasterId: string;
  score: number;
  createdAt: string;
}

export default function QuizHistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsLoading(false);
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/quiz-history')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHistory(data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  if (isLoading) {
    return (
      <PageTransition className="p-8 max-w-4xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin" />
      </PageTransition>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <PageTransition className="p-8 max-w-4xl mx-auto w-full text-center mt-12">
        <h2 className="text-2xl font-bold text-earth-900 mb-4">Silakan Masuk</h2>
        <p className="text-earth-600">Anda harus login untuk melihat riwayat kuis.</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-leaf-100 text-leaf-600 rounded-2xl flex items-center justify-center shadow-sm">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-earth-900">Riwayat Kuis</h1>
          <p className="text-earth-600">Lihat pencapaian dan skor kuis Anda sebelumnya.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <div className="w-16 h-16 bg-earth-100 text-earth-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-earth-900 mb-2">Belum Ada Riwayat</h3>
          <p className="text-earth-600">Anda belum pernah menyelesaikan kuis. Ayo mulai belajar dan kerjakan kuisnya!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item, index) => {
            const date = new Date(item.createdAt);
            const formattedDate = new Intl.DateTimeFormat('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short'
            }).format(date);
            
            const isFlood = item.disasterId === 'banjir';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isFlood ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-earth-900 capitalize text-lg">
                      {item.disasterId.replace('-', ' ')}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-earth-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-earth-700">
                        <User className="w-3.5 h-3.5" />
                        <span>{item.playerName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="capitalize">{item.regionId.replace('-', ' ')}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:border-l border-earth-200 sm:pl-6">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-earth-500 uppercase font-bold tracking-wider mb-1">Skor</p>
                    <div className={`text-3xl font-black ${item.score >= 70 ? 'text-leaf-600' : 'text-red-500'}`}>
                      {item.score}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
