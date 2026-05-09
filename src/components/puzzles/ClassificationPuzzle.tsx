'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  closestCenter
} from '@dnd-kit/core';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

// --- Types ---
type Item = { id: string; content: string; image?: string; category: string };
type Category = { id: string; title: string };

function DraggableItem({ item, isFlood, isLandscapes }: { item: Item, isFlood: boolean, isLandscapes: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
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
        "bg-white rounded-xl shadow-sm border border-earth-200 cursor-grab active:cursor-grabbing text-sm font-medium text-earth-800 touch-none overflow-hidden transition-opacity",
        isLandscapes ? "w-24 h-24 sm:w-32 sm:h-32 p-0" : "p-3",
        isDragging ? "opacity-0" : "opacity-100",
        isDragging && `shadow-md ring-2 z-50 ${isFlood ? 'ring-blue-500' : 'ring-earth-600'}`
      )}
    >
      {isLandscapes && item.image ? (
        <img src={item.image} alt={item.content} className="w-full h-full object-cover" />
      ) : (
        item.content
      )}
    </div>
  );
}

function DroppableZone({ category, items, isFlood, isLandscapes }: { category: Category, items: Item[], isFlood: boolean, isLandscapes: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  if (isLandscapes) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "w-full h-full relative flex items-center justify-center transition-all duration-300 rounded-xl border-2 border-amber-600/30 bg-amber-900/5",
          isOver ? "bg-amber-500/20 border-amber-500 scale-105" : "hover:border-amber-600/50"
        )}
      >
        <div className="w-full h-full relative overflow-hidden rounded-xl">
          {items.map(item => (
            <motion.div 
              key={item.id} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-white z-20"
            >
              {item.image && (
                <img 
                  src={item.image} 
                  alt="Placed" 
                  className="w-full h-full object-cover shadow-inner" 
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-2xl min-h-[150px] transition-colors border-2 border-dashed",
        isOver ? (isFlood ? "bg-blue-50 border-blue-400" : "bg-earth-100 border-earth-400") : "bg-earth-50/50 border-earth-200"
      )}
    >
      <h3 className="font-semibold text-earth-900 mb-3 text-center">{category.title}</h3>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.id} className="p-2 bg-white rounded-lg shadow-sm text-sm border border-earth-100 text-center">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function ClassificationPuzzle({ onComplete, disasterId }: { onComplete: (score: number) => void, disasterId?: string }) {
  const isFlood = disasterId === 'banjir';
  const isLandscapes = disasterId === 'longsor';

  const categories: Category[] = isFlood ? [
    { id: 'bandang', title: 'Banjir Bandang' },
    { id: 'rob', title: 'Banjir Rob' },
    { id: 'sungai', title: 'Banjir Sungai' },
    { id: 'genangan', title: 'Banjir Genangan' },
  ] : [
    { id: 'falls', title: 'Falls (Jatuhan)' },
    { id: 'slides', title: 'Slides (Longsoran)' },
    { id: 'flows', title: 'Flows (Aliran)' },
    { id: 'creep', title: 'Creep (Rayapan)' },
  ];

  const initialItems: Item[] = isFlood ? [
    { id: 'item-1', content: 'Datang tiba-tiba dengan arus air deras', category: 'bandang' },
    { id: 'item-2', content: 'Genangan daratan pesisir akibat air laut pasang', category: 'rob' },
    { id: 'item-3', content: 'Meluapnya air melebihi kapasitas badan sungai', category: 'sungai' },
    { id: 'item-4', content: 'Air tergenang akibat sistem drainase yang buruk', category: 'genangan' },
  ] : isLandscapes ? [
    { id: 'item-1', content: 'Runtuhan (Falls)', image: '/images/quiz/landscapes/2.png', category: 'falls' },
    { id: 'item-2', content: 'Longsoran (Slides)', image: '/images/quiz/landscapes/3.png', category: 'slides' },
    { id: 'item-3', content: 'Aliran (Flows)', image: '/images/quiz/landscapes/4.png', category: 'flows' },
    { id: 'item-4', content: 'Rayapan (Creep)', image: '/images/quiz/landscapes/5.png', category: 'creep' },
  ] : [
    { id: 'item-1', content: 'Batu jatuh bebas dari tebing', category: 'falls' },
    { id: 'item-2', content: 'Pergerakan massa tanah lambat', category: 'creep' },
    { id: 'item-3', content: 'Lumpur mengalir cepat di lembah', category: 'flows' },
    { id: 'item-4', content: 'Blok tanah meluncur pada bidang miring', category: 'slides' },
  ];

  const [unassignedItems, setUnassignedItems] = useState<Item[]>(() => {
    // Shuffle initial items
    return [...initialItems].sort(() => Math.random() - 0.5);
  });
  const [assignedItems, setAssignedItems] = useState<Record<string, Item[]>>(() => {
    const initial: Record<string, Item[]> = {};
    categories.forEach(c => initial[c.id] = []);
    return initial;
  });

  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = unassignedItems.find(i => i.id === active.id);
    if (item) setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveItem(null);
    if (!over) return;

    const itemId = active.id as string;
    const targetCategoryId = over.id as string;
    
    const item = unassignedItems.find(i => i.id === itemId);
    if (!item) return;

    // Move item
    setUnassignedItems(prev => prev.filter(i => i.id !== itemId));
    setAssignedItems(prev => ({
      ...prev,
      [targetCategoryId]: [...prev[targetCategoryId], item]
    }));
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = initialItems.length;
    
    Object.entries(assignedItems).forEach(([catId, items]) => {
      (items as Item[]).forEach(item => {
        if (item.category === catId) correct++;
      });
    });

    const score = Math.round((correct / total) * 100);
    onComplete(score);
  };

  const isComplete = unassignedItems.length === 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-earth-900">
          {isFlood ? "Klasifikasi Jenis Banjir" : isLandscapes ? "Identifikasi Jenis Pergerakan Tanah" : "Klasifikasi Pergerakan Tanah"}
        </h2>
        <p className="text-earth-600 mt-2">
          {isLandscapes ? "Tarik gambar ke kotak slot yang sesuai di papan." : "Tarik dan letakkan deskripsi ke kategori yang tepat."}
        </p>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        {isLandscapes ? (
          <div className="relative w-full max-w-5xl mx-auto rounded-3xl shadow-2xl border-4 border-earth-200 grid overflow-hidden aspect-[1645/525]">
            {/* Background Board - Stacks in first cell */}
            <img 
              src="/images/quiz/landscapes/1.png" 
              alt="Board" 
              className="col-start-1 row-start-1 w-full h-full object-contain pointer-events-none z-0"
            />
            
            {/* Overlay Drop Zones - Stacks in SAME first cell */}
            <div className="col-start-1 row-start-1 w-full h-full grid grid-cols-4 px-[6%] pb-[6%] pt-[13%] gap-[3%] z-50 pointer-events-auto">
              {categories.map(cat => (
                <DroppableZone 
                  key={cat.id} 
                  category={cat} 
                  items={assignedItems[cat.id]} 
                  isFlood={isFlood} 
                  isLandscapes={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <DroppableZone 
                key={cat.id} 
                category={cat} 
                items={assignedItems[cat.id]} 
                isFlood={isFlood} 
                isLandscapes={false}
              />
            ))}
          </div>
        )}

        <div className={cn(
          "mt-8 p-6 glass rounded-2xl min-h-[120px] z-0",
          isLandscapes && "bg-white/40"
        )}>
          <h3 className="text-sm font-medium text-earth-500 mb-4 uppercase tracking-wider">
            {isLandscapes ? "Geser Gambar ke Papan" : "Item yang belum diklasifikasi"}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {unassignedItems.map(item => (
              <DraggableItem 
                key={item.id} 
                item={item} 
                isFlood={isFlood} 
                isLandscapes={isLandscapes} 
              />
            ))}
            {unassignedItems.length === 0 && (
              <p className="text-earth-400 italic text-sm w-full text-center">Semua item telah diklasifikasi.</p>
            )}
          </div>
        </div>

        <DragOverlay zIndex={1000} dropAnimation={null}>
          {activeItem ? (
            <div className={cn(
              "bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-leaf-500 overflow-hidden cursor-grabbing scale-110 z-[1000]",
              isLandscapes ? "w-24 h-24 sm:w-32 sm:h-32" : "p-3"
            )}>
              {isLandscapes && activeItem.image ? (
                <img src={activeItem.image} alt={activeItem.content} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-earth-800">{activeItem.content}</span>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={checkAnswers}
            className={`px-8 py-3 text-white rounded-full font-bold shadow-lg transition-colors ${
              isFlood ? "bg-blue-600 hover:bg-blue-700" : "bg-earth-700 hover:bg-earth-800"
            }`}
          >
            Periksa Jawaban
          </button>
        </motion.div>
      )}
    </div>
  );
}
