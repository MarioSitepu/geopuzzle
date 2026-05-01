'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
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
    }

    return () => {
      // Cleanup is handled by the ref persisting, but we can pause here if needed
    };
  }, [isPuzzlePage, hasInteracted, isMuted]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

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
