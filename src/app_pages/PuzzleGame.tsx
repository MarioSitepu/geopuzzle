'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ClassificationPuzzle from '../components/puzzles/ClassificationPuzzle';
import FillBlankPuzzle from '../components/puzzles/FillBlankPuzzle';
import OrderingPuzzle from '../components/puzzles/OrderingPuzzle';
import { useGameStore } from '../store/useGameStore';

export default function PuzzleGame() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;
  const router = useRouter();
  const { setScore } = useGameStore();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const stages = [
    { id: 'classification', component: ClassificationPuzzle },
    { id: 'ordering', component: OrderingPuzzle },
    { id: 'fill-blank', component: FillBlankPuzzle },
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver) {
      handleGameOver();
    }
  }, [timeLeft, isGameOver]);

  const handleStageComplete = (score: number) => {
    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);
    
    if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      // Game finished
      const finalScore = Math.round(newTotalScore / stages.length);
      setScore(`${regionId}-${disasterId}`, finalScore);
      setIsGameOver(true);
      setTimeout(() => {
        router.push(`/regions/${regionId}/${disasterId}/result?score=${finalScore}`);
      }, 1500);
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    const finalScore = Math.round(totalScore / stages.length);
    setScore(`${regionId}-${disasterId}`, finalScore);
    setTimeout(() => {
      router.push(`/regions/${regionId}/${disasterId}/result?score=${finalScore}&timeout=true`);
    }, 1500);
  };

  const CurrentPuzzle = stages[currentStage].component;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href={`/regions/${regionId}/${disasterId}/learn`} 
          className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Materi
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-earth-700 font-medium">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Tahap {currentStage + 1}/{stages.length}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm font-medium ${timeLeft < 30 ? 'bg-red-100 text-red-600' : 'bg-white text-earth-700'}`}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="w-full bg-earth-200 h-2 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-leaf-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStage) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex-grow relative">
          <AnimatePresence mode="wait">
            {!isGameOver ? (
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <CurrentPuzzle onComplete={handleStageComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="game-over"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-3xl font-bold text-earth-900 mb-2">Menyimpan Hasil...</h2>
                <div className="w-12 h-12 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin mt-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
