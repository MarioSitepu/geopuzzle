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
import { CheckCircle2, AlertCircle } from 'lucide-react';

// --- Types ---
type ItemType = 'decision' | 'reason';

type PuzzleItem = {
  id: string;
  text: string;
  type: ItemType;
  isCorrect: boolean;
};

// --- Initial Data ---
const DECISIONS: PuzzleItem[] = [
  { id: 'dec-iya', text: 'IYA', type: 'decision', isCorrect: true },
  { id: 'dec-tidak', text: 'TIDAK', type: 'decision', isCorrect: false },
];

const REASONS: PuzzleItem[] = [
  { 
    id: 'res-a', 
    text: 'A. Ya, karena di dekat pantai, gelombang tsunami akan berubah menjadi dinding air yang sangat tinggi dan kuat karena dasar laut yang dangkal.', 
    type: 'reason', 
    isCorrect: true 
  },
  { 
    id: 'res-b', 
    text: 'B. Ya, karena tsunami akan membuat air laut berputar seperti blender raksasa yang menyedot kapal ke dasar bumi.', 
    type: 'reason', 
    isCorrect: false 
  },
  { 
    id: 'res-c', 
    text: 'C. Ya, karena gesekan tanah di bawah laut saat gempa akan membuat air laut mendidih dan membakar siapa saja yang lewat.', 
    type: 'reason', 
    isCorrect: false 
  },
  { 
    id: 'res-d', 
    text: 'D. Ya, karena saat tsunami terjadi, akan muncul pulau-pulau baru dari dasar laut secara tiba-tiba yang menghalangi jalan kapal.', 
    type: 'reason', 
    isCorrect: false 
  },
];

// --- Subcomponents ---

function DraggableItem({ item, isUsed }: { item: PuzzleItem; isUsed: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item,
    disabled: isUsed
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-yellow-400 text-black font-black flex items-center justify-center p-3 rounded-xl shadow-md border-2 border-yellow-500 cursor-grab active:cursor-grabbing text-xs sm:text-sm text-center select-none transition-all duration-200",
        item.type === 'reason' ? "flex-1 text-[10px] sm:text-[11px] leading-tight" : "w-full py-4 text-lg",
        isUsed ? "opacity-30 cursor-not-allowed shadow-none" : "hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-lg",
        isDragging && "opacity-0"
      )}
    >
      {item.text}
    </div>
  );
}

function DroppableSlot({ 
  slotId, 
  type,
  placedItem, 
  isSubmitted, 
  onReset
}: { 
  slotId: string; 
  type: ItemType;
  placedItem: PuzzleItem | null; 
  isSubmitted: boolean; 
  onReset: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { accepts: type },
    disabled: isSubmitted
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => !isSubmitted && placedItem && onReset()}
      className={cn(
        "border-2 border-dashed rounded-xl flex items-center justify-center p-2 transition-all duration-300 relative",
        type === 'decision' ? "w-[30%] sm:w-48 h-12 bg-white/70 border-black absolute top-[15%] right-[5%]" : "w-[40%] sm:w-64 h-24 bg-white/70 border-black absolute top-[50%] right-[5%]",
        isOver ? "bg-yellow-100/80 border-yellow-500 scale-[1.05] shadow-lg z-10" : "",
        placedItem ? "border-solid bg-yellow-400/90 shadow-md border-yellow-500 cursor-pointer" : "",
        isSubmitted && placedItem && placedItem.isCorrect && "border-green-500 bg-green-400/90 shadow-none",
        isSubmitted && placedItem && !placedItem.isCorrect && "border-red-500 bg-red-400/90 shadow-none"
      )}
    >
      <AnimatePresence mode="wait">
        {placedItem ? (
          <motion.div 
            key="placed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center relative text-center text-black font-black"
          >
            <span className={cn(type === 'decision' ? "text-lg" : "text-[10px] sm:text-xs leading-tight")}>
              {placedItem.text}
            </span>
            
            {/* Validation badge overlay */}
            {isSubmitted && (
              <div className="absolute -bottom-2 -right-2 z-20">
                {placedItem.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 bg-white rounded-full shadow-sm" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 bg-white rounded-full shadow-sm" />
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <span className="text-black font-bold text-xs sm:text-sm tracking-wider opacity-60">
            {type === 'decision' ? "ISI IYA ATAU TIDAK" : "ALASAN?"}
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Component ---

export default function DecisionPuzzle({ 
  onComplete, 
  disasterId, 
  level, 
  stageIndex 
}: { 
  onComplete: (score: number) => void;
  disasterId?: string;
  level?: string;
  stageIndex?: number;
}) {
  const [activeItem, setActiveItem] = useState<PuzzleItem | null>(null);
  const [placements, setPlacements] = useState<{decision: PuzzleItem | null, reason: PuzzleItem | null}>({ decision: null, reason: null });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current as PuzzleItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over) {
      const slotType = over.data.current?.accepts as ItemType;
      const item = active.data.current as PuzzleItem;

      // Only allow dropping if types match
      if (slotType === item.type) {
        setPlacements(prev => ({ ...prev, [slotType]: item }));
      }
    }
    setActiveItem(null);
  };

  const handleResetSlot = (slotType: ItemType) => {
    setPlacements(prev => ({ ...prev, [slotType]: null }));
  };

  const allPlaced = placements.decision !== null && placements.reason !== null;

  const checkAnswer = () => {
    if (!allPlaced) return;
    setIsSubmitted(true);

    let correctCount = 0;
    if (placements.decision?.isCorrect) correctCount++;
    if (placements.reason?.isCorrect) correctCount++;

    const score = Math.round((correctCount / 2) * 100);
    setTimeout(() => onComplete(score), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-2 py-4">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4">
          
          {/* Top Instruction Box */}
          <div className="bg-slate-100/90 border border-slate-300 rounded-xl p-4 sm:p-6 text-center shadow-sm">
            <h3 className="font-black text-slate-800 mb-2 tracking-widest text-sm uppercase">INSTRUKSI</h3>
            <p className="text-slate-900 font-medium text-sm sm:text-base">
              sebuah keluarga memilih untuk pergi ke tengah laut ketika tsunami akan tiba, menurutmu apakah tindakan itu adalah tindakan yang ceroboh? dan kenapa?
            </p>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Left Column (Items) */}
            <div className="lg:w-[15%] flex flex-row lg:flex-col gap-3 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-slate-200">
              <div className="bg-yellow-400 font-black text-black py-2 px-4 rounded-xl text-center text-xs shadow-sm uppercase border border-yellow-500">
                PILIHAN ITEM
              </div>
              <div className="flex flex-1 lg:flex-col gap-3">
                {DECISIONS.map(dec => (
                  <DraggableItem 
                    key={dec.id} 
                    item={dec} 
                    isUsed={placements.decision?.id === dec.id} 
                  />
                ))}
              </div>
            </div>

            {/* Main Board */}
            <div className="lg:w-[85%] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-300 aspect-[16/10] sm:aspect-video bg-blue-100">
              {/* Background Image */}
              <img 
                src="/images/quiz/tsunami/lanjutan/2/1.png" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Family Image */}
              <img 
                src="/images/quiz/tsunami/lanjutan/2/family.png" 
                alt="Family" 
                className="absolute left-[15%] top-[50%] w-[25%] sm:w-[20%] object-contain -translate-y-1/2"
              />

              {/* Connecting Label between slots */}
              <div className="absolute top-[35%] right-[5%] w-[30%] sm:w-48 text-center bg-white/80 font-bold text-black text-xs sm:text-sm p-2 sm:p-3 rounded-xl border border-slate-300 shadow-sm backdrop-blur-sm">
                DAN APA ALASANNYA?
              </div>

              {/* Drop Slots */}
              <DroppableSlot 
                slotId="slot-decision" 
                type="decision"
                placedItem={placements.decision}
                isSubmitted={isSubmitted}
                onReset={() => handleResetSlot('decision')}
              />

              <DroppableSlot 
                slotId="slot-reason" 
                type="reason"
                placedItem={placements.reason}
                isSubmitted={isSubmitted}
                onReset={() => handleResetSlot('reason')}
              />
            </div>
          </div>

          {/* Bottom Section (Reasons) */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-[15%] bg-yellow-400 font-black text-black py-3 px-4 rounded-xl text-center text-xs shadow-md uppercase flex items-center justify-center border border-yellow-500">
              PILIHAN ALASAN
            </div>
            <div className="lg:w-[85%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white/40 p-3 rounded-xl border border-slate-200">
              {REASONS.map(res => (
                <DraggableItem 
                  key={res.id} 
                  item={res} 
                  isUsed={placements.reason?.id === res.id} 
                />
              ))}
            </div>
          </div>

          {/* Action Submission */}
          <AnimatePresence>
            {allPlaced && !isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center mt-6"
              >
                <button
                  onClick={checkAnswer}
                  className="px-16 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
                >
                  Periksa Jawaban
                  <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    →
                  </motion.div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Drag Overlay Portal */}
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
          {activeItem ? (
            <div className={cn(
              "p-3 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] bg-yellow-400 border-2 border-white text-black font-black leading-tight scale-110 rotate-3 cursor-grabbing text-center z-50",
              activeItem.type === 'reason' ? "w-48 text-[10px] sm:text-[11px]" : "w-32 text-lg"
            )}>
              {activeItem.text}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
