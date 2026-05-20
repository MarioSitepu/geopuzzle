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
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

// --- Types ---
type Item = { id: string; content: string; image?: string; category: string; crop?: { x: number; width: number } };
type Category = { id: string; title: string; position?: { top: string; left: string; width: string; height: string } };

function DraggableItem({ item, isTsunami, isVolcano, isLandscapes, level, stageIndex, isPlaced, onClick }: { item: Item, isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean, level?: string, stageIndex?: number, isPlaced?: boolean, onClick?: (item: Item) => void }) {
  const isVolcanoLanjut1 = isVolcano && level === 'atas' && stageIndex === 0;
  const isTsunamiLanjut1 = isTsunami && level === 'atas' && stageIndex === 0;
  const isCloningMode = isLandscapes && level === 'awal' && (stageIndex === 0 || stageIndex === 1);
  const isTransparentPlaced = isPlaced && (isCloningMode || (isLandscapes && level === 'atas') || (isVolcano && level === 'awal'));
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
      onClick={(e) => {
        if (onClick) onClick(item);
      }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      className={cn(
        "cursor-grab active:cursor-grabbing text-sm font-bold text-earth-800 touch-none overflow-hidden transition-all duration-200 flex items-center justify-center group",
        isTransparentPlaced ? "bg-transparent border-0" : "bg-white rounded-2xl shadow-lg border-2",
        isPlaced ? "w-full h-full absolute inset-0" : ((isLandscapes || (isVolcano && level === 'awal') || isVolcanoLanjut1 || isTsunamiLanjut1 || (isLandscapes && level === 'atas')) ? "w-28 h-28 sm:w-36 sm:h-36 p-0" : "p-4 min-w-[120px]"),
        isDragging ? "opacity-0" : "opacity-100",
        isDragging ? "shadow-2xl ring-4 z-50" : (!isTransparentPlaced ? "hover:shadow-xl" : ""),
        !isTransparentPlaced ? (isTsunami ? 'border-blue-100 hover:border-blue-400' : isVolcano ? 'border-orange-100 hover:border-orange-400' : 'border-earth-100 hover:border-earth-400') : ""
      )}
    >
      {(isLandscapes || (isVolcano && level === 'awal') || isVolcanoLanjut1 || isTsunamiLanjut1 || (isLandscapes && level === 'atas')) && item.image ? (
        <div className="flex flex-col items-center w-full h-full relative">
          {item.crop ? (
            <div
              className={cn("w-full h-full bg-no-repeat transition-transform duration-500", !isTransparentPlaced && "group-hover:scale-110")}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: '500% 100%',
                backgroundPosition: `${item.crop.x}% 0%`,
              }}
            />
          ) : (
            <img src={item.image} alt={item.content} className={cn("w-full h-full object-contain transition-transform duration-500", !isTransparentPlaced && "group-hover:scale-110")} />
          )}

          {/* Glass overlay and text on hover */}
          {!isTransparentPlaced && !(isPlaced && isTsunamiLanjut1) && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 w-full bg-earth-900/90 backdrop-blur-md text-white text-[10px] py-2 px-1 text-center font-black uppercase tracking-wider translate-y-0 transition-transform">
                {item.content}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center px-4 py-2 text-center text-xs sm:text-sm font-black text-earth-900 leading-snug">
          {item.content}
        </div>
      )}
    </motion.div>
  );
}

function DroppableZone({ category, items, isTsunami, isVolcano, isLandscapes, level, stageIndex, onItemClick, isMobile }: { category: Category, items: Item[], isTsunami: boolean, isVolcano: boolean, isLandscapes: boolean, level?: string, stageIndex?: number, onItemClick?: (item: Item) => void, isMobile?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
  });

  const isVolcanoLanjut1 = isVolcano && level === 'atas' && stageIndex === 0;
  const isTsunamiLanjut1 = isTsunami && level === 'atas' && stageIndex === 0;

  if (isLandscapes || (isVolcano && level === 'awal') || isVolcanoLanjut1 || isTsunamiLanjut1 || (isLandscapes && level === 'atas')) {
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
            <DraggableItem
              key={item.id}
              item={item}
              isTsunami={isTsunami}
              isVolcano={isVolcano}
              isLandscapes={isLandscapes}
              level={level}
              stageIndex={stageIndex}
              isPlaced={true}
              onClick={onItemClick}
            />
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
          <div
            key={item.id}
            onClick={() => {
              if (isMobile && onItemClick) {
                onItemClick(item);
              }
            }}
            className={cn(
              "p-2 bg-white rounded-lg shadow-sm text-sm border border-earth-100 text-center select-none",
              isMobile && "cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors active:scale-95 duration-150"
            )}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClassificationPuzzle({ onComplete, disasterId, level, stageIndex }: { onComplete: (score: number) => void, disasterId?: string, level?: string, stageIndex?: number }) {
  const isVolcano = disasterId === 'gunung-api';
  const isTsunami = disasterId === 'tsunami';
  const isLandscapes = disasterId === 'longsor';

  const isVolcanoLanjut1 = isVolcano && level === 'atas' && stageIndex === 0;
  const isTsunamiLanjut1 = isTsunami && level === 'atas' && stageIndex === 0;
  const isVolcanoAwalSoal2 = isVolcano && level === 'awal' && stageIndex === 0;
  const isLongsorLanjut = isLandscapes && level === 'atas';
  const isLongsorAwalStages = isLandscapes && level === 'awal' && (stageIndex === 0 || stageIndex === 1);
  const isCloningMode = isLandscapes && level === 'awal' && (stageIndex === 0 || stageIndex === 1);

  const categories: Category[] = isTsunamiLanjut1 ? [
    { id: 'slot-peak', title: 'Puncak Gunung', position: { top: '22.5%', left: '57.3%', width: '10.5%', height: '9.5%' } },
    { id: 'slot-sea', title: 'Laut', position: { top: '44.5%', left: '8.5%', width: '10.5%', height: '9.5%' } },
    { id: 'slot-building', title: 'Gedung Tinggi', position: { top: '39.5%', left: '75.5%', width: '10.5%', height: '9.5%' } },
    { id: 'slot-beach', title: 'Pemukiman Pantai', position: { top: '72.0%', left: '47.0%', width: '10.5%', height: '9.5%' } },
    { id: 'slot-golf', title: 'Lapangan Golf', position: { top: '76.5%', left: '89.3%', width: '10.5%', height: '9.5%' } },
  ] : isVolcanoLanjut1 ? [
    { id: 'slot-1', title: 'Kerucut Berlapis (Strato)', position: { top: '26%', left: '20%', width: '16%', height: '20%' } },
    { id: 'slot-2', title: 'Kaldera', position: { top: '26%', left: '52%', width: '16%', height: '20%' } },
    { id: 'slot-3', title: 'Maar', position: { top: '26%', left: '82%', width: '16%', height: '20%' } },
    { id: 'slot-4', title: 'Kubah (Dome)', position: { top: '64%', left: '37%', width: '16%', height: '20%' } },
    { id: 'slot-5', title: 'Perisai (Shield)', position: { top: '64%', left: '65%', width: '16%', height: '20%' } },
  ] : (isVolcano && level === 'awal' && stageIndex === 2) ? [
    { id: 'level-1', title: 'LEVEL 1 NORMAL' },
    { id: 'level-2', title: 'LEVEL 2 (WASPADA)' },
    { id: 'level-3', title: 'LEVEL 3 (SIAGA)' },
    { id: 'level-4', title: 'LEVEL 4 (AWAS)' },
  ] : (isVolcano && level === 'awal' && stageIndex === 1) ? [
    { id: 'slot-1', title: 'Tahap 1', position: { top: '27.5%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-2', title: 'Tahap 2', position: { top: '54.1%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-3', title: 'Tahap 3', position: { top: '78.6%', left: '31.2%', width: '25%', height: '24.3%' } },
    { id: 'slot-4', title: 'Tahap 4', position: { top: '78.6%', left: '57.2%', width: '25%', height: '24.3%' } },
  ] : (isVolcano && level === 'awal') ? [
    { id: 'slot-1', title: 'Tahap 1', position: { top: '27.5%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-2', title: 'Tahap 2', position: { top: '54.1%', left: '19.3%', width: '23.3%', height: '27.6%' } },
    { id: 'slot-3', title: 'Tahap 3', position: { top: '78.6%', left: '19.5%', width: '23.3%', height: '24.3%' } },
    { id: 'slot-4', title: 'Tahap 4', position: { top: '78.6%', left: '43.3%', width: '20.0%', height: '24.3%' } },
    { id: 'slot-5', title: 'Tahap 5', position: { top: '78.6%', left: '65.2%', width: '19.4%', height: '24.3%' } },
  ] : isVolcano ? [
    { id: 'magmatik', title: 'Erupsi Magmatik' },
    { id: 'freatik', title: 'Erupsi Freatik' },
    { id: 'freatomagmatik', title: 'Erupsi Freatomagmatik' },
    { id: 'efusif', title: 'Erupsi Efusif' },
  ] : isTsunami ? [
    { id: 'gempa', title: 'Pemicu Gempa' },
    { id: 'longsor-laut', title: 'Pemicu Longsor Laut' },
    { id: 'vulkanik', title: 'Pemicu Vulkanik' },
    { id: 'meteor', title: 'Pemicu Ekstraterestrial' },
  ] : (isLandscapes && level === 'awal' && stageIndex === 1) ? [
    { id: 'top-1', title: 'Slot Kanan Atas', position: { top: '14%', left: '60%', width: '18%', height: '14%' } },
    { id: 'top-2', title: 'Slot Kiri Atas', position: { top: '31%', left: '22%', width: '18%', height: '14%' } },
    { id: 'top-3', title: 'Slot Kanan Tengah', position: { top: '47%', left: '73%', width: '18%', height: '14%' } },
    { id: 'bottom-1', title: 'Slot Kiri Bawah', position: { top: '55%', left: '28%', width: '18%', height: '14%' } },
    { id: 'bottom-2', title: 'Slot Tengah Bawah', position: { top: '58%', left: '54%', width: '18%', height: '14%' } },
  ] : (isLandscapes && level === 'awal') ? [
    { id: 'top-1', title: 'Slot Kanan Atas', position: { top: '11%', left: '62%', width: '18%', height: '14%' } },
    { id: 'top-2', title: 'Slot Kiri Atas', position: { top: '20%', left: '36%', width: '18%', height: '14%' } },
    { id: 'top-3', title: 'Slot Kanan Tengah', position: { top: '35%', left: '76%', width: '18%', height: '14%' } },
    { id: 'bottom-1', title: 'Slot Kiri Bawah', position: { top: '56%', left: '22%', width: '18%', height: '14%' } },
    { id: 'bottom-2', title: 'Slot Tengah Bawah', position: { top: '56%', left: '53%', width: '18%', height: '14%' } },
  ] : (isLandscapes && level === 'atas') ? [
    { id: 'falls', title: 'Falls (Jatuhan)' },
    { id: 'slides', title: 'Slides (Longsoran)' },
    { id: 'flows', title: 'Flows (Aliran)' },
    { id: 'creep', title: 'Creep (Rayapan)' },
  ] : [];

  const initialItems: Item[] = isTsunamiLanjut1 ? [
    { id: 'family-1', content: 'Keluarga', image: '/images/quiz/tsunami/lanjutan/1/family.png', category: 'slot-peak' }
  ] : isVolcanoLanjut1 ? [
    { id: 'vol-1', content: 'Strato', image: '/images/quiz/eruption/lanjut/1/aq.png', category: 'slot-1' },
    { id: 'vol-2', content: 'Kaldera', image: '/images/quiz/eruption/lanjut/1/bq.png', category: 'slot-2' },
    { id: 'vol-3', content: 'Maar', image: '/images/quiz/eruption/lanjut/1/cq.png', category: 'slot-3' },
    { id: 'vol-4', content: 'Kubah', image: '/images/quiz/eruption/lanjut/1/dq.png', category: 'slot-4' },
    { id: 'vol-5', content: 'Perisai', image: '/images/quiz/eruption/lanjut/1/eq.png', category: 'slot-5' },
  ] : (isVolcano && level === 'awal' && stageIndex === 2) ? [
    { id: 'mit-1', content: 'Tetap tenang. Beraktivitas seperti biasa', category: 'level-1' },
    { id: 'mit-2', content: 'Tingkatkan kewaspadaan dan menjaga radius aman', category: 'level-2' },
    { id: 'mit-3', content: 'Mulai bersiap Evakuasi', category: 'level-3' },
    { id: 'mit-4', content: 'Segera evakuasi/mengungsi ke tempat yang lebih aman', category: 'level-4' },
    { id: 'mit-5', content: 'Pergi Melihat Langsung Kawah', category: 'wrong' },
  ] : (isVolcano && level === 'awal' && stageIndex === 1) ? [
    { id: 'vol-1', content: 'Subduksi', image: '/images/quiz/eruption/awal/2/5.png', category: 'slot-1' },
    { id: 'vol-2', content: 'Akumulasi', image: '/images/quiz/eruption/awal/2/2.png', category: 'slot-2' },
    { id: 'vol-3', content: 'Erupsi Awal', image: '/images/quiz/eruption/awal/2/4.png', category: 'slot-3' },
    { id: 'vol-4', content: 'Pertumbuhan', image: '/images/quiz/eruption/awal/2/3.png', category: 'slot-4' },
  ] : (isVolcano && level === 'awal') ? [
    { id: 'vol-1', content: 'Subduksi', image: '/images/quiz/eruption/awal/2/5.png', category: 'slot-1' },
    { id: 'vol-2', content: 'Akumulasi', image: '/images/quiz/eruption/awal/2/2.png', category: 'slot-2' },
    { id: 'vol-3', content: 'Erupsi Awal', image: '/images/quiz/eruption/awal/2/4.png', category: 'slot-3' },
    { id: 'vol-4', content: 'Pertumbuhan', image: '/images/quiz/eruption/awal/2/3.png', category: 'slot-4' },
    { id: 'vol-5', content: 'Aktif', image: '/images/quiz/eruption/awal/2/1.png', category: 'slot-5' },
  ] : isVolcano ? [
    { id: 'item-1', content: 'Melibatkan keluarnya magma segar ke permukaan', category: 'magmatik' },
    { id: 'item-2', content: 'Ledakan akibat interaksi air dengan batuan panas tanpa magma baru', category: 'freatik' },
    { id: 'item-3', content: 'Interaksi langsung antara magma dengan air eksternal', category: 'freatomagmatik' },
    { id: 'item-4', content: 'Magma keluar perlahan tanpa ledakan dahsyat', category: 'efusif' },
  ] : isTsunami ? [
    { id: 'item-1', content: 'Pergeseran vertikal lempeng di dasar samudra', category: 'gempa' },
    { id: 'item-2', content: 'Runtuhan material sedimen di lereng bawah laut', category: 'longsor-laut' },
    { id: 'item-3', content: 'Letusan gunung api di tengah laut atau pulau', category: 'vulkanik' },
    { id: 'item-4', content: 'Jatuhnya benda langit besar ke dalam samudra', category: 'meteor' },
  ] : (isLandscapes && level === 'awal' && stageIndex === 1) ? [
    { id: 'item-1', content: 'Jaring Kawat', image: '/images/quiz/landscape/lanjutan/3/jaring-kawat.png', category: 'penguatan' },
    { id: 'item-2', content: 'Pohon Akar Kuat', image: '/images/quiz/landscape/lanjutan/3/pohon-akar-cabang-akar-kuat.png', category: 'penguatan' },
    { id: 'item-3', content: 'Pohon Akar Lemah', image: '/images/quiz/landscape/lanjutan/3/pohon-akar-serabut-akar-lemah.png', category: 'penguatan' },
    { id: 'item-4', content: 'Drainase Air', image: '/images/quiz/landscape/lanjutan/3/drainase-air.png', category: 'penahan' },
    { id: 'item-5', content: 'Tembok Beton', image: '/images/quiz/landscape/lanjutan/3/tembok-beton.png', category: 'penahan' },
  ] : (isLandscapes && level === 'awal') ? [
    { id: 'tree-1', content: 'Akar Kuat', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-cabang-akar-kuat.png', category: 'pohon' },
    { id: 'tree-2', content: 'Akar Lemah', image: '/images/quiz/landscape/lanjutan/2/pohon-akar-serabut-akar-lemah.png', category: 'pohon' },
    { id: 'tree-3', content: 'Tanaman Perdu', image: '/images/quiz/landscape/lanjutan/2/jaring-kawat.png', category: 'pohon' }, // Using jaring as a placeholder for 3rd tree or as requested
    { id: 'drain-1', content: 'Drainase Air A', image: '/images/quiz/landscape/lanjutan/2/drainase-air.png', category: 'drainase' },
    { id: 'drain-2', content: 'Drainase Air B', image: '/images/quiz/landscape/lanjutan/2/tembok-beton.png', category: 'drainase' }, // Using beton as 2nd drainage placeholder
  ] : (isLandscapes && level === 'atas') ? [
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
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItemForClassification, setSelectedItemForClassification] = useState<Item | null>(null);

  useEffect(() => {
    setMounted(true);
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
    const isLongsorAwal = disasterId === 'longsor' && level === 'awal';
    const isLongsorAtas = disasterId === 'longsor' && level === 'atas';
    setIsMobile(isMobileDevice && !isLongsorAwal && !isLongsorAtas);
  }, [disasterId, level]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const findItem = (id: string) => {
    let item = unassignedItems.find(i => i.id === id);
    if (item) return { item, source: 'unassigned' };
    for (const [catId, items] of Object.entries(assignedItems)) {
      item = (items as Item[]).find(i => i.id === id);
      if (item) return { item, source: catId };
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const found = findItem(event.active.id as string);
    if (found) setActiveItem(found.item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    const itemId = active.id as string;
    const found = findItem(itemId);
    if (!found) return;
    const { item, source } = found;

    const targetCategoryId = over ? (over.id as string) : null;

    if (!targetCategoryId) {
      if (source !== 'unassigned') {
        setAssignedItems(prev => ({
          ...prev,
          [source]: (prev[source] || []).filter(i => i.id !== itemId)
        }));
        setUnassignedItems(prev => {
          if (isCloningMode) return prev; // Do not return clones to unassigned
          if (prev.some(i => i.id === item.id)) return prev;
          return [...prev, item];
        });
      }
      return;
    }

    if (source === targetCategoryId) return;

    const existingItems = assignedItems[targetCategoryId] || [];

    setAssignedItems(prev => {
      const newItem = (isCloningMode && source === 'unassigned')
        ? { ...item, id: `${item.id}-clone-${Date.now()}` }
        : item;

      const next = { ...prev, [targetCategoryId]: [newItem] };
      if (source !== 'unassigned') {
        next[source] = (next[source] || []).filter(i => i.id !== itemId);
      }
      return next;
    });

    setUnassignedItems(prev => {
      let next = prev;
      if (source === 'unassigned' && !isCloningMode) {
        next = next.filter(i => i.id !== itemId);
      }
      if (existingItems.length > 0 && !isCloningMode) {
        const newItems = existingItems.filter(e => !next.some(i => i.id === e.id));
        next = [...next, ...newItems];
      }
      return next;
    });
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = initialItems.length;

    // Special scoring for Longsor Awal: 50 per category group (top = pohon/penguatan, bottom = drainase/penahan)
    if (level === 'awal' && isLandscapes) {
      let topGroupCorrect = 0;
      let bottomGroupCorrect = 0;
      const topCategory = stageIndex === 1 ? 'penguatan' : 'pohon';
      const bottomCategory = stageIndex === 1 ? 'penahan' : 'drainase';
      const topSlotCount = categories.filter(c => c.id.startsWith('top')).length;
      const bottomSlotCount = categories.filter(c => c.id.startsWith('bottom')).length;

      Object.entries(assignedItems).forEach(([catId, items]) => {
        (items as Item[]).forEach(item => {
          if (catId.startsWith('top') && item.category === topCategory) topGroupCorrect++;
          else if (catId.startsWith('bottom') && item.category === bottomCategory) bottomGroupCorrect++;
        });
      });

      const topScore = topSlotCount > 0 ? Math.round((topGroupCorrect / topSlotCount) * 50) : 0;
      const bottomScore = bottomSlotCount > 0 ? Math.round((bottomGroupCorrect / bottomSlotCount) * 50) : 0;
      const score = topScore + bottomScore;
      onComplete(score);
      return;
    }

    // Special scoring for Longsor Lanjutan: 25 per item (4 items = 100 total)
    if (isLongsorLanjut) {
      Object.entries(assignedItems).forEach(([catId, items]) => {
        (items as Item[]).forEach(item => {
          if (item.category === catId) correct++;
        });
      });
      const score = correct * 25;
      onComplete(score);
      return;
    }

    Object.entries(assignedItems).forEach(([catId, items]) => {
      (items as Item[]).forEach(item => {
        if (item.category === catId) correct++;
      });
    });

    // Total score should be based on number of categories (slots) to fill
    const score = isTsunamiLanjut1
      ? (correct > 0 ? 100 : 0)
      : Math.round((correct / categories.length) * 100);
    onComplete(score);
  };

  const isComplete = isTsunamiLanjut1
    ? Object.values(assignedItems).some(items => items.length > 0)
    : Object.values(assignedItems).every(items => items.length > 0);
  const isBoardStyle = isVolcanoLanjut1 || isTsunamiLanjut1 || (((isLandscapes && level === 'awal') || (isVolcano && level === 'awal')) && stageIndex !== 2) || (isLandscapes && level === 'atas');

  return (
    <div className={cn("mx-auto", (isTsunamiLanjut1 || isLongsorLanjut) ? "max-w-7xl space-y-6" : "max-w-7xl space-y-12")}>
      {/* Header */}
      {isTsunamiLanjut1 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-earth-900 tracking-tight">Mitigasi Tsunami — Selamatkan Keluarga!</h2>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-6 py-4 max-w-3xl text-center shadow-sm">
            <p className="text-blue-900 font-bold text-base sm:text-lg leading-relaxed">
              🌊 Tsunami akan menerjang pemukiman! Seret gambar keluarga ke lokasi yang <span className="text-blue-700 font-black underline">paling aman</span> untuk menyelamatkan mereka.
            </p>
            <p className="text-blue-600 text-sm font-semibold mt-2">⚠️ Jawaban benar = 100 poin · Jawaban salah = 0 poin</p>
          </div>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center">
          <h2 className="text-3xl font-black text-earth-900 tracking-tight">
            {isBoardStyle ? "Lengkapi Papan Puzzle" : "Klasifikasi Fenomena"}
          </h2>

          {isLandscapes && level === 'awal' && (stageIndex === 0 || stageIndex === 1) ? (
            <div className="mt-4 space-y-4 max-w-4xl mx-auto w-full px-4">
              <p className="text-earth-600 font-medium italic">
                <span className="font-bold">Instruksi Soal:</span> Tarik dan taruh kepingan pilihan elemen yang telah disediakan ke posisi yang tepat pada papan!
              </p>
              <div className="bg-earth-100/60 backdrop-blur-sm border-2 border-earth-200 p-5 rounded-2xl shadow-sm text-center">
                <p className="text-earth-900 font-bold text-lg md:text-xl leading-relaxed">
                  {stageIndex === 0
                    ? "Kondisi lereng curam di tepi jalan raya dengan pelapukan batuan intensif yang sering hadir genangan air, kombinasi mitigasi bencana apa yang mudah dilakukan olehmu?"
                    : "Kondisi lereng curam di tepi jalan raya dengan jenis batuan yang mengalami pelapukan kuat dan sering terjadi jatuhan batuan (rockfall). Kombinasi Penanggulangan cepat apa yang sebaiknya dilakukan?"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-earth-600 mt-2 font-medium italic max-w-3xl mx-auto">
              {isVolcano && level === 'awal'
                ? (stageIndex === 2
                  ? "Level kesiagaan gunung api di Indonesia dibagi menjadi 4 tingkatan oleh PVMBG, pasangkan tindakan yang cocok dilakukan pada status-status gunung api tertentu dibawah ini."
                  : "Urutkan kepingan puzzle berdasarkan proses terbentuknya gunung api dari awal hingga erupsi.")
                : isBoardStyle
                  ? "Tarik kepingan puzzle ke posisi yang tepat pada papan."
                  : "Klasifikasikan kepingan ke dalam kategori yang sesuai."}
            </p>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className={cn(
          "flex gap-6 items-start w-full",
          isTsunamiLanjut1 ? "flex-col lg:flex-row-reverse" :
          isLongsorLanjut ? "flex-col items-center gap-8" :
          isVolcanoAwalSoal2 ? "flex-col items-center gap-8" :
          isLongsorAwalStages ? "flex-col items-center gap-8" :
          (!isBoardStyle ? "flex-col lg:flex-row" : "flex-col")
        )}>
          {/* Choices Panel */}
          <div className={cn(
            "bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sticky top-8 flex flex-col items-center relative",
            isTsunamiLanjut1
              ? "lg:w-72 w-full p-6 overflow-y-auto max-h-[75vh]"
              : isLongsorLanjut
                ? "w-full max-w-sm sm:max-w-2xl lg:max-w-5xl p-8 overflow-y-auto max-h-[75vh] mx-auto"
                : isVolcanoAwalSoal2
                  ? "w-full max-w-sm sm:max-w-2xl lg:max-w-5xl p-8 overflow-y-auto max-h-[75vh] mx-auto"
                  : isLongsorAwalStages
                    ? "w-full max-w-sm p-8 overflow-y-auto max-h-[75vh] mx-auto"
                    : "lg:w-1/3 w-full p-8 overflow-y-auto max-h-[75vh]"
          )}>
            {/* Glossy highlight effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/30 rounded-full blur-3xl pointer-events-none" />

            {isTsunamiLanjut1 ? (
              /* Compact header for tsunami lanjutan */
              <div className="relative mb-5 text-center w-full">
                <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-2 shadow-sm bg-blue-100 text-blue-600">
                  PILIHAN
                </span>
                <h3 className="text-base font-black text-earth-900 leading-tight">Seret ke Peta</h3>
                <p className="text-[11px] text-earth-500 mt-1 leading-snug">Taruh keluarga ke lokasi yang paling aman</p>
              </div>
            ) : (
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
            )}

            <div
              className={cn(
                "flex justify-center w-full",
                isTsunamiLanjut1
                  ? "flex-col items-center gap-4"
                  : isLongsorLanjut
                    ? "grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6"
                    : isVolcanoAwalSoal2
                      ? "grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6"
                      : isBoardStyle
                        ? "grid grid-cols-2 gap-3 w-full"
                        : "flex-wrap gap-5"
              )}
            >
              {unassignedItems.map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  isVolcano={isVolcano}
                  isTsunami={isTsunami}
                  isLandscapes={isLandscapes}
                  level={level}
                  stageIndex={stageIndex}
                  onClick={(clickedItem) => {
                    if (isMobile) {
                      setSelectedItemForClassification(clickedItem);
                    }
                  }}
                />
              ))}

              {unassignedItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-6"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
                    isVolcano ? "bg-orange-500" : isTsunami ? "bg-blue-500" : "bg-leaf-500"
                  )}>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className={cn("font-bold text-center", isTsunamiLanjut1 ? "text-blue-600 text-sm px-2" : "text-earth-500 px-4")}>
                    {isTsunamiLanjut1 ? "Keluarga sudah dipindahkan! Periksa jawabanmu." : "Hebat! Semua kepingan telah terpasang pada papan."}
                  </p>
                </motion.div>
              )}

              {/* Drag hint for tsunami lanjutan */}
              {isTsunamiLanjut1 && unassignedItems.length > 0 && (
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="mt-3 flex flex-col items-center gap-1 text-center"
                >
                  <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225M13.684 16.6l2.224-2.51M6.37 15.042l5.072-1.358m0 0L9.218 11.17M11.443 13.684l2.225-2.51M3 3l3.659 3.659M21 21l-3.66-3.659" />
                  </svg>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Drag ke peta</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Board Area Wrapper for horizontal scroll on mobile */}
          <div className={cn(
            isTsunamiLanjut1
              ? "flex-1 min-w-0 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-earth-200"
              : isVolcanoAwalSoal2
                ? "w-full max-w-4xl mx-auto overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-earth-200"
                : isLongsorLanjut
                  ? "w-full max-w-4xl mx-auto overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-earth-200"
                  : isBoardStyle ? "w-full lg:w-2/3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-earth-200" : "lg:w-2/3 w-full",
            isLongsorAwalStages && "w-full max-w-3xl mx-auto lg:w-full"
          )}>
            <div className={cn(
              "rounded-3xl shadow-2xl border-4 overflow-hidden relative",
              isBoardStyle
                ? "border-earth-200 bg-earth-50 w-full"
                : "w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-white/40 backdrop-blur-md p-8 border-earth-100",
              (isVolcano && level === 'awal') && "aspect-[1478/1064]",
              (isLandscapes && level === 'awal') && "aspect-[1269/1110]",
              isBoardStyle && !(isVolcano && level === 'awal') && !(isLandscapes && level === 'awal') && "min-h-[420px]"
            )}>
            {isBoardStyle && (
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <img
                  src={isTsunamiLanjut1 ? "/images/quiz/tsunami/lanjutan/1/1.png" : isVolcanoLanjut1 ? "/images/quiz/eruption/lanjut/1/board.png" : isVolcano ? "/images/quiz/eruption/awal/2/board.png" : (isLandscapes && level === 'atas') ? "/images/quiz/landscapes/1.png" : (stageIndex === 1 ? "/images/quiz/landscape/lanjutan/3/2.png" : "/images/quiz/landscape/lanjutan/2/1.png")}
                  alt="Board"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            <div className={cn(
              isBoardStyle ? "absolute inset-0 z-10" : "relative z-10 w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]",
              (isLandscapes && level === 'atas') && "grid grid-cols-4 px-[6%] pb-[6%] pt-[6%] gap-[3%]",
              (isVolcano && level === 'awal' && stageIndex === 2) ? "flex flex-col gap-6 max-w-4xl mx-auto py-10 px-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl mt-4" : (!isVolcanoAwalSoal2 && !(isLandscapes && level === 'atas') && !isBoardStyle && "grid grid-cols-1 md:grid-cols-2 gap-8")
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
                      stageIndex={stageIndex}
                      isMobile={isMobile}
                      onItemClick={(item) => {
                        if (isMobile) {
                          // Reset item by returning it to unassigned
                          setAssignedItems(prev => {
                            const cleaned = { ...prev };
                            Object.keys(cleaned).forEach(key => {
                              cleaned[key] = (cleaned[key] || []).filter(i => i.id !== item.id);
                            });
                            return cleaned;
                          });
                          setUnassignedItems(prev => {
                            if (prev.some(i => i.id === item.id)) return prev;
                            return [...prev, item];
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
      {/* Auto Classification Modal / Bottom Sheet for mobile */}
      <AnimatePresence>
        {selectedItemForClassification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItemForClassification(null)}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 mx-auto cursor-default max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedItemForClassification(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-earth-50 text-earth-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                  Pilih Kategori
                </span>
                <h3 className="text-lg font-black text-slate-800 leading-tight">
                  Klasifikasikan Item
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-2">
                  "{selectedItemForClassification.content}"
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      const itemId = selectedItemForClassification.id;
                      const sourceIsUnassigned = unassignedItems.some(i => i.id === itemId);
                      const targetCatId = category.id;

                      setAssignedItems(prev => {
                        const cleaned = { ...prev };
                        if (!isCloningMode || !sourceIsUnassigned) {
                          Object.keys(cleaned).forEach(key => {
                            cleaned[key] = (cleaned[key] || []).filter(i => i.id !== itemId);
                          });
                        }

                        const newItem = (isCloningMode && sourceIsUnassigned)
                          ? { ...selectedItemForClassification, id: `${itemId}-clone-${Date.now()}` }
                          : selectedItemForClassification;

                        cleaned[targetCatId] = [newItem];
                        return cleaned;
                      });

                      setUnassignedItems(prev => {
                        let next = prev;
                        if (!isCloningMode && sourceIsUnassigned) {
                          next = next.filter(i => i.id !== itemId);
                        }
                        return next;
                      });

                      setSelectedItemForClassification(null);
                    }}
                    className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200/60 hover:border-slate-300 rounded-2xl font-bold text-slate-700 text-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center cursor-pointer"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
