'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function FillBlankPuzzle({ onComplete, disasterId }: { onComplete: (score: number) => void, disasterId?: string }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isFlood = disasterId === 'banjir';
  const correctAnswer = isFlood ? "bandang" : "mitigasi";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setIsSubmitted(true);
    const isCorrect = answer.toLowerCase().trim() === correctAnswer;
    
    setTimeout(() => {
      onComplete(isCorrect ? 100 : 0);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      <div>
        <h2 className="text-2xl font-bold text-earth-900">Lengkapi Kalimat</h2>
        <p className="text-earth-600 mt-2">Isi bagian yang kosong dengan kata yang tepat.</p>
      </div>

      <div className="glass p-8 rounded-3xl text-xl leading-relaxed text-earth-800">
        {isFlood 
          ? "Aliran air dalam jumlah besar dan cepat yang membawa lumpur, batu, serta material lainnya, biasanya terjadi akibat hujan deras di daerah pegunungan disebut banjir "
          : "Serangkaian upaya untuk mengurangi risiko bencana, baik melalui pembangunan fisik maupun penyadaran dan peningkatan kemampuan menghadapi ancaman bencana disebut dengan "
        }
        <form onSubmit={handleSubmit} className="inline-block mx-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitted}
            className={cn(
              "border-b-2 border-earth-400 bg-transparent px-2 py-1 w-32 text-center focus:outline-none transition-colors font-bold",
              isFlood ? "focus:border-blue-500" : "focus:border-earth-600",
              isSubmitted && answer.toLowerCase().trim() === correctAnswer && (isFlood ? "border-blue-500 text-blue-600" : "border-earth-600 text-earth-700"),
              isSubmitted && answer.toLowerCase().trim() !== correctAnswer && "border-red-500 text-red-600"
            )}
            placeholder="..."
            autoFocus
          />
        </form>
        {isFlood ? "." : "bencana."}
      </div>

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className={`px-8 py-3 text-white rounded-full font-bold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isFlood ? "bg-blue-600 hover:bg-blue-700" : "bg-earth-700 hover:bg-earth-800"
          }`}
        >
          Kirim Jawaban
        </button>
      )}

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-2xl font-bold text-lg",
            answer.toLowerCase().trim() === correctAnswer ? (isFlood ? "bg-blue-50 text-blue-700" : "bg-earth-100 text-earth-800") : "bg-red-50 text-red-600"
          )}
        >
          {answer.toLowerCase().trim() === correctAnswer ? "Tepat Sekali!" : "Kurang tepat. Coba lagi!"}
        </motion.div>
      )}
    </div>
  );
}
