'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Play, FileText, ExternalLink } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function LearningModule() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;

  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <Link 
        href={`/regions/${regionId}`} 
        className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-leaf-100 text-leaf-600 rounded-xl">
                <Play className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-earth-900">Video Pembelajaran</h2>
            </div>
            
            <div className="aspect-video rounded-2xl overflow-hidden bg-earth-800 relative shadow-inner">
              {/* Placeholder for actual video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <img 
                src={disasterId === 'banjir' 
                  ? "https://images.unsplash.com/photo-1547683905-f686c993b65e?auto=format&fit=crop&q=80&w=1000"
                  : "https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?auto=format&fit=crop&q=80&w=1000"
                } 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-6 prose prose-earth max-w-none">
              <h3 className="text-xl font-semibold text-earth-900 capitalize">
                Memahami {disasterId} di {regionId?.replace('-', ' ')}
              </h3>
              <p className="text-earth-700 mt-2">
                Simak video di atas untuk memahami proses terjadinya {disasterId}, faktor-faktor pemicu, dan dampaknya terhadap lingkungan dan masyarakat sekitar.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-earth-200 text-earth-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-earth-900">Materi Pendukung</h2>
            </div>

            <div className="space-y-4">
              {[1, 2].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="flex items-start gap-3 p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-earth-200"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ExternalLink className="w-4 h-4 text-earth-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-earth-900 text-sm">Jurnal Geologi Vol. {item}</h4>
                    <p className="text-xs text-earth-500 mt-1">PDF Document • 2.4 MB</p>
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
              href={`/regions/${regionId}/${disasterId}/puzzle`}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-leaf-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-leaf-600/30 hover:bg-leaf-700 hover:scale-[1.02] transition-all duration-300 active:scale-95"
            >
              Mulai Puzzle
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
