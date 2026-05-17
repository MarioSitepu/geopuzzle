'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Trophy, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useSession } from 'next-auth/react';
import PageTransition from '../components/PageTransition';
import ClassificationPuzzle from '../components/puzzles/ClassificationPuzzle';
import MatchingPuzzle from '../components/puzzles/MatchingPuzzle';
import FillBlankPuzzle from '../components/puzzles/FillBlankPuzzle';
import OrderingPuzzle from '../components/puzzles/OrderingPuzzle';
import { useGameStore } from '../store/useGameStore';
import { useRef } from 'react';

export default function PuzzleGame() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'awal';
  const { setScore, isMuted, toggleMute } = useGameStore();
  
  const { data: session } = useSession();
  const [hasStarted, setHasStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (session?.user?.name && !playerName) {
      setPlayerName(session.user.name);
    }
  }, [session, playerName]);

  const stages = disasterId === 'longsor' && level === 'awal' 
    ? [
        { id: 'classification-1', component: ClassificationPuzzle },
        { id: 'classification-2', component: ClassificationPuzzle },
      ]
    : (disasterId === 'gunung-api' && level === 'awal')
    ? [
        { id: 'fill-blank', component: FillBlankPuzzle },
        { id: 'classification-1', component: ClassificationPuzzle },
        { id: 'classification-2', component: ClassificationPuzzle },
      ]
    : level === 'awal'
    ? [
        { id: 'fill-blank', component: FillBlankPuzzle },
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'ordering', component: OrderingPuzzle },
      ]
    : (disasterId === 'gunung-api' && level === 'lanjut')
    ? [
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'fill-blank-2', component: FillBlankPuzzle },
        { id: 'ordering', component: OrderingPuzzle },
      ]
    : [
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'matching', component: disasterId === 'longsor' ? MatchingPuzzle : OrderingPuzzle },
        { id: 'fill-blank', component: FillBlankPuzzle },
      ];

  useEffect(() => {
    // Play background music for all puzzles
    if (!hasStarted) return;

    if (!audioRef.current) {
      const musicFiles = [
        '/sound/MUSIC QUIZ 1.mp3',
        '/sound/BACKGROUND MUSIC 1.mp3',
        '/sound/BACKGROUND MUSIC 2.mp3'
      ];
      
      // Pick a random track
      const randomMusic = musicFiles[Math.floor(Math.random() * musicFiles.length)];
      audioRef.current = new Audio(randomMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    
    const audio = audioRef.current;
    
    if (!isMuted) {
      audio.play().catch(err => console.warn("Background music autoplay was blocked:", err));
    } else {
      audio.pause();
    }

    // Cleanup: stop music when leaving the puzzle page
    return () => {
      audio.pause();
    };
  }, [hasStarted, isMuted]);

  useEffect(() => {
    if (!hasStarted) return;
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

      // Save to database
      fetch('/api/quiz-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName || session?.user?.name || 'Anonim',
          regionId,
          disasterId,
          score: finalScore
        })
      }).catch(console.error);

      setTimeout(() => {
        router.push(`/regions/${regionId}/${disasterId}/result?score=${finalScore}`);
      }, 1500);
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    const finalScore = Math.round(totalScore / stages.length);
    setScore(`${regionId}-${disasterId}`, finalScore);

    // Save to database
    fetch('/api/quiz-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerName: playerName || session?.user?.name || 'Anonim',
        regionId,
        disasterId,
        score: finalScore
      })
    }).catch(console.error);

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

  if (!hasStarted) {
    return (
      <PageTransition className="p-4 sm:p-8 max-w-xl mx-auto w-full flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-8 sm:p-12 rounded-4xl w-full text-center"
        >
          <div className="w-16 h-16 bg-leaf-100 text-leaf-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-earth-900 mb-2">Siap Memulai?</h2>
          <p className="text-earth-600 mb-8">Masukkan namamu untuk dicatat di riwayat kuis.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); if(playerName.trim()) setHasStarted(true); }}>
            <input 
              type="text" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nama Pemain"
              className="w-full px-6 py-4 rounded-xl border-2 border-earth-200 focus:border-leaf-500 focus:outline-none mb-6 text-center font-bold text-earth-800 text-xl"
              required
            />
            <button 
              type="submit"
              disabled={!playerName.trim()}
              className="w-full py-4 bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              Mulai Kuis
            </button>
          </form>
        </motion.div>
      </PageTransition>
    );
  }

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
          <button
            onClick={toggleMute}
            className="p-2 bg-white rounded-full shadow-sm text-earth-600 hover:text-earth-900 transition-all hover:scale-110 active:scale-95 border border-earth-100"
            title={isMuted ? "Unmute Music" : "Mute Music"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grow flex flex-col">
        <div className="w-full bg-earth-200 h-2 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className={`h-full ${disasterId === 'gunung-api' ? 'bg-orange-500' : disasterId === 'tsunami' ? 'bg-blue-500' : 'bg-earth-600'}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStage) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="grow relative">
          <AnimatePresence mode="wait">
            {!isGameOver ? (
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full pb-20"
              >
                <CurrentPuzzle onComplete={handleStageComplete} disasterId={disasterId} level={level} stageIndex={currentStage} />
              </motion.div>
            ) : (
              <motion.div
                key="game-over"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full py-20 flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-3xl font-bold text-earth-900 mb-2">Menyimpan Hasil...</h2>
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mt-4 ${disasterId === 'gunung-api' ? 'border-orange-200 border-t-orange-600' : disasterId === 'tsunami' ? 'border-blue-200 border-t-blue-600' : 'border-earth-200 border-t-earth-600'}`} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-earth-400 pointer-events-none md:hidden"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
