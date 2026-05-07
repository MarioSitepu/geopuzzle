'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  useDraggable, 
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

// --- Components ---
function DraggableWord({ word, id, isUsed }: { word: string; id: string; isUsed: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { word },
    disabled: isUsed
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "px-5 py-3 bg-white rounded-2xl shadow-sm border-2 border-earth-100 cursor-grab active:cursor-grabbing text-base font-bold text-earth-800 transition-all select-none",
        isUsed ? "opacity-30 grayscale cursor-not-allowed border-earth-100 shadow-none" : "hover:border-leaf-400 hover:shadow-md hover:-translate-y-0.5",
        isDragging && "opacity-0"
      )}
    >
      {word}
    </div>
  );
}

function DropZone({ droppedWord, isFlood, isCorrect, isSubmitted, onReset }: { 
  droppedWord: string | null; 
  isFlood: boolean; 
  isCorrect?: boolean; 
  isSubmitted: boolean;
  onReset: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
    disabled: isSubmitted
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "inline-flex items-center gap-3 px-4 h-14 min-w-[160px] mx-2 border-2 border-dashed rounded-2xl transition-all duration-300 align-middle relative group",
        isOver ? (isFlood ? "bg-blue-50 border-blue-400 scale-105" : "bg-leaf-50 border-leaf-400 scale-105") : "bg-earth-50/30 border-earth-200",
        droppedWord && "border-solid bg-white shadow-sm",
        isSubmitted && isCorrect === true && "border-leaf-500 bg-leaf-50 shadow-none",
        isSubmitted && isCorrect === false && "border-red-500 bg-red-50 shadow-none"
      )}
    >
      <AnimatePresence mode="wait">
        {droppedWord ? (
          <motion.div 
            key="word"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-between w-full gap-2"
          >
            <span className={cn(
              "font-bold text-lg",
              isSubmitted && isCorrect === true ? "text-leaf-700" : isSubmitted && isCorrect === false ? "text-red-600" : "text-earth-900"
            )}>
              {droppedWord}
            </span>
            {!isSubmitted && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                className="p-1 hover:bg-earth-100 rounded-lg text-earth-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            {isSubmitted && isCorrect === true && <CheckCircle2 className="w-5 h-5 text-leaf-500" />}
            {isSubmitted && isCorrect === false && <AlertCircle className="w-5 h-5 text-red-500" />}
          </motion.div>
        ) : (
          <motion.span 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-earth-300 text-sm italic font-medium w-full text-center"
          >
            Tarik kata ke sini
          </motion.span>
        )}
      </AnimatePresence>
      
      {isOver && !droppedWord && (
        <motion.div 
          layoutId="highlight"
          className="absolute inset-0 bg-leaf-400/10 rounded-2xl border-2 border-leaf-400 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </div>
  );
}

export default function FillBlankPuzzle({ onComplete, disasterId }: { onComplete: (score: number) => void, disasterId?: string }) {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [droppedWord, setDroppedWord] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isFlood = disasterId === 'banjir';
  const correctAnswer = "Mitigasi";

  const choices = [
    { id: 'opt1', word: 'Mitigasi' },
    { id: 'opt2', word: 'Penolongan' },
    { id: 'opt3', word: 'Dedikasi' },
    { id: 'opt4', word: 'Edukasi' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWord(event.active.data.current?.word);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over && over.id === 'drop-zone') {
      setDroppedWord(activeWord);
    }
    setActiveWord(null);
  };

  const checkAnswer = () => {
    if (!droppedWord) return;
    setIsSubmitted(true);
    const isCorrect = droppedWord === correctAnswer;
    
    setTimeout(() => {
      onComplete(isCorrect ? 100 : 0);
    }, 1500);
  };

  const isCorrect = droppedWord === correctAnswer;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-black text-earth-900 tracking-tight">Lengkapi Konsep Geologi</h2>
        <p className="text-earth-600 mt-2 font-medium">Tarik kata yang tepat ke dalam kotak kosong di dalam kalimat.</p>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Choices Panel */}
          <div className="lg:w-1/4 w-full bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-earth-100 shadow-sm sticky top-8">
            <h3 className="text-[10px] font-black text-earth-400 uppercase tracking-[0.2em] mb-6 text-center">Pilihan Kata</h3>
            <div className="flex flex-wrap lg:flex-col gap-3 justify-center">
              {choices.map((choice) => (
                <DraggableWord 
                  key={choice.id} 
                  id={choice.id} 
                  word={choice.word} 
                  isUsed={droppedWord === choice.word}
                />
              ))}
            </div>
          </div>

          {/* Sentence Area */}
          <div className="lg:w-3/4 w-full space-y-8">
            <div className="bg-white p-10 sm:p-14 rounded-[3rem] text-xl sm:text-2xl leading-[2] text-earth-800 shadow-2xl shadow-earth-900/5 relative border border-earth-100">
              <div className="relative z-10">
                {isFlood 
                  ? <>
                      Upaya struktural maupun non-struktural yang dilakukan untuk meminimalisir dampak kerugian akibat bencana air bah dikenal dengan istilah
                      <DropZone 
                        droppedWord={droppedWord} 
                        isFlood={isFlood} 
                        isCorrect={isSubmitted ? isCorrect : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWord(null)}
                      />
                      bencana demi keselamatan penduduk.
                    </>
                  : <>
                      Serangkaian upaya untuk mengurangi risiko bencana, baik melalui pembangunan fisik maupun penyadaran kemampuan menghadapi ancaman disebut
                      <DropZone 
                        droppedWord={droppedWord} 
                        isFlood={isFlood} 
                        isCorrect={isSubmitted ? isCorrect : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWord(null)}
                      />
                      bencana yang mencakup perencanaan dan implementasi.
                    </>
                }
              </div>
            </div>

            <AnimatePresence>
              {droppedWord && !isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={checkAnswer}
                    className={cn(
                      "group px-12 py-4 bg-leaf-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-leaf-600/30 hover:bg-leaf-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    )}
                  >
                    Periksa Jawaban
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "p-8 rounded-[2rem] font-bold text-xl text-center shadow-xl flex items-center justify-center gap-4",
                  isCorrect 
                    ? "bg-leaf-500 text-white shadow-leaf-500/20" 
                    : "bg-red-500 text-white shadow-red-500/20"
                )}
              >
                {isCorrect ? (
                  <>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span>Luar Biasa! Jawaban Anda Benar.</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <span>Belum Tepat. Silakan pelajari materinya lagi!</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Drag Overlay for smooth visuals */}
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeWord ? (
            <div className="px-5 py-3 bg-white rounded-2xl shadow-2xl border-2 border-leaf-500 text-base font-bold text-earth-900 cursor-grabbing scale-110 rotate-3 transition-transform">
              {activeWord}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
