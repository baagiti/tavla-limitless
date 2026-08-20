import React from 'react';
import { Settings } from 'lucide-react';

interface HomeScreenProps {
  onNewMatch: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNewMatch, onOpenSettings }) => {
  return (
    <div
      className="app-safe-area h-dvh w-full flex flex-col items-center justify-center px-8 select-none relative"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 35%, rgba(65, 43, 26, 0.45) 0%, rgba(20, 14, 9, 0.95) 75%, #0a0604 100%)',
      }}
    >
      <button
        type="button"
        onClick={onOpenSettings}
        title="Ayarlar"
        className="absolute top-4 right-4 p-2.5 rounded-full border border-[#3d2b1f] text-[#c2a278] bg-[#1c140f]/80 hover:border-[#c2a278] transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div
        className="w-24 h-24 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-[#c2a278]/40"
      >
        <img src="/app-icon.png" alt="Backgammon Limitless" className="w-full h-full object-cover" />
      </div>

      <h1 className="mt-7 text-4xl sm:text-5xl font-serif font-light text-[#f9f3e5] tracking-wide text-center">
        Backgammon
      </h1>
      <p className="mt-1.5 text-xs font-bold tracking-[0.5em] text-[#e5c07b]/90">LIMITLESS</p>

      <button
        type="button"
        onClick={onNewMatch}
        className="mt-14 w-full max-w-xs py-3.5 rounded-lg bg-gradient-to-r from-[#c2a278] via-[#e5c07b] to-[#c2a278] text-[#140e0a] font-semibold tracking-wide shadow-[0_8px_24px_rgba(194,162,120,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
      >
        Yeni Maç
      </button>
    </div>
  );
};
