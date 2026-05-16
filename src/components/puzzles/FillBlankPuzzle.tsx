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
        "px-5 py-3 rounded-2xl shadow-sm border-2 cursor-grab active:cursor-grabbing text-base font-black transition-all select-none text-center",
        word === 'Benar' ? "bg-green-500 border-green-600 text-white" : word === 'Salah' ? "bg-red-500 border-red-600 text-white" : "bg-white border-earth-100 text-earth-800",
        isUsed ? "opacity-30 grayscale cursor-not-allowed border-earth-100 shadow-none" : "hover:shadow-md hover:-translate-y-0.5",
        isDragging && "opacity-0"
      )}
    >
      {word}
    </div>
  );
}


export default function FillBlankPuzzle({ onComplete, disasterId, level }: { onComplete: (score: number) => void, disasterId?: string, level?: string }) {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [droppedWords, setDroppedWords] = useState<Record<string, string | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isVolcano = disasterId === 'gunung-api';
  const isTsunami = disasterId === 'tsunami';
  
  const volcanoStatements = [
    { id: 's1', text: 'Gunung api didefinisikan sebagai lubang atau rekahan di kerak bumi tempat keluarnya batuan cair (magma), gas, dan material piroklastik ke permukaan.', answer: 'Benar' },
    { id: 's2', text: 'Semua gunung yang memiliki bentuk kerucut tinggi dapat diklasifikasikan sebagai gunung api, meskipun tidak memiliki catatan aktivitas magma.', answer: 'Salah' },
    { id: 's3', text: 'Magma yang telah mencapai permukaan bumi dan mengalir keluar disebut sebagai lava.', answer: 'Benar' },
  ];

  const choices = isVolcano 
    ? [
        { id: 'opt1', word: 'Benar' },
        { id: 'opt2', word: 'Salah' },
      ]
    : [
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
    if (over && over.id.toString().startsWith('drop-zone-')) {
      const zoneId = over.id.toString().replace('drop-zone-', '');
      setDroppedWords(prev => ({ ...prev, [zoneId]: activeWord }));
    }
    setActiveWord(null);
  };

  const checkAnswer = () => {
    if (isVolcano) {
      if (Object.keys(droppedWords).length < volcanoStatements.length) return;
      setIsSubmitted(true);
      
      let correctCount = 0;
      volcanoStatements.forEach(s => {
        if (droppedWords[s.id] === s.answer) correctCount++;
      });
      
      const score = Math.round((correctCount / volcanoStatements.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    } else {
      const droppedWord = droppedWords['default'];
      if (!droppedWord) return;
      setIsSubmitted(true);
      const isCorrect = droppedWord === 'Mitigasi';
      setTimeout(() => onComplete(isCorrect ? 100 : 0), 1500);
    }
  };

  const isAllCorrect = isVolcano 
    ? volcanoStatements.every(s => droppedWords[s.id] === s.answer)
    : droppedWords['default'] === 'Mitigasi';

  const isComplete = isVolcano 
    ? volcanoStatements.every(s => droppedWords[s.id])
    : !!droppedWords['default'];

  return (
    <div className="max-w-7xl mx-auto relative px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-leaf-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Sidebar - Premium Refined Style */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[320px] w-full flex flex-col gap-6 sticky top-8"
          >
            <div className="relative group overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 text-white transform transition-transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-1">Level Edukasi</span>
                <h3 className="text-3xl font-black italic tracking-tighter drop-shadow-sm">TINGKAT AWAL</h3>
                <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xl font-bold border border-white/30">
                  NOMOR 1
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-white p-2 rounded-[2.5rem] shadow-xl">
              <div className="bg-yellow-400 text-earth-900 py-6 rounded-[2rem] shadow-inner text-center font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-3">
                <div className="w-2 h-8 bg-earth-900/20 rounded-full" />
                {disasterId === 'gunung-api' ? 'GUNUNG API' : disasterId === 'tsunami' ? 'TSUNAMI' : 'LONGSOR'}
                <div className="w-2 h-8 bg-earth-900/20 rounded-full" />
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-earth-200" />
                  <span className="text-[10px] font-black text-earth-400 uppercase tracking-widest">Kotak Pilihan</span>
                  <div className="h-px flex-1 bg-earth-200" />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {choices.map((choice) => (
                    <motion.div 
                      key={choice.id} 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <DraggableWord 
                        id={choice.id} 
                        word={choice.word} 
                        isUsed={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-earth-900 text-white/90 p-6 rounded-3xl shadow-lg border border-earth-700/50 hidden lg:block">
              <p className="text-xs font-medium leading-relaxed italic">
                "Pahami setiap pernyataan dengan teliti. Tarik pilihan yang menurutmu paling tepat untuk melengkapi konsep geologi tersebut."
              </p>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 w-full flex flex-col gap-8">
            {/* Instruction Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl flex items-center gap-6"
            >
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <RotateCcw className="w-7 h-7" />
              </div>
              <p className="text-earth-800 font-extrabold text-xl leading-snug">
                Tarik dan taruh pilihan <span className="text-green-600">benar</span> atau <span className="text-red-600">salah</span> mengenai pernyataan geologi berikut ini.
              </p>
            </motion.div>

            {/* Statements List */}
            <div className="grid grid-cols-1 gap-12 relative">
              {/* Connecting Line */}
              <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-earth-100 -z-10 hidden lg:block" />

              {isVolcano ? (
                volcanoStatements.map((s, index) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="w-full group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                      <div className="relative bg-white p-8 sm:p-10 rounded-[2.5rem] border border-earth-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 bg-earth-50 rounded-full flex items-center justify-center text-earth-400 font-black text-2xl border-4 border-white shadow-inner shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-earth-800 text-xl font-bold leading-relaxed flex-1 text-center md:text-left">
                          {s.text}
                        </p>
                      </div>
                    </div>
                    
                    <div className="z-10 transform -translate-y-2">
                      <DroppableZone 
                        id={`drop-zone-${s.id}`}
                        droppedWord={droppedWords[s.id] || null}
                        isCorrect={isSubmitted ? droppedWords[s.id] === s.answer : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWords(prev => ({ ...prev, [s.id]: null }))}
                        isVolcano={true}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 sm:p-16 rounded-[4rem] text-2xl sm:text-3xl leading-[2.2] text-earth-800 shadow-2xl border border-white relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-leaf-100/30 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110" />
                   <div className="relative z-10 text-center font-bold">
                    {isTsunami
                      ? <>
                          Sistem peringatan dini yang mendeteksi gelombang besar akibat gempa tektonik di dasar laut bertujuan untuk mempercepat proses
                          <DroppableZone 
                            id="drop-zone-default"
                            droppedWord={droppedWords['default'] || null} 
                            isCorrect={isSubmitted ? droppedWords['default'] === 'Mitigasi' : undefined}
                            isSubmitted={isSubmitted}
                            onReset={() => setDroppedWords(prev => ({ ...prev, default: null }))}
                            isVolcano={false}
                          />
                          bencana di wilayah pesisir.
                        </>
                      : <>
                          Serangkaian upaya untuk mengurangi risiko bencana, baik melalui pembangunan fisik maupun penyadaran kemampuan menghadapi ancaman disebut
                          <DroppableZone 
                            id="drop-zone-default"
                            droppedWord={droppedWords['default'] || null} 
                            isCorrect={isSubmitted ? droppedWords['default'] === 'Mitigasi' : undefined}
                            isSubmitted={isSubmitted}
                            onReset={() => setDroppedWords(prev => ({ ...prev, default: null }))}
                            isVolcano={false}
                          />
                          bencana yang mencakup perencanaan dan implementasi.
                        </>
                    }
                  </div>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {isComplete && !isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-center pt-10"
                >
                  <button
                    onClick={checkAnswer}
                    className="group relative px-20 py-6 bg-earth-900 text-white rounded-3xl font-black text-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-4">
                      Periksa Jawaban
                      <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        →
                      </motion.div>
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center gap-4 border-4 transition-all duration-500",
                  isAllCorrect 
                    ? "bg-gradient-to-br from-leaf-500 to-leaf-600 text-white border-leaf-400 shadow-leaf-500/30" 
                    : "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400 shadow-red-500/30"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md shadow-lg rotate-12 transition-transform hover:rotate-0">
                    {isAllCorrect ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                  </div>
                  <div className="text-left">
                    <h4 className="text-4xl font-black tracking-tight">{isAllCorrect ? "LUAR BIASA!" : "BELUM TEPAT!"}</h4>
                    <p className="text-xl font-bold opacity-90">{isAllCorrect ? "Semua jawaban benar." : "Periksa kembali pilihanmu."}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeWord ? (
            <div className={cn(
              "px-10 py-5 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-2xl font-black text-white cursor-grabbing scale-110 rotate-2 transition-transform border-2",
              activeWord === 'Benar' ? 'bg-green-500 border-green-400' : activeWord === 'Salah' ? 'bg-red-500 border-red-400' : 'bg-earth-800 border-earth-700'
            )}>
              {activeWord}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// --- Helper Components ---
function DroppableZone({ id, droppedWord, isCorrect, isSubmitted, onReset, isVolcano }: { 
  id: string;
  droppedWord: string | null; 
  isCorrect?: boolean; 
  isSubmitted: boolean;
  onReset: () => void;
  isVolcano: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: isSubmitted
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "inline-flex items-center justify-center min-w-[240px] h-20 border-4 border-dashed rounded-[2rem] transition-all duration-300 relative group overflow-hidden",
        isOver ? "bg-orange-50 border-orange-400 scale-105 shadow-lg" : "bg-earth-50/50 border-earth-200",
        droppedWord && "border-solid bg-white shadow-xl",
        isSubmitted && isCorrect === true && "border-green-500 bg-green-50 shadow-none",
        isSubmitted && isCorrect === false && "border-red-500 bg-red-50 shadow-none",
        isVolcano ? "mx-auto" : "mx-4 align-middle"
      )}
    >
      <AnimatePresence mode="wait">
        {droppedWord ? (
          <motion.div 
            key="word"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center w-full gap-4 px-6"
          >
            <span className={cn(
              "font-black text-2xl tracking-tight",
              droppedWord === 'Benar' ? "text-green-600" : droppedWord === 'Salah' ? "text-red-600" : "text-earth-900"
            )}>
              {droppedWord}
            </span>
            {!isSubmitted && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }} 
                className="p-2 hover:bg-earth-100 rounded-2xl text-earth-300 hover:text-earth-600 transition-all active:scale-90"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
            {isSubmitted && isCorrect === true && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </motion.div>
            )}
            {isSubmitted && isCorrect === false && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
             <span className="text-earth-300 text-xl font-black italic tracking-widest opacity-60">ISI</span>
             {isOver && <div className="w-12 h-1 bg-orange-400 rounded-full animate-pulse" />}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
