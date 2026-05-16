'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  useDraggable, 
  useDroppable,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  rectIntersection
} from '@dnd-kit/core';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

// --- Types ---
type Option = { id: string; image: string; value: string; condition: string };
type Board = { 
  id: string; 
  image: string; 
  title: string; 
  correctOptionId: string;
  slotConfig: { top: string; left: string; width: string; height: string };
};

interface DraggableOptionProps {
  option: Option;
  isFlood: boolean;
  isDragging?: boolean;
}

function DraggableOption({ option, isFlood, isDragging }: DraggableOptionProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: option.id,
    data: option,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white rounded-xl shadow-md border-2 border-earth-100 overflow-hidden cursor-grab active:cursor-grabbing transition-all hover:shadow-lg w-28 h-28 sm:w-36 sm:h-36 shrink-0",
        isDragging && "opacity-0",
        !isDragging && "hover:scale-105"
      )}
    >
      <img src={option.image} alt={option.value} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] sm:text-xs py-1 text-center font-bold">
        {option.value}
      </div>
    </div>
  );
}

function DroppableBoard({ board, assignedOption }: { board: Board; assignedOption: Option | null }) {
  const { setNodeRef, isOver } = useDroppable({
    id: board.id,
  });

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-earth-200 bg-white group">
      <div className="absolute top-4 left-4 z-20 bg-earth-800/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
        {board.title}
      </div>
      
      <div className="relative aspect-4/3">
        <img src={board.image} alt={board.title} className="w-full h-full object-cover" />
        
        {/* Drop Zone Overlay */}
        <div 
          ref={setNodeRef}
          style={{
            top: board.slotConfig.top,
            left: board.slotConfig.left,
            width: board.slotConfig.width,
            height: board.slotConfig.height,
          }}
          className={cn(
            "absolute border-4 border-dashed rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden",
            isOver ? "border-amber-400 bg-amber-400/20 scale-105 z-30" : "border-white/40 hover:border-white/60 bg-black/5",
            assignedOption ? "border-solid border-green-500 bg-white" : ""
          )}
        >
          {assignedOption ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full relative"
            >
              <img src={assignedOption.image} alt={assignedOption.value} className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-4 ring-inset ring-green-500/30 rounded-lg" />
            </motion.div>
          ) : (
            <div className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center px-2">
              Drop FK Disini
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchingPuzzle({ onComplete, disasterId, level }: { onComplete: (score: number) => void, disasterId?: string, level?: string }) {
  const isLandscapes = disasterId === 'longsor';
  
  const options: Option[] = [
    { id: 'a', image: '/images/quiz/landscapes2/a.png', value: 'FK 1.0', condition: 'Sangat Terjal' },
    { id: 'b', image: '/images/quiz/landscapes2/b.png', value: 'FK 1.2', condition: 'Sedang' },
    { id: 'c', image: '/images/quiz/landscapes2/c.png', value: 'FK 1.4', condition: 'Tidak Terlalu Terjal' },
    { id: 'd', image: '/images/quiz/landscapes2/d.png', value: 'FK 1.7', condition: 'Landai' },
  ];

  const boards: Board[] = [
    { 
      id: 'board-1', 
      image: '/images/quiz/landscapes2/1.png', 
      title: 'Kondisi 1: Lereng Landai', 
      correctOptionId: 'd',
      slotConfig: { top: '56%', left: '72%', width: '23%', height: '28%' }
    },
    { 
      id: 'board-2', 
      image: '/images/quiz/landscapes2/2.png', 
      title: 'Kondisi 2: Lereng Sedang', 
      correctOptionId: 'b',
      slotConfig: { top: '55%', left: '74%', width: '23%', height: '28%' }
    },
    { 
      id: 'board-3', 
      image: '/images/quiz/landscapes2/3.png', 
      title: 'Kondisi 3: Lereng Terjal', 
      correctOptionId: 'a',
      slotConfig: { top: '12%', left: '73%', width: '23%', height: '28%' }
    },
  ];

  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && boards.find(b => b.id === over.id)) {
      const optionId = active.id as string;
      const boardId = over.id as string;

      setAssignments(prev => {
        const newAssignments = { ...prev };
        
        // Remove this option from any other board it might be assigned to
        Object.keys(newAssignments).forEach(key => {
          if (newAssignments[key] === optionId) delete newAssignments[key];
        });

        // Assign to new board
        newAssignments[boardId] = optionId;
        return newAssignments;
      });
    }
  };

  useEffect(() => {
    if (Object.keys(assignments).length === boards.length) {
      setIsComplete(true);
    }
  }, [assignments, boards.length]);

  const checkAnswers = () => {
    let correct = 0;
    boards.forEach(board => {
      if (assignments[board.id] === board.correctOptionId) {
        correct++;
      }
    });

    const score = Math.round((correct / boards.length) * 100);
    onComplete(score);
  };

  const activeOption = options.find(o => o.id === activeId);
  const unassignedOptions = options.filter(o => !Object.values(assignments).includes(o.id));

  return (
    <div className="space-y-10 pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-earth-900">Analisis Keamanan Lereng</h2>
        <p className="text-earth-600 mt-2 max-w-2xl mx-auto">
          Tentukan Faktor Keamanan (FK) yang tepat untuk setiap kondisi lereng berdasarkan analisis stabilitas lahan.
        </p>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={rectIntersection}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {boards.map((board) => (
            <DroppableBoard 
              key={board.id} 
              board={board} 
              assignedOption={options.find(o => o.id === assignments[board.id]) || null}
            />
          ))}
        </div>

        {/* Floating Dock for unassigned options */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-full max-w-4xl px-4">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-earth-100 flex flex-col items-center">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-earth-400 mb-3">Pilihan Faktor Keamanan (Target FK)</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 w-full justify-center no-scrollbar">
              {options.map((option) => (
                <DraggableOption 
                  key={option.id} 
                  option={option} 
                  isFlood={false} 
                  isDragging={activeId === option.id}
                />
              ))}
            </div>
          </div>
        </div>

        <DragOverlay zIndex={1000}>
          {activeOption ? (
            <div className="bg-white rounded-xl shadow-2xl border-2 border-amber-500 overflow-hidden cursor-grabbing w-32 h-32 scale-110">
              <img src={activeOption.image} alt={activeOption.value} className="w-full h-full object-cover" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-8"
        >
          <button
            onClick={checkAnswers}
            className="px-10 py-4 bg-earth-800 hover:bg-earth-900 text-white rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Kirim Analisis
          </button>
        </motion.div>
      )}

      {/* Spacer for dock */}
      <div className="h-40" />
    </div>
  );
}
