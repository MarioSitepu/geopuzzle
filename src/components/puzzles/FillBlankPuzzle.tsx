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
        "px-4 py-3 rounded-2xl shadow-sm border-2 cursor-grab active:cursor-grabbing text-base font-bold transition-all select-none text-center relative overflow-hidden group",
        word === 'Benar' ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white" : word === 'Salah' ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 text-white" : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-earth-800 hover:border-orange-400 hover:shadow-orange-500/20",
        isUsed ? "opacity-30 grayscale cursor-not-allowed border-earth-100 shadow-none" : "hover:shadow-lg hover:-translate-y-1",
        isDragging && "opacity-0"
      )}
    >
      {word}
    </div>
  );
}


export default function FillBlankPuzzle({ onComplete, disasterId, level, stageIndex }: { onComplete: (score: number) => void, disasterId?: string, level?: string, stageIndex?: number }) {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [droppedWords, setDroppedWords] = useState<Record<string, string | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isVolcano = disasterId === 'gunung-api';
  const isVolcanoLanjut2 = isVolcano && level === 'atas' && stageIndex === 1;
  const isTsunami = disasterId === 'tsunami';
  
  const volcanoStatements = [
    { id: 's1', text: 'Gunung api didefinisikan sebagai lubang atau rekahan di kerak bumi tempat keluarnya batuan cair (magma), gas, dan material piroklastik ke permukaan.', answer: 'Benar' },
    { id: 's2', text: 'Semua gunung yang memiliki bentuk kerucut tinggi dapat diklasifikasikan sebagai gunung api, meskipun tidak memiliki catatan aktivitas magma.', answer: 'Salah' },
    { id: 's3', text: 'Magma yang telah mencapai permukaan bumi dan mengalir keluar disebut sebagai lava.', answer: 'Benar' },
  ];

  const tsunamiStatements = [
    { id: 's1', text: 'Anda aman dari tsunami jika sudah berada di lantai dua rumah tinggal biasa.', answer: 'Salah' },
    { id: 's2', text: 'Di lautan dalam, gelombang tsunami bisa bergerak secepat pesawat terbang (sekitar 800-900 km/jam).', answer: 'Benar' },
    { id: 's3', text: 'Tsunami selalu didahului oleh gempa bumi yang terasa sangat kuat oleh manusia.', answer: 'Benar' },
    { id: 's4', text: 'Tsunami yang dipicu oleh gempa bumi jauh dapat diprediksi waktu kedatangannya di suatu lokasi.', answer: 'Benar' },
    { id: 's5', text: 'Air laut yang tiba-tiba surut secara drastis setelah gempa bumi adalah tanda bahaya tsunami yang nyata.', answer: 'Benar' },
    { id: 's6', text: 'Berenang melawan arus tsunami adalah cara terbaik untuk menyelamatkan diri jika terjebak di air.', answer: 'Salah' },
  ];

  const isTrueFalseMode = isVolcano || (isTsunami && level === 'awal');
  const statements = isTsunami ? tsunamiStatements : volcanoStatements;

  const choices = isVolcanoLanjut2
    ? [
        { id: 'opt1', word: 'Efusif' },
        { id: 'opt2', word: 'Strato' },
        { id: 'opt3', word: 'Wedhus Gembel' },
        { id: 'opt4', word: 'Eksplosif' },
        { id: 'opt5', word: 'Kubah' }
      ]
    : isTrueFalseMode 
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
    if (over) {
      let zoneId = over.id.toString();
      if (zoneId.startsWith('drop-zone-')) {
        zoneId = zoneId.replace('drop-zone-', '');
      }
      setDroppedWords(prev => ({ ...prev, [zoneId]: activeWord }));
    }
    setActiveWord(null);
  };

  const checkAnswer = () => {
    if (isVolcanoLanjut2) {
      if (!droppedWords['drop-1'] || !droppedWords['drop-2']) return;
      setIsSubmitted(true);
      
      const answers = [droppedWords['drop-1'], droppedWords['drop-2']];
      const correctCount = (answers.includes('Efusif') ? 1 : 0) + (answers.includes('Eksplosif') ? 1 : 0);
      
      const score = Math.round((correctCount / 2) * 100);
      setTimeout(() => onComplete(score), 1500);
    } else if (isTrueFalseMode) {
      if (Object.keys(droppedWords).length < statements.length) return;
      setIsSubmitted(true);
      
      let correctCount = 0;
      statements.forEach(s => {
        if (droppedWords[s.id] === s.answer) correctCount++;
      });
      
      const score = Math.round((correctCount / statements.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    } else {
      const droppedWord = droppedWords['default'];
      if (!droppedWord) return;
      setIsSubmitted(true);
      const isCorrect = droppedWord === 'Mitigasi';
      setTimeout(() => onComplete(isCorrect ? 100 : 0), 1500);
    }
  };

  const isAllCorrect = isVolcanoLanjut2
    ? ['Efusif', 'Eksplosif'].includes(droppedWords['drop-1'] || '') && ['Efusif', 'Eksplosif'].includes(droppedWords['drop-2'] || '') && droppedWords['drop-1'] !== droppedWords['drop-2']
    : isTrueFalseMode 
    ? statements.every(s => droppedWords[s.id] === s.answer)
    : droppedWords['default'] === 'Mitigasi';

  const isComplete = isVolcanoLanjut2
    ? !!droppedWords['drop-1'] && !!droppedWords['drop-2']
    : isTrueFalseMode 
    ? statements.every(s => droppedWords[s.id])
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
                <h3 className="text-3xl font-black italic tracking-tighter drop-shadow-sm">TINGKAT {level === 'atas' ? 'LANJUTAN' : 'AWAL'}</h3>
                <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xl font-bold border border-white/30">
                  NOMOR {stageIndex !== undefined ? stageIndex + 1 : 1}
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-xl border border-white p-3 rounded-[2.5rem] shadow-xl">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white py-6 rounded-[2rem] shadow-inner text-center font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-3">
                <div className="w-2 h-8 bg-white/30 rounded-full" />
                {disasterId === 'gunung-api' ? 'GUNUNG API' : disasterId === 'tsunami' ? 'TSUNAMI' : 'LONGSOR'}
                <div className="w-2 h-8 bg-white/30 rounded-full" />
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
                {isVolcanoLanjut2 ? "Tarik dan taruh pilihan yang ada di bawah ini dengan mengisi jawaban yang cocok!" : (
                  <>Tarik dan taruh pilihan <span className="text-green-600">benar</span> atau <span className="text-red-600">salah</span> mengenai pernyataan geologi berikut ini.</>
                )}
              </p>
            </motion.div>

            {/* Statements List */}
            <div className="grid grid-cols-1 gap-12 relative">
              {/* Connecting Line */}
              <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-earth-100 -z-10 hidden lg:block" />

              {isVolcanoLanjut2 ? (
                <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-white shadow-xl text-center relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                    <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/30 rounded-full -ml-32 -mt-32 blur-3xl transition-transform group-hover:scale-110" />
                    <p className="text-xl sm:text-2xl font-medium text-earth-800 leading-relaxed relative z-10">
                      Secara umum, tipe erupsi gunung api dibedakan menjadi dua kategori utama berdasarkan mekanisme keluarnya magma. Ada letusan yang <span className="font-bold text-orange-600">meledak dahsyat</span> dan ada yang hanya <span className="font-bold text-red-500">mengalir tenang</span>.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-lg flex flex-col items-center justify-center gap-6 relative z-10"
                  >
                    <span className="text-sm font-black text-earth-500 uppercase tracking-widest bg-earth-100 px-6 py-2 rounded-full shadow-sm">
                      Tarik 2 Jawaban ke Bawah
                    </span>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                      <DroppableZone 
                        id="drop-1"
                        droppedWord={droppedWords['drop-1'] || null}
                        isCorrect={isSubmitted ? ['Efusif', 'Eksplosif'].includes(droppedWords['drop-1'] || '') : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWords(prev => ({ ...prev, 'drop-1': null }))}
                        isVolcano={false}
                        className="min-w-[180px] h-16 sm:min-w-[200px] sm:h-20"
                      />
                      <div className="w-10 h-10 rounded-full bg-earth-200/80 text-earth-500 flex items-center justify-center font-black text-lg shadow-inner">
                        &
                      </div>
                      <DroppableZone 
                        id="drop-2"
                        droppedWord={droppedWords['drop-2'] || null}
                        isCorrect={isSubmitted ? ['Efusif', 'Eksplosif'].includes(droppedWords['drop-2'] || '') : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWords(prev => ({ ...prev, 'drop-2': null }))}
                        isVolcano={false}
                        className="min-w-[180px] h-16 sm:min-w-[200px] sm:h-20"
                      />
                    </div>
                  </motion.div>
                </div>
              ) : isTrueFalseMode ? (
                statements.map((s, index) => (
                  <motion.div 
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col lg:flex-row items-center gap-3 w-full"
                  >
                    <div className="flex-1 w-full group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                      <div className="relative h-full bg-white/90 backdrop-blur-sm px-5 py-4 rounded-3xl border border-earth-100 shadow-lg flex items-center gap-4">
                        <p className="text-earth-800 text-sm sm:text-base font-semibold leading-snug flex-1 text-center lg:text-left">
                          {s.text}
                        </p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center pt-1 lg:pt-0">
                      <DroppableZone 
                        id={`drop-zone-${s.id}`}
                        droppedWord={droppedWords[s.id] || null}
                        isCorrect={isSubmitted ? droppedWords[s.id] === s.answer : undefined}
                        isSubmitted={isSubmitted}
                        onReset={() => setDroppedWords(prev => ({ ...prev, [s.id]: null }))}
                        isVolcano={true}
                        className="min-w-[120px] h-12 sm:min-w-[140px] sm:h-14 rounded-2xl text-base"
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
              "px-10 py-5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-2xl font-black transition-transform border-2 scale-110 rotate-2 cursor-grabbing text-center",
              activeWord === 'Benar' ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white" : activeWord === 'Salah' ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 text-white" : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-earth-800"
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
function DroppableZone({ id, droppedWord, isCorrect, isSubmitted, onReset, isVolcano, className }: { 
  id: string;
  droppedWord: string | null; 
  isCorrect?: boolean; 
  isSubmitted: boolean;
  onReset: () => void;
  isVolcano: boolean;
  className?: string;
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
        isVolcano ? "mx-auto" : "mx-4 align-middle",
        className
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
