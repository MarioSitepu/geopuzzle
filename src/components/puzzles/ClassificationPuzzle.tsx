'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

// --- Types ---
type Item = { id: string; content: string; category: string };
type Category = { id: string; title: string };

// --- Components ---
function DraggableItem({ item }: { item: Item, key?: string | number }) {
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
        "p-3 bg-white rounded-xl shadow-sm border border-earth-200 cursor-grab active:cursor-grabbing text-sm font-medium text-earth-800",
        isDragging && "opacity-50 shadow-md ring-2 ring-leaf-500 z-50"
      )}
    >
      {item.content}
    </div>
  );
}

function DroppableZone({ category, items }: { category: Category, items: Item[], key?: string | number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-2xl min-h-[150px] transition-colors border-2 border-dashed",
        isOver ? "bg-leaf-50 border-leaf-400" : "bg-earth-50/50 border-earth-200"
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
export default function ClassificationPuzzle({ onComplete }: { onComplete: (score: number) => void }) {
  const categories: Category[] = [
    { id: 'falls', title: 'Falls (Jatuhan)' },
    { id: 'slides', title: 'Slides (Longsoran)' },
    { id: 'flows', title: 'Flows (Aliran)' },
    { id: 'creep', title: 'Creep (Rayapan)' },
  ];

  const initialItems: Item[] = [
    { id: 'item-1', content: 'Batu jatuh bebas dari tebing', category: 'falls' },
    { id: 'item-2', content: 'Pergerakan massa tanah lambat', category: 'creep' },
    { id: 'item-3', content: 'Lumpur mengalir cepat di lembah', category: 'flows' },
    { id: 'item-4', content: 'Blok tanah meluncur pada bidang miring', category: 'slides' },
  ];

  const [unassignedItems, setUnassignedItems] = useState<Item[]>(initialItems);
  const [assignedItems, setAssignedItems] = useState<Record<string, Item[]>>({
    falls: [], slides: [], flows: [], creep: []
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
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
        <h2 className="text-2xl font-bold text-earth-900">Klasifikasi Pergerakan Tanah</h2>
        <p className="text-earth-600 mt-2">Tarik dan letakkan deskripsi ke kategori yang tepat.</p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <DroppableZone key={cat.id} category={cat} items={assignedItems[cat.id]} />
          ))}
        </div>

        <div className="mt-8 p-6 glass rounded-2xl min-h-[120px]">
          <h3 className="text-sm font-medium text-earth-500 mb-4 uppercase tracking-wider">Item yang belum diklasifikasi</h3>
          <div className="flex flex-wrap gap-3">
            {unassignedItems.map(item => (
              <DraggableItem key={item.id} item={item} />
            ))}
            {unassignedItems.length === 0 && (
              <p className="text-earth-400 italic text-sm w-full text-center">Semua item telah diklasifikasi.</p>
            )}
          </div>
        </div>
      </DndContext>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={checkAnswers}
            className="px-8 py-3 bg-leaf-600 text-white rounded-full font-bold shadow-lg hover:bg-leaf-700 transition-colors"
          >
            Periksa Jawaban
          </button>
        </motion.div>
      )}
    </div>
  );
}
