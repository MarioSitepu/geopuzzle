'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, Trophy, ChevronDown, Volume2, VolumeX, ChevronUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import PageTransition from '../components/PageTransition';
import ClassificationPuzzle from '../components/puzzles/ClassificationPuzzle';
import MatchingPuzzle from '../components/puzzles/MatchingPuzzle';
import FillBlankPuzzle from '../components/puzzles/FillBlankPuzzle';
import OrderingPuzzle from '../components/puzzles/OrderingPuzzle';
import GridClassificationPuzzle from '../components/puzzles/GridClassificationPuzzle';
import DecisionPuzzle from '../components/puzzles/DecisionPuzzle';
import { useGameStore } from '../store/useGameStore';
import { useRef } from 'react';

export default function PuzzleGame() {
  const params = useParams();
  const regionId = params?.regionId as string;
  const disasterId = params?.disasterId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'awal';
  const { setScore, isMuted, toggleMute, playerName, setPlayerName } = useGameStore();
  
  const { data: session } = useSession();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
      setShowScrollToTop(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to capture potential reload state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user?.name && !playerName) {
      setPlayerName(session.user.name);
    }
  }, [session, playerName, setPlayerName]);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted, setHasStarted]);

  const stages = disasterId === 'longsor' && level === 'awal' 
    ? [
        { id: 'grid-classification', component: GridClassificationPuzzle, stageIndex: 0 },
        { id: 'classification-1', component: ClassificationPuzzle, stageIndex: 0 },
        { id: 'classification-2', component: ClassificationPuzzle, stageIndex: 1 },
      ]
    : (disasterId === 'gunung-api' && level === 'awal')
    ? [
        { id: 'fill-blank', component: FillBlankPuzzle, stageIndex: 0 },
        { id: 'classification-1', component: ClassificationPuzzle, stageIndex: 0 },
        { id: 'classification-2', component: ClassificationPuzzle, stageIndex: 1 },
      ]
    : (disasterId === 'tsunami' && level === 'awal')
    ? [
        { id: 'fill-blank-1', component: FillBlankPuzzle },
        { id: 'fill-blank-2', component: FillBlankPuzzle },
      ]
    : level === 'awal'
    ? [
        { id: 'fill-blank', component: FillBlankPuzzle },
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'ordering', component: OrderingPuzzle },
      ]
    : (disasterId === 'gunung-api' && level === 'atas')
    ? [
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'fill-blank-2', component: FillBlankPuzzle },
      ]
    : (disasterId === 'tsunami' && level === 'atas')
    ? [
        { id: 'classification-1', component: ClassificationPuzzle, stageIndex: 0 },
        { id: 'decision', component: DecisionPuzzle, stageIndex: 1 },
      ]
    : (disasterId === 'longsor' && level === 'atas')
    ? [
        { id: 'classification', component: ClassificationPuzzle },
        { id: 'matching', component: MatchingPuzzle },
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
  }, [timeLeft, isGameOver, hasStarted]);

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
        router.push(`/regions/${regionId}/${disasterId}/result?score=${finalScore}&level=${level}`);
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
      router.push(`/regions/${regionId}/${disasterId}/result?score=${finalScore}&timeout=true&level=${level}`);
    }, 1500);
  };

  const currentStageData = stages[currentStage];
  const CurrentPuzzle = currentStageData?.component;

  if (!CurrentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 rounded-full animate-spin border-earth-200 border-t-earth-600" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!hasStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 rounded-full animate-spin border-earth-200 border-t-earth-600" />
      </div>
    );
  }
  // Dynamic styles for the floating Scroll-to-Top button based on disaster type
  const getDisasterStyles = () => {
    switch (disasterId) {
      case 'gunung-api':
        return {
          bg: 'bg-[#FFF8F3] hover:bg-[#FFF3EB]',
          strokeTrack: 'stroke-orange-100',
          strokeProgress: 'stroke-orange-500',
          chevron: 'text-orange-700',
          border: 'border-orange-200/30'
        };
      case 'tsunami':
        return {
          bg: 'bg-[#F0F7FF] hover:bg-[#E0EFFF]',
          strokeTrack: 'stroke-blue-100',
          strokeProgress: 'stroke-blue-500',
          chevron: 'text-blue-700',
          border: 'border-blue-200/30'
        };
      case 'longsor':
      default:
        return {
          bg: 'bg-[#FAF6EE] hover:bg-[#F3EDE2]',
          strokeTrack: 'stroke-earth-200',
          strokeProgress: 'stroke-rose-500',
          chevron: 'text-leaf-700',
          border: 'border-earth-100/30'
        };
    }
  };

  const styles = getDisasterStyles();

  return (
    <PageTransition className="p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
        <Link 
          href={`/regions/${regionId}/${disasterId}/learn?level=${level}`} 
          className="inline-flex items-center gap-1.5 text-earth-600 hover:text-earth-900 transition-colors text-xs sm:text-sm font-bold self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Kembali ke Materi</span>
          <span className="inline sm:hidden">Kembali</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end sm:justify-start">
          <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm text-earth-700 font-extrabold text-[11px] sm:text-sm border border-earth-100/50">
            <Trophy className="w-3.5 h-3.5 sm:w-4 h-4 text-yellow-500 shrink-0" />
            <span>Tahap {currentStage + 1}/{stages.length}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm font-extrabold text-[11px] sm:text-sm border border-earth-100/50 ${timeLeft < 30 ? 'bg-red-50 border-red-100 text-red-600 animate-pulse' : 'bg-white text-earth-700'}`}>
            <Timer className="w-3.5 h-3.5 sm:w-4 h-4 shrink-0" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={toggleMute}
            className="p-1.5 sm:p-2 bg-white rounded-full shadow-sm text-earth-600 hover:text-earth-900 transition-all hover:scale-110 active:scale-95 border border-earth-100 shrink-0 cursor-pointer"
            title={isMuted ? "Unmute Music" : "Mute Music"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 h-4" />}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full pb-20"
              >
                <CurrentPuzzle 
                  onComplete={handleStageComplete} 
                  disasterId={disasterId} 
                  level={level} 
                  stageIndex={(currentStageData && 'stageIndex' in currentStageData) ? (currentStageData as any).stageIndex : currentStage} 
                />
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

          {/* Scroll to Top floating progress button */}
          <AnimatePresence>
            {showScrollToTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${styles.bg} shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all border ${styles.border} group`}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 50 50">
                  {/* Soft background progress outline track */}
                  <circle
                    cx="25"
                    cy="25"
                    r="22"
                    className={styles.strokeTrack}
                    strokeWidth="2.5"
                    fill="transparent"
                  />
                  {/* Dynamic progress outline ring (pink/coral red/blue/orange) */}
                  <motion.circle
                    cx="25"
                    cy="25"
                    r="22"
                    className={styles.strokeProgress}
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={(2 * Math.PI * 22) * (1 - scrollProgress)}
                    strokeLinecap="round"
                    transition={{ type: "tween", ease: "easeOut" }}
                  />
                </svg>
                <ChevronUp className={`w-5 h-5 sm:w-6 h-6 ${styles.chevron} relative z-10 transition-transform group-hover:-translate-y-0.5 font-bold`} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
