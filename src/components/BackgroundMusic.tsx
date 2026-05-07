'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function BackgroundMusic() {
  const pathname = usePathname();
  const { isMuted, toggleMute } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if current path is a puzzle or result page
  const isPuzzlePage = pathname?.includes('/puzzle') || pathname?.includes('/result');

  useEffect(() => {
    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio('/sound/home.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    const audio = audioRef.current;

    if (isPuzzlePage) {
      // Stop home music when entering puzzle page to prevent overlap with quiz music
      audio.pause();
    } else if (hasInteracted && !isMuted) {
      // Play if not on puzzle page and user has interacted
      audio.play().catch(err => console.warn("Global music autoplay blocked:", err));
    } else if (isMuted) {
      audio.pause();
    }

    return () => {
      // Cleanup is handled by the ref persisting, but we can pause here if needed
    };
  }, [isPuzzlePage, hasInteracted, isMuted]);

  useEffect(() => {
    const clickAudio = new Audio('/sound/CLICK BUTTON.mp3');
    clickAudio.volume = 0.4;

    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    const handleClick = () => {
      if (isMuted) return; // Don't play click sound if muted
      // Clone and play to allow rapid multiple clicks
      const sound = clickAudio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(() => {});
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleClick);
    };
  }, [isMuted]);

  if (isPuzzlePage) return null;

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-earth-200 text-earth-600 hover:text-earth-900 transition-all hover:scale-110 active:scale-95"
      title={isMuted ? "Unmute Music" : "Mute Music"}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}
