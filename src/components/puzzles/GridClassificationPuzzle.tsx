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
import { RotateCcw, CheckCircle2, AlertCircle, X } from 'lucide-react';

// --- Types ---
type Statement = {
  id: string;
  text: string;
  isCorrect: boolean; // true = BENAR, false = SALAH
};

// --- Initial Data ---
const INITIAL_STATEMENTS: Statement[] = [
  { id: 'st-1', text: 'Longsor adalah perpindahan material lereng yang bergerak ke bawah atau keluar lereng.', isCorrect: true },
  { id: 'st-2', text: 'Longsor adalah getaran permukaan bumi yang merusak bangunan di atas lereng.', isCorrect: false },
  { id: 'st-3', text: 'Faktor kontrol longsor meliputi jenis batuan, kondisi tanah, dan struktur geologi.', isCorrect: true },
  { id: 'st-4', text: 'Faktor pemicu yang mengontrol longsor adalah limbah rumah tangga', isCorrect: false },
  { id: 'st-5', text: 'Faktor pemicu longsor adalah kemiringan lereng, curah hujan tinggi, getaran, dan minimnya pohon.', isCorrect: true },
  { id: 'st-6', text: 'Faktor pemicu longsor adalah kurangnya sosialisasi dari pemerintahan.', isCorrect: false },
  { id: 'st-7', text: 'Tanda awal longsor adalah munculnya retakan di lereng, suara tanah jatuh dan air sumur mendadak keruh.', isCorrect: true },
  { id: 'st-8', text: 'Tanda awal longsor adalah suhu udara mendadak naik drastis dan langit berubah jadi gelap gulita.', isCorrect: false },
  { id: 'st-9', text: 'Mitigasi yang tepat untuk menahan lereng adalah penahan beton drainase dan menanam pohon berakar lebat', isCorrect: true },
  { id: 'st-10', text: 'Cara ampuh mencegah longsor adalah dengan membuang sampah ke kaki lereng.', isCorrect: false }
];

// Grid mappings matching the reference image layout exactly (3 rows x 5 columns = 15 cells)
const BENAR_GRID_MAP = [
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'benar-slot-1' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'benar-slot-2' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'benar-slot-3' },
  { type: 'slot', slotId: 'benar-slot-4' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'benar-slot-5' },
  { type: 'yellow' }
];

const SALAH_GRID_MAP = [
  { type: 'slot', slotId: 'salah-slot-1' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'salah-slot-2' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'salah-slot-3' },
  { type: 'yellow' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'salah-slot-4' },
  { type: 'yellow' },
  { type: 'slot', slotId: 'salah-slot-5' }
];

// --- Subcomponents ---

// Draggable card containing statement text
function DraggableStatement({ 
  statement, 
  isUsed,
  onClick
}: { 
  statement: Statement; 
  isUsed: boolean;
  onClick?: (statement: Statement) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: statement.id,
    data: statement,
    disabled: isUsed
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (isUsed) return;
        if (onClick) onClick(statement);
      }}
      className={cn(
        "p-4 rounded-2xl shadow-md border-2 bg-gradient-to-br from-white to-slate-50 border-slate-200 text-earth-800 cursor-grab active:cursor-grabbing text-xs sm:text-sm font-bold leading-relaxed select-none text-center relative overflow-hidden transition-all duration-200 touch-none",
        isUsed ? "opacity-20 grayscale cursor-not-allowed shadow-none border-slate-100" : "hover:border-orange-400 hover:shadow-lg hover:-translate-y-1",
        isDragging && "opacity-0"
      )}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400" />
      {statement.text}
    </div>
  );
}

// Droppable slot (grey dashed block in 3x5 grid)
function DroppableSlot({ 
  slotId, 
  placedStatement, 
  isSubmitted, 
  onReset,
  isCorrectSection,
  onZoom
}: { 
  slotId: string; 
  placedStatement: Statement | null; 
  isSubmitted: boolean; 
  onReset: () => void;
  isCorrectSection: boolean; // true = BENAR grid, false = SALAH grid
  onZoom?: (statement: Statement) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    disabled: isSubmitted
  });

  // A placement is correct if:
  // - Dropped statement's 'isCorrect' matches the grid section it was dropped in
  const isCorrectPlacement = placedStatement ? placedStatement.isCorrect === isCorrectSection : false;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full aspect-[4/3] min-h-[50px] sm:min-h-[90px] border-2 border-dashed rounded-lg sm:rounded-xl flex flex-col items-center justify-center p-1 sm:p-1.5 transition-all duration-300 relative group",
        isOver ? "bg-orange-50 border-orange-400 scale-[1.03] shadow-md z-10" : "bg-slate-100 border-slate-400",
        placedStatement && "border-solid bg-white shadow-md border-slate-300",
        isSubmitted && placedStatement && isCorrectPlacement && "border-green-500 bg-green-50/70 shadow-none scale-100",
        isSubmitted && placedStatement && !isCorrectPlacement && "border-red-500 bg-red-50/70 shadow-none scale-100"
      )}
    >
      <AnimatePresence mode="wait">
        {placedStatement ? (
          <motion.div 
            key="placed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-between relative"
          >
            {/* Small text content inside slot */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (placedStatement && onZoom) {
                  onZoom(placedStatement);
                }
              }}
              className="grow flex items-center justify-center text-center p-1 overflow-hidden w-full cursor-zoom-in hover:bg-slate-50/80 rounded-lg transition-colors"
            >
              <span className="text-[7px] sm:text-[10px] font-black text-slate-800 leading-[1.1] break-words line-clamp-3 text-center px-0.5 select-none">
                {placedStatement.text}
              </span>
            </div>
            
            {/* Quick reset button */}
            {!isSubmitted && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }} 
                className="absolute -top-1 -right-1 p-0.5 bg-slate-900 text-white rounded-full hover:bg-red-500 transition-colors shadow-md shrink-0 z-20 active:scale-90"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            )}

            {/* Validation badge overlay */}
            {isSubmitted && (
              <div className="absolute -bottom-1 -right-1 z-20">
                {isCorrectPlacement ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 bg-white rounded-full shadow-sm" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full shadow-sm" />
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-center justify-center w-full h-full">
            <span className="text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider">Kotak Kosong</span>
            {isOver && <div className="w-6 h-0.5 bg-orange-400 rounded-full mt-1 animate-pulse" />}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main GridClassificationPuzzle Component ---

export default function GridClassificationPuzzle({ 
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
  const [activeStatement, setActiveStatement] = useState<Statement | null>(null);
  const [zoomedStatement, setZoomedStatement] = useState<Statement | null>(null);
  const [selectedStatementForClassification, setSelectedStatementForClassification] = useState<Statement | null>(null);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  // Helper to check if a category grid is full
  const isCategoryFull = (isCorrectSection: boolean) => {
    const gridMap = isCorrectSection ? BENAR_GRID_MAP : SALAH_GRID_MAP;
    return gridMap.filter(cell => cell.type === 'slot').every(cell => placements[cell.slotId]);
  };

  // Helper to programmatically place a statement in a category
  const placeStatementAutomatically = (statement: Statement, isCorrectSection: boolean) => {
    const gridMap = isCorrectSection ? BENAR_GRID_MAP : SALAH_GRID_MAP;
    
    // Find the first slot in the gridMap that doesn't have a placement yet
    const emptySlotCell = gridMap.find(cell => {
      if (cell.type === 'slot') {
        return !placements[cell.slotId];
      }
      return false;
    });

    if (emptySlotCell && emptySlotCell.slotId) {
      const slotId = emptySlotCell.slotId;
      
      // Remove from any existing placements first
      const newPlacements = { ...placements };
      Object.keys(newPlacements).forEach(key => {
        if (newPlacements[key]?.id === statement.id) {
          newPlacements[key] = null;
        }
      });

      // Place it in the empty slot
      newPlacements[slotId] = statement;
      setPlacements(newPlacements);
      return true;
    }
    return false;
  };
  
  // Placements store mapping slotId -> Statement
  const [placements, setPlacements] = useState<Record<string, Statement | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveStatement(event.active.data.current as Statement);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (over) {
      const slotId = over.id.toString();
      const statement = active.data.current as Statement;

      // Remove the statement from any slot it was previously placed in
      const newPlacements = { ...placements };
      Object.keys(newPlacements).forEach(key => {
        if (newPlacements[key]?.id === statement.id) {
          newPlacements[key] = null;
        }
      });

      // Place the statement into the new slot
      newPlacements[slotId] = statement;
      setPlacements(newPlacements);
    }
    setActiveStatement(null);
  };

  // Helper to check if a statement is placed in any slot
  const isStatementPlaced = (id: string) => {
    return Object.values(placements).some(p => p?.id === id);
  };

  // Returns placed statement for a given slot
  const getPlacedStatement = (slotId: string) => {
    return placements[slotId] || null;
  };

  // Resets a specific slot
  const handleResetSlot = (slotId: string) => {
    setPlacements(prev => ({ ...prev, [slotId]: null }));
  };

  // All 10 statements must be placed to complete the puzzle
  const allPlaced = INITIAL_STATEMENTS.every(st => isStatementPlaced(st.id));

  const checkAnswer = () => {
    if (!allPlaced) return;
    setIsSubmitted(true);

    let correctPlacementsCount = 0;

    // Validate BENAR slots (must contain statements with 'isCorrect === true')
    BENAR_GRID_MAP.forEach(cell => {
      if (cell.type === 'slot') {
        const statement = placements[cell.slotId];
        if (statement && statement.isCorrect === true) {
          correctPlacementsCount++;
        }
      }
    });

    // Validate SALAH slots (must contain statements with 'isCorrect === false')
    SALAH_GRID_MAP.forEach(cell => {
      if (cell.type === 'slot') {
        const statement = placements[cell.slotId];
        if (statement && statement.isCorrect === false) {
          correctPlacementsCount++;
        }
      }
    });

    // Calculate score out of 100
    const score = Math.round((correctPlacementsCount / 10) * 100);
    setTimeout(() => onComplete(score), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto relative px-4 py-8 sm:px-6 lg:px-8 overflow-hidden max-w-full">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-8">
          
          {/* Top Row: Info Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-auto text-left">
              <div className="flex items-center gap-4">
                <span className="w-3.5 h-3.5 rounded-full bg-green-500 animate-ping shrink-0" />
                <h2 className="text-xl sm:text-2xl font-black text-earth-900 leading-tight">
                  PILIH & KLASIFIKASIKAN PERNYATAAN LONGSOR
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-earth-600 pl-7 mt-1">
                <strong>Instruksi Soal :</strong> Tarik dan taruh kepingan puzzle yang menurutmu benar atau salah kedalam kotak yang sudah di sediakan!
              </p>
            </div>
            <div className="bg-earth-900 text-white px-6 py-2 rounded-full font-black text-base border border-earth-700 shadow-md shrink-0">
              NOMOR {stageIndex !== undefined ? stageIndex + 1 : 1}
            </div>
          </div>

          {/* Middle Row: Side-by-Side Grid Boards (BENAR & SALAH) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            
            {/* --- BENAR Grid Board (Green) --- */}
            <div className="flex flex-col bg-white/80 backdrop-blur-xl border-4 border-green-500 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white py-4 text-center font-black text-xl tracking-widest uppercase">
                BENAR
              </div>
              <div className="p-2.5 sm:p-6 w-full">
                <div className="grid grid-cols-5 gap-1.5 sm:gap-4 w-full">
                  {BENAR_GRID_MAP.map((cell, idx) => {
                    if (cell.type === 'yellow') {
                      return (
                        <div 
                          key={`benar-yellow-${idx}`}
                          className="w-full aspect-[4/3] min-h-[50px] sm:min-h-[90px] rounded-lg sm:rounded-xl bg-yellow-400 shadow-sm border border-yellow-300"
                        />
                      );
                    } else {
                      return (
                        <DroppableSlot 
                          key={cell.slotId}
                          slotId={cell.slotId}
                          placedStatement={getPlacedStatement(cell.slotId)}
                          isSubmitted={isSubmitted}
                          onReset={() => handleResetSlot(cell.slotId)}
                          isCorrectSection={true}
                          onZoom={setZoomedStatement}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>

            {/* --- SALAH Grid Board (Red) --- */}
            <div className="flex flex-col bg-white/80 backdrop-blur-xl border-4 border-red-500 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-4 text-center font-black text-xl tracking-widest uppercase">
                SALAH
              </div>
              <div className="p-2.5 sm:p-6 w-full">
                <div className="grid grid-cols-5 gap-1.5 sm:gap-4 w-full">
                  {SALAH_GRID_MAP.map((cell, idx) => {
                    if (cell.type === 'yellow') {
                      return (
                        <div 
                          key={`salah-yellow-${idx}`}
                          className="w-full aspect-[4/3] min-h-[50px] sm:min-h-[90px] rounded-lg sm:rounded-xl bg-yellow-400 shadow-sm border border-yellow-300"
                        />
                      );
                    } else {
                      return (
                        <DroppableSlot 
                          key={cell.slotId}
                          slotId={cell.slotId}
                          placedStatement={getPlacedStatement(cell.slotId)}
                          isSubmitted={isSubmitted}
                          onReset={() => handleResetSlot(cell.slotId)}
                          isCorrectSection={false}
                          onZoom={setZoomedStatement}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Unassigned Statements Sidebar/Footer */}
          <div className="bg-white/90 backdrop-blur-xl border border-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl flex flex-col gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <div className="h-px w-full sm:flex-1 bg-earth-200 hidden sm:block" />
              <span className="text-[10px] sm:text-xs font-black text-earth-400 uppercase tracking-widest text-center px-2">
                SERET KEPINGAN PERNYATAAN DI BAWAH KE KOTAK KOSONG YANG TEPAT
              </span>
              <div className="h-px w-full sm:flex-1 bg-earth-200 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {INITIAL_STATEMENTS.map((statement) => (
                <DraggableStatement 
                  key={statement.id}
                  statement={statement}
                  isUsed={isStatementPlaced(statement.id)}
                  onClick={setSelectedStatementForClassification}
                />
              ))}
            </div>
          </div>

          {/* Action Submission Board */}
          <AnimatePresence>
            {allPlaced && !isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-center pt-4"
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

          {/* Submission Feedback Banner */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center bg-gradient-to-br from-leaf-500 to-leaf-600 border-4 border-leaf-400 text-white"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md shadow-lg rotate-12">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <h4 className="text-3xl font-black tracking-tight">KUIS SELESAI!</h4>
                  <p className="text-lg font-bold opacity-90">Memeriksa semua penempatan kepingan jawaban Anda...</p>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Drag Overlay Portal */}
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeStatement ? (
            <div className="p-4 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-br from-white to-slate-50 border-2 border-orange-400 text-earth-800 text-xs sm:text-sm font-black leading-relaxed scale-105 rotate-2 cursor-grabbing text-center">
              {activeStatement.text}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedStatement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedStatement(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-slate-100/80 flex flex-col items-center text-center gap-5 sm:gap-8 mx-auto"
            >
              {/* Main Text */}
              <p className="text-lg sm:text-2xl font-black text-slate-800 leading-relaxed">
                "{zoomedStatement.text}"
              </p>

              {/* Tutup Button */}
              <button
                onClick={() => setZoomedStatement(null)}
                className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold transition-all text-sm shadow-lg shadow-slate-900/20 active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <X className="w-4 h-4" />
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto Classification Modal / Bottom Sheet */}
      <AnimatePresence>
        {selectedStatementForClassification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStatementForClassification(null)}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-[2rem] p-5 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-4 sm:gap-6 mx-auto cursor-default max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              {/* Top Close X Button */}
              <button
                onClick={() => setSelectedStatementForClassification(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 h-5" />
              </button>

              {/* Header Title */}
              <div className="text-center mt-2 sm:mt-0">
                <span className="inline-block px-3 py-1 bg-earth-50 text-earth-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                  Pilih Kategori
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  Klasifikasikan Pernyataan
                </h3>
              </div>

              {/* Statement Content */}
              <div className="bg-slate-50 p-3 sm:p-5 rounded-2xl border border-slate-100 text-center max-h-[25vh] overflow-y-auto">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed italic">
                  "{selectedStatementForClassification.text}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                <button
                  onClick={() => {
                    placeStatementAutomatically(selectedStatementForClassification, true);
                    setSelectedStatementForClassification(null);
                  }}
                  disabled={isCategoryFull(true)}
                  className={cn(
                    "py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer",
                    isCategoryFull(true) 
                      ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
                      : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/20"
                  )}
                >
                  <span className="text-sm sm:text-lg">BENAR</span>
                  <span className="text-[8px] sm:text-[9px] opacity-80 uppercase tracking-wider font-bold">
                    {isCategoryFull(true) ? 'Penuh' : 'Kotak Benar'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    placeStatementAutomatically(selectedStatementForClassification, false);
                    setSelectedStatementForClassification(null);
                  }}
                  disabled={isCategoryFull(false)}
                  className={cn(
                    "py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer",
                    isCategoryFull(false) 
                      ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
                      : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20"
                  )}
                >
                  <span className="text-sm sm:text-lg">SALAH</span>
                  <span className="text-[8px] sm:text-[9px] opacity-80 uppercase tracking-wider font-bold">
                    {isCategoryFull(false) ? 'Penuh' : 'Kotak Salah'}
                  </span>
                </button>
              </div>

              {/* Batal Button */}
              <button
                onClick={() => setSelectedStatementForClassification(null)}
                className="py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg sm:rounded-xl font-bold transition-all text-[11px] sm:text-xs tracking-wider uppercase text-center w-full cursor-pointer active:scale-[0.98]"
              >
                Batal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
