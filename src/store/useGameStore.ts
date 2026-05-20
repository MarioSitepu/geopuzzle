import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  unlockedRegions: string[];
  unlockedDisasters: Record<string, string[]>; // regionId -> disasterIds
  scores: Record<string, number>; // puzzleId -> score
  playerName: string | null;
  setPlayerName: (name: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
  unlockRegion: (regionId: string) => void;
  unlockDisaster: (regionId: string, disasterId: string) => void;
  setScore: (puzzleId: string, score: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      unlockedRegions: ['kalianda', 'panjang', 'rajabasa'], // Default unlocked
      unlockedDisasters: {
        'kalianda': ['tsunami'],
        'panjang': ['longsor'],
        'rajabasa': ['gunung-api'],
      },
      scores: {},
      playerName: null,
      setPlayerName: (name) => set({ playerName: name }),
      isMuted: false,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      unlockRegion: (regionId) =>
        set((state) => ({
          unlockedRegions: state.unlockedRegions.includes(regionId)
            ? state.unlockedRegions
            : [...state.unlockedRegions, regionId],
        })),
      unlockDisaster: (regionId, disasterId) =>
        set((state) => {
          const regionDisasters = state.unlockedDisasters[regionId] || [];
          if (regionDisasters.includes(disasterId)) return state;
          return {
            unlockedDisasters: {
              ...state.unlockedDisasters,
              [regionId]: [...regionDisasters, disasterId],
            },
          };
        }),
      setScore: (puzzleId, score) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [puzzleId]: Math.max(state.scores[puzzleId] || 0, score),
          },
        })),
    }),
    {
      name: 'geologicalpuzzle-storage-v4',
    }
  )
);
