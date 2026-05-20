'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  useDraggable, 
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
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
        "px-3 py-2.5 rounded-xl shadow-sm border-2 cursor-grab active:cursor-grabbing text-sm font-bold transition-all select-none text-center relative overflow-hidden group",
        word === 'Benar' ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400 text-white" : word === 'Salah' ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400 text-white" : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-earth-800 hover:border-orange-400 hover:shadow-orange-500/20",
        isUsed ? "opacity-30 grayscale cursor-not-allowed border-earth-100 shadow-none" : "hover:shadow-md hover:-translate-y-0.5",
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

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  
  const isVolcano = disasterId === 'gunung-api';
  const isVolcanoLanjut2 = isVolcano && level === 'atas' && stageIndex === 1;
  const isTsunami = disasterId === 'tsunami';
  const isTsunamiAwal2 = isTsunami && level === 'awal' && stageIndex === 1;
  const isLandslide = disasterId === 'longsor';

  const isCaseStudyMode = isVolcanoLanjut2 || isTsunamiAwal2;
  
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

  const landslideStatements = [
    { id: 's1', text: 'Tanah longsor didefinisikan sebagai perpindahan material pembentuk lereng berupa batuan, bahan rombakan, tanah, atau material campuran, bergerak ke bawah atau keluar lereng.', answer: 'Benar' },
    { id: 's2', text: 'Salah satu tanda awal terjadinya tanah longsor adalah munculnya retakan baru pada lereng atau tanah di sekitar lereng.', answer: 'Benar' },
    { id: 's3', text: 'Tanah longsor hanya terjadi saat musim kemarau panjang akibat tanah yang retak dan kering.', answer: 'Salah' },
    { id: 's4', text: 'Penebangan pohon di lereng bukit dapat membantu meningkatkan kestabilan lereng karena mengurangi beban berat pohon.', answer: 'Salah' },
    { id: 's5', text: 'Ketika terjadi longsor di sekitar Anda, tindakan terbaik yang harus dilakukan segera adalah mengungsi ke tempat yang lebih tinggi dan lapang.', answer: 'Benar' },
  ];

  const isTrueFalseMode = isVolcano || (isTsunami && level === 'awal' && stageIndex === 0) || (isLandslide && level === 'awal' && stageIndex === 0);
  const statements = isTsunami ? tsunamiStatements : isVolcano ? volcanoStatements : landslideStatements;

  const choices = isVolcanoLanjut2
    ? [
        { id: 'opt1', word: 'Efusif' },
        { id: 'opt2', word: 'Strato' },
        { id: 'opt3', word: 'Wedhus Gembel' },
        { id: 'opt4', word: 'Eksplosif' },
        { id: 'opt5', word: 'Kubah' }
      ]
    : isTsunamiAwal2
    ? [
        { id: 'opt1', word: 'Mengajak Warga Lain untuk Mengungsi' },
        { id: 'opt2', word: 'Berenang' },
        { id: 'opt3', word: 'Tetap melanjutkan aktifitas' },
        { id: 'opt4', word: 'Posting di Sosmed' },
        { id: 'opt5', word: 'Mencari tempat Ketinggian' }
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

  const caseStudyCorrectAnswers = isVolcanoLanjut2
    ? ['Efusif', 'Eksplosif']
    : ['Mengajak Warga Lain untuk Mengungsi', 'Tetap melanjutkan aktifitas'];

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
    if (isCaseStudyMode) {
      if (!droppedWords['drop-1'] || !droppedWords['drop-2']) return;
      setIsSubmitted(true);
      
      const answers = [droppedWords['drop-1'], droppedWords['drop-2']];
      const correctCount = (answers.includes(caseStudyCorrectAnswers[0]) ? 1 : 0) + (answers.includes(caseStudyCorrectAnswers[1]) ? 1 : 0);
      
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

  const isAllCorrect = isCaseStudyMode
    ? caseStudyCorrectAnswers.includes(droppedWords['drop-1'] || '') && caseStudyCorrectAnswers.includes(droppedWords['drop-2'] || '') && droppedWords['drop-1'] !== droppedWords['drop-2']
    : isTrueFalseMode 
    ? statements.every(s => droppedWords[s.id] === s.answer)
    : droppedWords['default'] === 'Mitigasi';

  const isComplete = isCaseStudyMode
    ? !!droppedWords['drop-1'] && !!droppedWords['drop-2']
    : isTrueFalseMode 
    ? statements.every(s => droppedWords[s.id])
    : !!droppedWords['default'];

  return (
    <div className="max-w-6xl mx-auto relative px-3 py-6 sm:px-5 lg:px-6">
      {/* Subtle Background Accents */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-300/8 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-leaf-300/8 rounded-full blur-3xl -z-10" />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* Left Sidebar — Compact & Refined */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[260px] w-full flex flex-col gap-4 sticky top-6"
          >
            {/* Level Badge — Slim */}
            <div className={cn(
              "relative overflow-hidden px-5 py-4 rounded-2xl shadow-lg text-white",
              isVolcano ? "bg-gradient-to-br from-orange-500 to-orange-600" : isTsunami ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-earth-600 to-earth-700"
            )}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70">Level</span>
                  <h3 className="text-lg font-black tracking-tight leading-none">{level === 'atas' ? 'Lanjutan' : 'Awal'}</h3>
                </div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-bold border border-white/20">
                  No. {stageIndex !== undefined ? stageIndex + 1 : 1}
                </div>
              </div>
            </div>

            {/* Choices Panel — Tight */}
            <div className="bg-white/90 backdrop-blur-xl border border-earth-100 rounded-2xl shadow-md overflow-hidden">
              <div className={cn(
                "py-3 text-center font-bold text-sm uppercase tracking-widest text-white",
                isVolcano ? "bg-gradient-to-r from-orange-500 to-orange-600" : isTsunami ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-earth-600 to-earth-700"
              )}>
                {disasterId === 'gunung-api' ? 'Gunung Api' : disasterId === 'tsunami' ? 'Tsunami' : 'Longsor'}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-earth-100" />
                  <span className="text-[9px] font-bold text-earth-400 uppercase tracking-widest">Pilihan</span>
                  <div className="h-px flex-1 bg-earth-100" />
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {choices.map((choice) => (
                    <motion.div 
                      key={choice.id} 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
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

            {/* Hint — Minimal */}
            <div className="bg-earth-900/90 text-white/80 px-4 py-3 rounded-xl text-[11px] font-medium leading-relaxed italic hidden lg:block">
              &quot;Pahami setiap pernyataan dengan teliti. Tarik pilihan yang tepat untuk melengkapi konsep geologi.&quot;
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 w-full flex flex-col gap-5">
            {/* Instruction — Compact */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm px-5 py-4 rounded-xl border border-white/80 shadow-sm flex items-center gap-4"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                isVolcano ? "bg-orange-100 text-orange-600" : isTsunami ? "bg-blue-100 text-blue-600" : "bg-earth-100 text-earth-600"
              )}>
                <RotateCcw className="w-5 h-5" />
              </div>
              <p className="text-earth-700 font-bold text-sm leading-snug">
                {isCaseStudyMode ? "Tarik dan taruh pilihan yang ada di bawah ini dengan mengisi jawaban yang cocok!" : (
                  <>Tarik dan taruh pilihan <span className="text-green-600">benar</span> atau <span className="text-red-600">salah</span> mengenai pernyataan geologi berikut ini.</>
                )}
              </p>
            </motion.div>

            {/* Statements List — Slim Cards */}
            <div className="flex flex-col gap-4 relative">

              {isCaseStudyMode ? (
                <div className="w-full max-w-3xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white shadow-2xl relative group flex flex-col gap-6"
                  >
                    {/* Premium Header Indicator */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500" />
                    
                    {/* sea level monitor badge */}
                    <div className="flex items-center justify-between relative z-10 border-b border-earth-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-black text-red-600 uppercase tracking-widest">Studi Kasus Tsunami</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-blue-50/80 px-3 py-1 rounded-full border border-blue-100/50 shadow-inner">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sensor Pesisir Aktif</span>
                      </div>
                    </div>

                    {/* Scenario Text Area */}
                    <div className="relative z-10 bg-gradient-to-br from-earth-50 to-orange-50/20 p-5 rounded-2xl border border-earth-100">
                      <span className="absolute -top-3 left-4 bg-earth-900 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-sm">
                        Laporan Kejadian
                      </span>
                      <p className="text-earth-800 text-sm sm:text-base font-semibold leading-relaxed text-left italic">
                        "Warga di pesisir Teluk X sedang bersantai di sore hari tanpa merasakan guncangan gempa sedikit pun. Tiba-tiba, permukaan air laut naik dengan sangat cepat and menggenang ke pemukiman. Berdasarkan data geologi, terdapat tebing curam di bawah laut yang baru saja runtuh."
                      </p>
                    </div>

                    {/* Question Header */}
                    <div className="text-center relative z-10 py-1">
                      <h4 className="text-earth-900 text-base sm:text-lg font-black tracking-tight uppercase">
                        Apa rencana aksi darurat yang paling tepat?
                      </h4>
                      <p className="text-xs text-earth-400 mt-1 font-semibold">Tarik 2 tindakan mitigasi terbaik dari kotak pilihan di sebelah kiri.</p>
                    </div>

                    {/* Unified Slotted Action Board */}
                    <div className="relative z-10 bg-slate-950 text-white rounded-3xl p-5 border border-slate-800 shadow-inner flex flex-col gap-4">
                      <div className="text-center border-b border-white/5 pb-3">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-amber-500/30 shadow-inner">
                          Rencana Evakuasi Mandiri
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-1">
                        {/* Slot 1 */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Tindakan 1</span>
                            <span className="text-[9px] font-black text-slate-950 uppercase bg-amber-400 px-2.5 py-0.5 rounded shadow-sm">Prioritas Utama</span>
                          </div>
                          <DroppableZone 
                            id="drop-1"
                            droppedWord={droppedWords['drop-1'] || null}
                            isCorrect={isSubmitted ? caseStudyCorrectAnswers.includes(droppedWords['drop-1'] || '') : undefined}
                            isSubmitted={isSubmitted}
                            onReset={() => setDroppedWords(prev => ({ ...prev, 'drop-1': null }))}
                            isVolcano={false}
                            className="min-w-0 w-full h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-amber-500/50 hover:bg-white shadow-sm"
                          />
                        </div>

                        {/* Slot 2 */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Tindakan 2</span>
                            <span className="text-[9px] font-black text-slate-950 uppercase bg-amber-400 px-2.5 py-0.5 rounded shadow-sm">Prioritas Utama</span>
                          </div>
                          <DroppableZone 
                            id="drop-2"
                            droppedWord={droppedWords['drop-2'] || null}
                            isCorrect={isSubmitted ? caseStudyCorrectAnswers.includes(droppedWords['drop-2'] || '') : undefined}
                            isSubmitted={isSubmitted}
                            onReset={() => setDroppedWords(prev => ({ ...prev, 'drop-2': null }))}
                            isVolcano={false}
                            className="min-w-0 w-full h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-amber-500/50 hover:bg-white shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : isTrueFalseMode ? (
                <div className="space-y-4 w-full">
                  {statements.map((s, index) => (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-earth-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-md transition-all"
                    >
                      <div className="flex-1 flex items-start gap-4">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-sm",
                          isVolcano ? "bg-orange-100 text-orange-700" : isTsunami ? "bg-blue-100 text-blue-700" : "bg-earth-100 text-earth-700"
                        )}>
                          {index + 1}
                        </span>
                        <p className="text-earth-800 text-base sm:text-lg font-medium leading-relaxed pt-0.5">
                          {s.text}
                        </p>
                      </div>
                      <div className="shrink-0 flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
                        <DroppableZone 
                          id={`drop-zone-${s.id}`}
                          droppedWord={droppedWords[s.id] || null}
                          isCorrect={isSubmitted ? droppedWords[s.id] === s.answer : undefined}
                          isSubmitted={isSubmitted}
                          onReset={() => setDroppedWords(prev => ({ ...prev, [s.id]: null }))}
                          isVolcano={true}
                          className="min-w-[140px] sm:min-w-[160px] h-14 rounded-xl border-2 border-dashed border-earth-400 bg-earth-50 hover:bg-earth-100 hover:border-earth-500 transition-colors !mx-0 flex-shrink-0 shadow-inner"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/95 p-8 sm:p-10 rounded-2xl text-lg sm:text-xl leading-[2] text-earth-700 shadow-lg border border-earth-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-leaf-100/20 rounded-full -mr-24 -mt-24 blur-3xl" />
                   <div className="relative z-10 text-center font-semibold">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-center pt-4"
                >
                  <button
                    onClick={checkAnswer}
                    className={cn(
                      "group relative px-12 py-4 text-white rounded-2xl font-bold text-lg shadow-xl overflow-hidden transition-all hover:scale-105 active:scale-95",
                      isVolcano ? "bg-orange-600 hover:bg-orange-700" : isTsunami ? "bg-blue-600 hover:bg-blue-700" : "bg-earth-700 hover:bg-earth-800"
                    )}
                  >
                    <span className="relative flex items-center gap-3">
                      Periksa Jawaban
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        →
                      </motion.span>
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "px-6 py-5 rounded-2xl shadow-lg flex items-center gap-4 border-2",
                  isAllCorrect 
                    ? "bg-gradient-to-r from-leaf-500 to-leaf-600 text-white border-leaf-400" 
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400"
                )}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  {isAllCorrect ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>
                <div>
                  <h4 className="text-xl font-black">{isAllCorrect ? "LUAR BIASA!" : "BELUM TEPAT!"}</h4>
                  <p className="text-sm font-semibold opacity-90">{isAllCorrect ? "Semua jawaban benar." : "Periksa kembali pilihanmu."}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Drag Overlay — Refined */}
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeWord ? (
            <div className={cn(
              "px-6 py-3 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] text-base font-bold border-2 scale-105 rotate-1 cursor-grabbing text-center",
              activeWord === 'Benar' ? "bg-green-500 border-green-400 text-white" : activeWord === 'Salah' ? "bg-red-500 border-red-400 text-white" : "bg-orange-50 border-orange-300 text-earth-800"
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
        "flex items-center justify-center min-w-[140px] h-20 border-4 border-dashed rounded-[2rem] transition-all duration-300 relative group",
        isOver ? "bg-orange-50 border-orange-400 scale-105 shadow-lg" : "bg-earth-50/50 border-earth-200",
        droppedWord && "border-solid bg-white shadow-xl",
        isSubmitted && isCorrect === true && "border-green-500 bg-green-50 shadow-none",
        isSubmitted && isCorrect === false && "border-red-500 bg-red-50 shadow-none",
        isVolcano ? "mx-auto" : "mx-4",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {droppedWord ? (
          <motion.div 
            key="word"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center w-full gap-2 px-3 sm:px-4"
          >
            <span className={cn(
              droppedWord.length > 10 
                ? "text-xs sm:text-sm font-bold leading-tight text-center" 
                : "font-black text-xl sm:text-2xl tracking-tight",
              droppedWord === 'Benar' ? "text-green-600" : droppedWord === 'Salah' ? "text-red-600" : "text-earth-900"
            )}>
              {droppedWord}
            </span>
            {!isSubmitted && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }} 
                className="p-1 sm:p-2 hover:bg-earth-100 rounded-2xl text-earth-300 hover:text-earth-600 transition-all active:scale-90 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
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
             <span className="text-earth-400 dark:text-white/40 text-sm font-bold tracking-wider uppercase">Taruh di Sini</span>
             {isOver && <div className="w-12 h-1 bg-orange-400 rounded-full animate-pulse" />}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
