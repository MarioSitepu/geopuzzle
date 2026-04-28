'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortableItemProps {
  id: string;
  content: string;
  key?: string | number;
}

function SortableItem({ id, content }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-earth-200 mb-3 cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-50 shadow-lg ring-2 ring-leaf-500 z-50 relative"
      )}
    >
      <div className="p-1 text-earth-400">
        <GripVertical className="w-5 h-5" />
      </div>
      <span className="font-medium text-earth-800 pointer-events-none">{content}</span>
    </div>
  );
}

export default function OrderingPuzzle({ onComplete, disasterId }: { onComplete: (score: number) => void, disasterId?: string }) {
  const isFlood = disasterId === 'banjir';

  const initialItems = isFlood ? [
    { id: '1', content: 'Curah Hujan Ekstrem' },
    { id: '2', content: 'Kapasitas Saluran Sungai Mengecil' },
    { id: '3', content: 'Sistem Drainase yang Buruk' },
    { id: '4', content: 'Tumpukan Sampah di Saluran Air' },
  ] : [
    { id: '1', content: 'Lampung Barat (Sangat Tinggi)' },
    { id: '2', content: 'Lampung Selatan (Tinggi)' },
    { id: '3', content: 'Lampung Tengah (Sedang)' },
    { id: '4', content: 'Lampung Timur (Rendah)' },
  ];

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    // Shuffle only on client side to avoid hydration mismatch
    setItems([...initialItems].sort(() => Math.random() - 0.5));
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
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    items.forEach((item, index) => {
      if (item.id === initialItems[index].id) correct++;
    });

    const score = Math.round((correct / items.length) * 100);
    onComplete(score);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-earth-900">{isFlood ? "Urutkan Penyebab" : "Urutkan Wilayah"}</h2>
        <p className="text-earth-600 mt-2">{isFlood ? "Urutkan faktor penyebab banjir dari yang paling berdampak besar (di atas)." : "Urutkan wilayah berdasarkan tingkat kerawanan longsor (dari yang paling rawan di atas)."}</p>
      </div>

      <div className="glass p-6 rounded-3xl">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

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
    </div>
  );
}
