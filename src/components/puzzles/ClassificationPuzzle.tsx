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
type Category = { id: string; title: string; position?: { top: string; left: string; width: string; height: string } };

function DraggableItem({ item, isTsunami, isVolcano, isLandscapes }: { item: Item, isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean }) {
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
        isDragging && `shadow-md ring-2 z-50 ${isTsunami ? 'ring-blue-500' : isVolcano ? 'ring-orange-500' : 'ring-earth-600'}`
      )}
    >
      {isLandscapes && item.image ? (
        <img src={item.image} alt={item.content} className="w-full h-full object-contain p-1" />
      ) : (
        item.content
      )}
    </div>
  );
}

function DroppableZone({ category, items, isTsunami, isVolcano, isLandscapes }: { category: Category, items: Item[], isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  if (isLandscapes) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "relative flex items-center justify-center transition-all duration-300 rounded-xl border-2 border-dashed border-black/20 bg-black/5 hover:border-black/40 hover:bg-black/10",
          isOver && "bg-amber-500/20 border-amber-500 scale-105 z-30",
          category.position && "absolute"
        )}
        style={category.position ? {
          top: category.position.top,
          left: category.position.left,
          width: category.position.width,
          height: category.position.height,
        } : undefined}
      >
        <div className="w-full h-full relative overflow-hidden rounded-xl">
          {items?.map(item => (
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
                  className="w-full h-full object-contain shadow-inner" 
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
        isOver ? (isTsunami ? "bg-blue-50 border-blue-400" : isVolcano ? "bg-orange-50 border-orange-400" : "bg-earth-100 border-earth-400") : "bg-earth-50/50 border-earth-200"
      )}
    >
      <h3 className="font-semibold text-earth-900 mb-3 text-center">{category.title}</h3>
      <div className="flex flex-col gap-2">
        {items?.map(item => (
          <div key={item.id} className="p-2 bg-white rounded-lg shadow-sm text-sm border border-earth-100 text-center">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function ClassificationPuzzle({ onComplete, disasterId, level }: { onComplete: (score: number) => void, disasterId?: string, level?: string }) {
  const isVolcano = disasterId === 'gunung-api';
  const isTsunami = disasterId === 'tsunami';
  const isLandscapes = disasterId === 'longsor';

  const categories: Category[] = isVolcano ? [
    { id: 'magmatik', title: 'Erupsi Magmatik' },
    { id: 'freatik', title: 'Erupsi Freatik' },
    { id: 'freatomagmatik', title: 'Erupsi Freatomagmatik' },
    { id: 'efusif', title: 'Erupsi Efusif' },
  ] : isTsunami ? [
    { id: 'gempa', title: 'Pemicu Gempa' },
    { id: 'longsor-laut', title: 'Pemicu Longsor Laut' },
    { id: 'vulkanik', title: 'Pemicu Vulkanik' },
    { id: 'meteor', title: 'Pemicu Ekstraterestrial' },
  ] : (isLandscapes && level === 'awal') ? [
    { id: 'drainase', title: 'Drainase Air', position: { top: '27%', left: '60%', width: '18%', height: '12%' } },
    { id: 'jaring', title: 'Jaring Kawat', position: { top: '33%', left: '36%', width: '18%', height: '12%' } },
    { id: 'pohon-lemah', title: 'Akar Lemah', position: { top: '41%', left: '72%', width: '18%', height: '12%' } },
    { id: 'pohon-kuat', title: 'Akar Kuat', position: { top: '73%', left: '23%', width: '18%', height: '12%' } },
    { id: 'beton', title: 'Tembok Beton', position: { top: '71%', left: '52%', width: '18%', height: '12%' } },
  ] : [
    { id: 'falls', title: 'Falls (Jatuhan)' },
    { id: 'slides', title: 'Slides (Longsoran)' },
    { id: 'flows', title: 'Flows (Aliran)' },
    { id: 'creep', title: 'Creep (Rayapan)' },
  ];

  const initialItems: Item[] = isVolcano ? [
    { id: 'item-1', content: 'Melibatkan keluarnya magma segar ke permukaan', category: 'magmatik' },
    { id: 'item-2', content: 'Ledakan akibat interaksi air dengan batuan panas tanpa magma baru', category: 'freatik' },
    { id: 'item-3', content: 'Interaksi langsung antara magma dengan air eksternal', category: 'freatomagmatik' },
    { id: 'item-4', content: 'Magma keluar perlahan tanpa ledakan dahsyat', category: 'efusif' },
  ] : isTsunami ? [
    { id: 'item-1', content: 'Pergeseran vertikal lempeng di dasar samudra', category: 'gempa' },
    { id: 'item-2', content: 'Runtuhan material sedimen di lereng bawah laut', category: 'longsor-laut' },
    { id: 'item-3', content: 'Letusan gunung api di tengah laut atau pulau', category: 'vulkanik' },
    { id: 'item-4', content: 'Jatuhnya benda langit besar ke dalam samudra', category: 'meteor' },
  ] : (isLandscapes && level === 'awal') ? [
    { id: 'item-1', content: 'Drainase Air', image: '/images/quiz/landscape/lanjutan/2/drainase-air.png', category: 'drainase' },
    { id: 'item-2', content: 'Jaring Kawat', image: '/images/quiz/landscape/lanjutan/2/jaring-kawat.png', category: 'jaring' },
    { id: 'item-3', content: 'Pohon Akar Kuat', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-cabang-akar-kuat.png', category: 'pohon-kuat' },
    { id: 'item-4', content: 'Tembok Beton', image: '/images/quiz/landscape/lanjutan/2/tembok-beton.png', category: 'beton' },
    { id: 'item-5', content: 'Pohon Akar Lemah', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-serabut-akar-lemah.png', category: 'pohon-lemah' },
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
        <h2 className={cn(
          "font-bold text-earth-900",
          (isLandscapes && level === 'awal') ? "text-xl leading-snug" : "text-2xl"
        )}>
          {isVolcano ? "Klasifikasi Erupsi Gunung Api" : isTsunami ? "Klasifikasi Pemicu Tsunami" : (isLandscapes && level === 'awal') ? "Kondisi lereng curam di tepi jalan raya dengan pelapukan batuan intensif yang sering hadir genangan air, kombinasi mitigasi bencana apa yang mudah dilakukan olehmu?" : isLandscapes ? "Identifikasi Jenis Pergerakan Tanah" : "Klasifikasi Pergerakan Tanah"}
        </h2>
        <p className="text-earth-600 mt-2 font-medium">
          { (isLandscapes && level === 'awal') ? "INSTRUKSI: TARIK DAN ISI KOLOM PUZZLE DIBAWAH DENGAN MEMPERTIMBANGKAN KONDISI YANG ADA DI SOAL KAMU" : isLandscapes ? "Tarik gambar ke kotak slot yang sesuai di papan." : "Tarik dan letakkan deskripsi ke kategori yang tepat."}
        </p>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        {isLandscapes ? (
          <div className="relative w-full max-w-5xl mx-auto rounded-3xl shadow-2xl border-4 border-earth-200 overflow-hidden">
            {/* Background Board - Stacks in first cell */}
            <img 
              src={ (isLandscapes && level === 'awal') ? "/images/quiz/landscape/lanjutan/2/1.png" : "/images/quiz/landscapes/1.png" } 
              alt="Board" 
              className="w-full h-auto pointer-events-none z-0"
            />
            
            {/* Overlay Drop Zones - Stacks on top of image */}
            <div className={cn(
              "absolute inset-0 z-50 pointer-events-auto",
              (isLandscapes && level !== 'awal') && "grid grid-cols-4 px-[6%] pb-[6%] pt-[13%] gap-[3%]"
            )}>
              {categories.map(cat => (
                <DroppableZone 
                  key={cat.id} 
                  category={cat} 
                  items={assignedItems[cat.id] || []} 
                  isTsunami={isTsunami} 
                  isVolcano={isVolcano}
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
                items={assignedItems[cat.id] || []} 
                isTsunami={isTsunami} 
                isVolcano={isVolcano}
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
                isTsunami={isTsunami} 
                isVolcano={isVolcano}
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
                <img src={activeItem.image} alt={activeItem.content} className="w-full h-full object-contain p-1" />
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
              (isVolcano || isTsunami) ? (isVolcano ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700") : "bg-earth-700 hover:bg-earth-800"
            }`}
          >
            Periksa Jawaban
          </button>
        </motion.div>
      )}
    </div>
  );
}
