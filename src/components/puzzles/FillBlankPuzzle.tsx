'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export default function FillBlankPuzzle({ onComplete }: { onComplete: (score: number) => void }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const correctAnswer = "mitigasi";

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
        Serangkaian upaya untuk mengurangi risiko bencana, baik melalui pembangunan fisik maupun penyadaran dan peningkatan kemampuan menghadapi ancaman bencana disebut dengan 
        <form onSubmit={handleSubmit} className="inline-block mx-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitted}
            className={cn(
              "border-b-2 border-earth-400 bg-transparent px-2 py-1 w-32 text-center focus:outline-none focus:border-leaf-500 transition-colors font-bold",
              isSubmitted && answer.toLowerCase().trim() === correctAnswer && "border-leaf-500 text-leaf-600",
              isSubmitted && answer.toLowerCase().trim() !== correctAnswer && "border-red-500 text-red-600"
            )}
            placeholder="..."
            autoFocus
          />
        </form>
        bencana.
      </div>

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
          className="px-8 py-3 bg-leaf-600 text-white rounded-full font-bold shadow-lg hover:bg-leaf-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            answer.toLowerCase().trim() === correctAnswer ? "bg-leaf-100 text-leaf-700" : "bg-red-50 text-red-600"
          )}
        >
          {answer.toLowerCase().trim() === correctAnswer ? "Tepat Sekali!" : `Kurang tepat. Jawaban yang benar adalah "${correctAnswer}".`}
        </motion.div>
      )}
    </div>
  );
}
