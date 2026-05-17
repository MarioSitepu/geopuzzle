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
type Item = { id: string; content: string; image?: string; category: string; crop?: { x: number; width: number } };
type Category = { id: string; title: string; position?: { top: string; left: string; width: string; height: string } };

function DraggableItem({ item, isTsunami, isVolcano, isLandscapes, level }: { item: Item, isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean, level?: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      className={cn(
        "bg-white rounded-2xl shadow-lg border-2 cursor-grab active:cursor-grabbing text-sm font-bold text-earth-800 touch-none overflow-hidden transition-all duration-200 flex items-center justify-center group",
        (isLandscapes || (isVolcano && level === 'awal')) ? "w-28 h-28 sm:w-36 sm:h-36 p-0" : "p-4 min-w-[120px]",
        isDragging ? "opacity-0" : "opacity-100",
        isDragging ? "shadow-2xl ring-4 z-50" : "hover:shadow-xl",
        isTsunami ? 'border-blue-100 hover:border-blue-400' : isVolcano ? 'border-orange-100 hover:border-orange-400' : 'border-earth-100 hover:border-earth-400'
      )}
    >
      {(isLandscapes || (isVolcano && level === 'awal')) && item.image ? (
        <div className="flex flex-col items-center w-full h-full relative">
          {item.crop ? (
            <div 
              className="w-full h-full bg-no-repeat transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: '500% 100%',
                backgroundPosition: `${item.crop.x}% 0%`,
              }}
            />
          ) : (
            <img src={item.image} alt={item.content} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          )}
          
          {/* Glass overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 w-full bg-earth-900/90 backdrop-blur-md text-white text-[10px] py-2 px-1 text-center font-black uppercase tracking-wider translate-y-0 transition-transform">
            {item.content}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center px-4 py-2 text-center text-xs sm:text-sm font-black text-earth-900 leading-snug">
          {item.content}
        </div>
      )}
    </motion.div>
  );
}

function DroppableZone({ category, items, isTsunami, isVolcano, isLandscapes, level }: { category: Category, items: Item[], isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean, level?: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  if (isLandscapes || (isVolcano && level === 'awal')) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "relative flex items-center justify-center transition-all duration-500 rounded-2xl overflow-hidden",
          !items.length && "border border-white/40 bg-white/5 hover:bg-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)]",
          isOver && "bg-white/20 border-orange-400 ring-4 ring-orange-400/10 z-30 scale-[1.02]",
          category.position ? "absolute" : "min-h-[70px] w-full"
        )}
        style={category.position ? {
          top: category.position.top,
          left: category.position.left,
          width: category.position.width,
          height: category.position.height,
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          zIndex: 10
        } : undefined}
      >
        <div className="w-full h-full relative flex items-center justify-center p-2">
          {items?.map(item => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "z-20 shadow-sm transition-all duration-300",
                item.image ? "absolute inset-0" : "w-full h-full flex items-center justify-center bg-white rounded-xl border border-earth-100 px-4"
              )}
            >
              {item.image ? (
                item.crop ? (
                  <div 
                    className="w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: '500% 100%',
                      backgroundPosition: `${item.crop.x}% 0%`,
                    }}
                  />
                ) : (
                  <img
                    src={item.image}
                    alt="Placed"
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <span className="text-xs font-bold text-earth-800 text-center leading-snug">
                  {item.content}
                </span>
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
export default function ClassificationPuzzle({ onComplete, disasterId, level, stageIndex }: { onComplete: (score: number) => void, disasterId?: string, level?: string, stageIndex?: number }) {
  const isVolcano = disasterId === 'gunung-api';
  const isTsunami = disasterId === 'tsunami';
  const isLandscapes = disasterId === 'longsor';

  const categories: Category[] = (isVolcano && level === 'awal') ? (stageIndex === 2 ? [
    { id: 'level-1', title: 'LEVEL 1 NORMAL' },
    { id: 'level-2', title: 'LEVEL 2 (WASPADA)' },
    { id: 'level-3', title: 'LEVEL 3 (SIAGA)' },
    { id: 'level-4', title: 'LEVEL 4 (AWAS)' },
  ] : [
    { id: 'slot-1', title: 'Tahap 1', position: { top: '27.5%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-2', title: 'Tahap 2', position: { top: '54.1%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-3', title: 'Tahap 3', position: { top: '78.6%', left: '19.5%', width: '23.3%', height: '24.3%' } },
    { id: 'slot-4', title: 'Tahap 4', position: { top: '78.6%', left: '43.3%', width: '20.0%', height: '24.3%' } },
    { id: 'slot-5', title: 'Tahap 5', position: { top: '78.6%', left: '65.2%', width: '19.4%', height: '24.3%' } },
  ]) : isVolcano ? [
    { id: 'magmatik', title: 'Erupsi Magmatik' },
    { id: 'freatik', title: 'Erupsi Freatik' },
    { id: 'freatomagmatik', title: 'Erupsi Freatomagmatik' },
    { id: 'efusif', title: 'Erupsi Efusif' },
  ] : isTsunami ? [
    { id: 'gempa', title: 'Pemicu Gempa' },
    { id: 'longsor-laut', title: 'Pemicu Longsor Laut' },
    { id: 'vulkanik', title: 'Pemicu Vulkanik' },
    { id: 'meteor', title: 'Pemicu Ekstraterestrial' },
  ] : (isLandscapes && level === 'awal') ? (stageIndex === 1 ? [
    { id: 'top-1', title: 'Slot Kanan Atas', position: { top: '21.0%', left: '68.2%', width: '16.4%', height: '14.0%' } },
    { id: 'top-2', title: 'Slot Kiri Atas', position: { top: '38.5%', left: '30.9%', width: '16.4%', height: '14.0%' } },
    { id: 'top-3', title: 'Slot Kanan Tengah', position: { top: '54.5%', left: '80.9%', width: '16.4%', height: '14.0%' } },
    { id: 'bottom-1', title: 'Slot Kiri Bawah', position: { top: '63.0%', left: '37.3%', width: '16.4%', height: '14.0%' } },
    { id: 'bottom-2', title: 'Slot Tengah Bawah', position: { top: '66.5%', left: '62.7%', width: '16.4%', height: '14.0%' } },
  ] : [
    { id: 'top-1', title: 'Slot Atas 1', position: { top: '24%', left: '76%', width: '16%', height: '11%' } },
    { id: 'top-2', title: 'Slot Atas 2', position: { top: '30%', left: '52%', width: '16%', height: '11%' } },
    { id: 'top-3', title: 'Slot Atas 3', position: { top: '35%', left: '88%', width: '16%', height: '11%' } },
    { id: 'bottom-1', title: 'Slot Bawah 1', position: { top: '68%', left: '39%', width: '16%', height: '11%' } },
    { id: 'bottom-2', title: 'Slot Bawah 2', position: { top: '66%', left: '68%', width: '16%', height: '11%' } },
  ]) : (isLandscapes && level === 'menengah') ? [
    { id: 'falls', title: 'Falls (Jatuhan)' },
    { id: 'slides', title: 'Slides (Longsoran)' },
    { id: 'flows', title: 'Flows (Aliran)' },
    { id: 'creep', title: 'Creep (Rayapan)' },
  ] : [];

  const initialItems: Item[] = (isVolcano && level === 'awal') ? (stageIndex === 2 ? [
    { id: 'mit-1', content: 'Tetap tenang. Beraktivitas seperti biasa', category: 'level-1' },
    { id: 'mit-2', content: 'Tingkatkan kewaspadaan dan menjaga radius aman', category: 'level-2' },
    { id: 'mit-3', content: 'Mulai bersiap Evakuasi', category: 'level-3' },
    { id: 'mit-4', content: 'Segera evakuasi/mengungsi ke tempat yang lebih aman', category: 'level-4' },
    { id: 'mit-5', content: 'Pergi Melihat Langsung Kawah', category: 'wrong' },
  ] : [
    { id: 'vol-1', content: 'Subduksi', image: '/images/quiz/eruption/awal/2/5.png', category: 'slot-1' },
    { id: 'vol-2', content: 'Akumulasi', image: '/images/quiz/eruption/awal/2/2.png', category: 'slot-2' },
    { id: 'vol-3', content: 'Erupsi Awal', image: '/images/quiz/eruption/awal/2/4.png', category: 'slot-3' },
    { id: 'vol-4', content: 'Pertumbuhan', image: '/images/quiz/eruption/awal/2/3.png', category: 'slot-4' },
    { id: 'vol-5', content: 'Aktif', image: '/images/quiz/eruption/awal/2/1.png', category: 'slot-5' },
  ]) : isVolcano ? [
    { id: 'item-1', content: 'Melibatkan keluarnya magma segar ke permukaan', category: 'magmatik' },
    { id: 'item-2', content: 'Ledakan akibat interaksi air dengan batuan panas tanpa magma baru', category: 'freatik' },
    { id: 'item-3', content: 'Interaksi langsung antara magma dengan air eksternal', category: 'freatomagmatik' },
    { id: 'item-4', content: 'Magma keluar perlahan tanpa ledakan dahsyat', category: 'efusif' },
  ] : isTsunami ? [
    { id: 'item-1', content: 'Pergeseran vertikal lempeng di dasar samudra', category: 'gempa' },
    { id: 'item-2', content: 'Runtuhan material sedimen di lereng bawah laut', category: 'longsor-laut' },
    { id: 'item-3', content: 'Letusan gunung api di tengah laut atau pulau', category: 'vulkanik' },
    { id: 'item-4', content: 'Jatuhnya benda langit besar ke dalam samudra', category: 'meteor' },
  ] : (isLandscapes && level === 'awal') ? (stageIndex === 1 ? [
    { id: 'item-1', content: 'Jaring Kawat', image: '/images/quiz/landscape/lanjutan/3/jaring-kawat.png', category: 'penguatan' },
    { id: 'item-2', content: 'Pohon Akar Kuat', image: '/images/quiz/landscape/lanjutan/3/pohon-akar-cabang-akar-kuat.png', category: 'penguatan' },
    { id: 'item-3', content: 'Pohon Akar Lemah', image: '/images/quiz/landscape/lanjutan/3/pohon-akar-serabut-akar-lemah.png', category: 'penguatan' },
    { id: 'item-4', content: 'Drainase Air', image: '/images/quiz/landscape/lanjutan/3/drainase-air.png', category: 'penahan' },
    { id: 'item-5', content: 'Tembok Beton', image: '/images/quiz/landscape/lanjutan/3/tembok-beton.png', category: 'penahan' },
  ] : [
    { id: 'tree-1', content: 'Akar Kuat', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-cabang-akar-kuat.png', category: 'pohon' },
    { id: 'tree-2', content: 'Akar Lemah', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-serabut-akar-lemah.png', category: 'pohon' },
    { id: 'tree-3', content: 'Tanaman Perdu', image: '/images/quiz/landscape/lanjutan/2/jaring-kawat.png', category: 'pohon' }, // Using jaring as a placeholder for 3rd tree or as requested
    { id: 'drain-1', content: 'Drainase Air A', image: '/images/quiz/landscape/lanjutan/2/drainase-air.png', category: 'drainase' },
    { id: 'drain-2', content: 'Drainase Air B', image: '/images/quiz/landscape/lanjutan/2/tembok-beton.png', category: 'drainase' }, // Using beton as 2nd drainage placeholder
  ]) : isLandscapes ? [
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

    // Replace the item in the target category (since level awal has 1:1 mapping for slots)
    setAssignedItems(prev => ({
      ...prev,
      [targetCategoryId]: [item] // Use array with single item to replace previous
    }));
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = initialItems.length;

    Object.entries(assignedItems).forEach(([catId, items]) => {
      (items as Item[]).forEach(item => {
        if (level === 'awal' && isLandscapes) {
          if (stageIndex === 1) {
            if (catId.startsWith('top') && item.category === 'penguatan') correct++;
            else if (catId.startsWith('bottom') && item.category === 'penahan') correct++;
          } else {
            if (catId.startsWith('top') && item.category === 'pohon') correct++;
            else if (catId.startsWith('bottom') && item.category === 'drainase') correct++;
          }
        } else {
          if (item.category === catId) correct++;
        }
      });
    });

    // Total score should be based on number of categories (slots) to fill
    const score = Math.round((correct / categories.length) * 100);
    onComplete(score);
  };

  const isComplete = Object.values(assignedItems).every(items => items.length > 0);
  const isBoardStyle = ((isLandscapes && level === 'awal') || (isVolcano && level === 'awal')) && stageIndex !== 2;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-black text-earth-900 tracking-tight">
          {isBoardStyle ? "Lengkapi Papan Puzzle" : "Klasifikasi Fenomena"}
        </h2>
        <p className="text-earth-600 mt-2 font-medium italic">
          {isVolcano && level === 'awal' 
            ? (stageIndex === 2 
                ? "Level kesiagaan gunung api di Indonesia dibagi menjadi 4 tingkatan oleh PVMBG, pasangkan tindakan yang cocok dilakukan pada status-status gunung api tertentu dibawah ini."
                : "Urutkan kepingan puzzle berdasarkan proses terbentuknya gunung api dari awal hingga erupsi.")
            : isBoardStyle 
            ? "Tarik kepingan puzzle ke posisi yang tepat pada papan." 
            : "Klasifikasikan kepingan ke dalam kategori yang sesuai."}
        </p>
      </div>

      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Choices Panel */}
          <div className="lg:w-1/3 w-full bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sticky top-8 flex flex-col items-center overflow-hidden">
            {/* Glossy highlight effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative mb-8 text-center w-full">
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 shadow-sm",
                isVolcano ? "bg-orange-100 text-orange-600" : isTsunami ? "bg-blue-100 text-blue-600" : "bg-leaf-100 text-leaf-600"
              )}>
                PUZZLE ASSETS
              </span>
              <h3 className="text-xl font-black text-earth-900 leading-tight">
                {isBoardStyle ? "PILIH DAN TARIK KEPINGANNYA" : "Pilihan Item"}
              </h3>
            </div>

            <div className="flex flex-wrap gap-5 justify-center w-full">
              {unassignedItems.map((item) => (
                <DraggableItem 
                  key={item.id} 
                  item={item} 
                  isVolcano={isVolcano}
                  isTsunami={isTsunami}
                  isLandscapes={isLandscapes}
                  level={level}
                />
              ))}
              
              {unassignedItems.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg",
                    isVolcano ? "bg-orange-500" : isTsunami ? "bg-blue-500" : "bg-leaf-500"
                  )}>
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-earth-500 font-bold text-center px-4">
                    Hebat! Semua kepingan telah terpasang pada papan.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Board / Category Area */}
          <div className={cn(
            "lg:w-2/3 w-full rounded-3xl shadow-2xl border-4 overflow-hidden relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]",
            isBoardStyle ? "border-earth-200 bg-earth-50" : "bg-white/40 backdrop-blur-md p-8 border-earth-100"
          )}>
            {isBoardStyle && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={isVolcano ? "/images/quiz/eruption/awal/2/board.png" : (stageIndex === 1 ? "/images/quiz/landscape/lanjutan/3/2.png" : "/images/quiz/landscapes/landslide-bg.png")}
                  alt="Board" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className={cn(
              "relative z-10 w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]",
              (isVolcano && level === 'awal' && stageIndex === 2) ? "flex flex-col gap-6 max-w-4xl mx-auto py-10 px-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl mt-4" : (!isBoardStyle && "grid grid-cols-1 md:grid-cols-2 gap-8")
            )}>
              {categories.map((category, idx) => (
                <div key={category.id} className={cn(
                  (isVolcano && level === 'awal' && stageIndex === 2) ? "flex items-center gap-8 group" : "contents"
                )}>
                  {isVolcano && level === 'awal' && stageIndex === 2 && (
                    <>
                      {/* Level Label */}
                      <div className={cn(
                        "w-44 sm:w-56 py-4 sm:py-5 px-4 sm:px-6 rounded-2xl shadow-md border-t-2 border-white/50 text-center font-bold text-xs sm:text-sm tracking-widest transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg",
                        idx === 0 ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" :
                        idx === 1 ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white" :
                        idx === 2 ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" :
                        "bg-gradient-to-br from-rose-600 to-red-700 text-white"
                      )}>
                        {category.title}
                        <div className="mt-0.5 opacity-70 text-[8px] uppercase font-bold tracking-[0.1em]">Mitigasi</div>
                      </div>

                      {/* Elegant Single Arrow */}
                      <div className="flex-shrink-0">
                        <motion.div 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5 }}
                          className="text-earth-300 hidden sm:block opacity-60"
                        >
                          <svg className="w-12 h-6" fill="none" viewBox="0 0 40 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M30 7l5 5-5 5" />
                            <line x1="0" y1="12" x2="35" y2="12" />
                          </svg>
                        </motion.div>
                      </div>
                    </>
                  )}

                  <div className={cn("flex-grow", !(isVolcano && level === 'awal' && stageIndex === 2) && "contents")}>
                    <DroppableZone 
                      category={category} 
                      items={assignedItems[category.id] || []} 
                      isTsunami={isTsunami}
                      isVolcano={isVolcano}
                      isLandscapes={isLandscapes}
                      level={level}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay zIndex={1000} dropAnimation={null}>
          {activeItem ? (
            <div className={cn(
              "bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 overflow-hidden cursor-grabbing scale-110 z-1000 flex items-center justify-center",
              isBoardStyle ? "w-32 h-32" : "p-4 min-w-[150px]",
              isTsunami ? 'border-blue-500' : isVolcano ? 'border-orange-500' : 'border-earth-600'
            )}>
              {activeItem.image ? (
                <div className="flex flex-col items-center w-full h-full relative">
                  {activeItem.crop ? (
                    <div 
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${activeItem.image})`,
                        backgroundSize: '500% 100%',
                        backgroundPosition: `${activeItem.crop.x}% 0%`,
                      }}
                    />
                  ) : (
                    <img src={activeItem.image} alt={activeItem.content} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 w-full bg-earth-900/60 backdrop-blur-sm text-white text-[10px] py-1 px-1 text-center font-bold">
                    {activeItem.content}
                  </div>
                </div>
              ) : (
                <span className="text-sm font-bold text-earth-800">{activeItem.content}</span>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-8"
        >
          <button
            onClick={checkAnswers}
            className={cn(
              "px-16 py-4 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center gap-4",
              isVolcano ? "bg-orange-600 hover:bg-orange-700" : isTsunami ? "bg-blue-600 hover:bg-blue-700" : "bg-leaf-600 hover:bg-leaf-700"
            )}
          >
            Periksa Jawaban
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.div>
          </button>
        </motion.div>
      )}
    </div>
  );
}
