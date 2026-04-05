'use client';

import { motion } from 'motion/react';
import { ShieldAlert, Home, Trees, AlertTriangle, Users } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const MITIGATION_TIPS = [
  {
    title: 'Kenali Tanda Peringatan',
    description: 'Pahami tanda-tanda alam seperti retakan tanah, air sumur yang tiba-tiba keruh, atau suara gemuruh dari bukit.',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  {
    title: 'Penghijauan Lereng',
    description: 'Tanam pohon dengan akar dalam di area lereng untuk mengikat tanah dan mencegah erosi.',
    icon: Trees,
    color: 'text-leaf-600',
    bg: 'bg-leaf-100',
  },
  {
    title: 'Konstruksi Aman',
    description: 'Hindari membangun rumah di tepi tebing atau di daerah rawan banjir. Gunakan konstruksi yang tahan bencana.',
    icon: Home,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    title: 'Edukasi Masyarakat',
    description: 'Ikuti simulasi bencana dan pastikan keluarga tahu jalur evakuasi serta titik kumpul yang aman.',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
];

export default function MitigationPage() {
  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto bg-leaf-100 text-leaf-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
        >
          <ShieldAlert className="w-8 h-8" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-earth-900 mb-4"
        >
          Mitigasi Bencana
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-earth-600 max-w-2xl mx-auto"
        >
          Langkah-langkah preventif dan responsif untuk meminimalisir dampak dari bencana geologi di lingkungan sekitar kita.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {MITIGATION_TIPS.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="glass p-6 sm:p-8 rounded-3xl hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${tip.bg} ${tip.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-3">{tip.title}</h3>
              <p className="text-earth-600 leading-relaxed">{tip.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 p-8 bg-earth-900 text-white rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200')] opacity-10 object-cover" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Siap Menghadapi Bencana?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Pengetahuan adalah kunci utama dalam mitigasi bencana. Mari terus belajar dan bagikan informasi ini kepada orang terdekat.
          </p>
          <a 
            href="tel:112" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-colors shadow-lg shadow-red-500/30"
          >
            Panggilan Darurat (112)
          </a>
        </div>
      </motion.div>
    </PageTransition>
  );
}
