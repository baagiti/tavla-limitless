import React from 'react';
import {
  Player,
  GameSettings,
  ScoreState,
  PipCount,
  DoublingCubeState,
  GamePhase,
} from '../types/backgammon';
import {
  RotateCcw,
  Settings,
  BookOpen,
  Volume2,
  VolumeX,
  Flag,
  Trophy,
  Crown,
  Sparkles,
  Layers,
} from 'lucide-react';
import { getCheckerStyle } from '../utils/themes';

interface HeaderHUDProps {
  settings: GameSettings;
  score: ScoreState;
  pips: PipCount;
  activePlayer: Player;
  phase: GamePhase;
  cube: DoublingCubeState;
  canUndo: boolean;
  onUndo: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onNewGame: () => void;
  onToggleSound: () => void;
  onResign: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  settings,
  score,
  pips,
  activePlayer,
  phase,
  cube,
  canUndo,
  onUndo,
  onOpenSettings,
  onOpenRules,
  onOpenStats,
  onNewGame,
  onToggleSound,
  onResign,
}) => {
  const isAIMode = settings.mode === 'ai';
  const humanPlayer = settings.playerColor;
  const isAITurn = isAIMode && activePlayer !== humanPlayer;
  const isCubeMode = settings.cubeMode === 'with_cube';

  // Calculate Pip difference (positive = White has fewer pips = White is leading)
  // Note: in backgammon, lower pip count is better/ahead
  const pipLeadWhite = pips.black - pips.white; // > 0 means White is ahead in race
  const whiteChecker = getCheckerStyle('white', settings.boardTheme, settings.checkerTheme);
  const blackChecker = getCheckerStyle('black', settings.boardTheme, settings.checkerTheme);

  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3 select-none z-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-4 bg-gradient-to-b from-[#1c140f]/95 to-[#120c08]/95 border border-[#3d2b1f] rounded-lg p-2.5 sm:px-5 sm:py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md">
        
        {/* Left: Brand Identity & Match Stakes */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#c2a278] via-[#a38053] to-[#5a3f25] p-px shadow-[0_0_12px_rgba(194,162,120,0.3)] flex items-center justify-center">
              <div className="w-full h-full bg-[#140e0a] rounded-[5px] flex items-center justify-center text-[#e5c07b]">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f9f3e5] via-[#e5c07b] to-[#c2a278] drop-shadow-sm">
                  BACKGAMMON LIMITLESS
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#c2a278]/70 uppercase">
                <span>{settings.mode === 'ai' ? `VS AI (${settings.aiDifficulty})` : 'Pass & Play'}</span>
                <span className="text-[#4a3528]">•</span>
                <span className={isCubeMode ? 'text-[#e5c07b]' : 'text-[#a89984]'}>
                  {isCubeMode ? 'Doubling Cube' : 'Standard Tavla'}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201610] border border-[#3d2b1f] text-[11px] font-mono">
            <span className="text-[#a89984] text-[9px] uppercase tracking-wider">Hedef:</span>
            <span className="text-[#f9f3e5] font-semibold">
              {settings.stakeType === 'points'
                ? `${settings.matchTarget} Puan`
                : `$${settings.stakePerPoint}/Puan`}
            </span>
          </div>
        </div>

        {/* Center: Live Match Scoreboard & Pip Gauge */}
        <div className="flex items-center gap-3 sm:gap-6 bg-[#160f0a] border border-[#2d1e15] px-4 sm:px-6 py-1.5 rounded-md shadow-inner">
          
          {/* WHITE PLAYER */}
          <div className={`flex items-center gap-2.5 transition-all ${activePlayer === 'white' ? 'opacity-100' : 'opacity-65'}`}>
            <div className="relative">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 shadow-md flex items-center justify-center border transition-all ${
                  activePlayer === 'white' ? 'border-[#e5c07b] ring-2 ring-[#e5c07b]/50 scale-105' : 'border-[#4a3528]'
                }`}
                style={{
                  background: whiteChecker.avatarBg,
                  borderColor: whiteChecker.avatarBorder,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: whiteChecker.dotBg }}
                />
              </div>
              {activePlayer === 'white' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#160f0a] animate-pulse" />
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-[#a89984]">
                <span>{settings.mode === 'ai' && settings.playerColor === 'white' ? `Sen (${whiteChecker.name.split(' ')[0]})` : whiteChecker.name}</span>
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#f9f3e5] leading-none mt-0.5">
                {score.white} <span className="text-[10px] font-normal text-[#a89984]">pts</span>
              </div>
              {settings.showPipCount !== false && (
                <div className="text-[9px] font-mono text-[#c2a278]/80">
                  {pips.white} pip
                </div>
              )}
            </div>
          </div>

          {/* CENTER MATCH STATE & DIFFERENTIAL */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-4 border-x border-[#2d1e15]">
            {isCubeMode ? (
              <div
                title={`Katlama Seviyesi: ${cube.value}x (Sahip: ${cube.owner})`}
                className="px-2 py-0.5 rounded bg-gradient-to-r from-[#2d1e15] to-[#1f1510] border border-[#c2a278]/60 text-[#e5c07b] text-[10px] font-mono font-bold shadow flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#e5c07b]" />
                <span>{cube.value}x Çarpan</span>
              </div>
            ) : (
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#a89984]/80">
                VS
              </div>
            )}

            {/* Turn or State Notice */}
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-[#c2a278] mt-1">
              {phase === 'opening_roll'
                ? 'Açılış Zarı'
                : isAITurn
                ? 'AI Hamlesi'
                : `${activePlayer === 'white' ? whiteChecker.name.split(' ')[0] : blackChecker.name.split(' ')[0]} Sırası`}
            </span>

            {/* Pip Lead Gauge */}
            {settings.showPipCount !== false && pipLeadWhite !== 0 && (
              <span className="text-[8px] font-mono text-[#a89984] -mt-0.5">
                {pipLeadWhite > 0 ? `+${pipLeadWhite} Beyaz önde` : `+${Math.abs(pipLeadWhite)} Siyah önde`}
              </span>
            )}
          </div>

          {/* BLACK PLAYER */}
          <div className={`flex items-center gap-2.5 transition-all ${activePlayer === 'black' ? 'opacity-100' : 'opacity-65'}`}>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[9px] font-mono uppercase tracking-wider text-[#a89984]">
                <span>{settings.mode === 'ai' && settings.playerColor === 'black' ? `Sen (${blackChecker.name.split(' ')[0]})` : settings.mode === 'ai' ? 'Yapay Zeka' : blackChecker.name}</span>
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#f9f3e5] leading-none mt-0.5">
                {score.black} <span className="text-[10px] font-normal text-[#a89984]">pts</span>
              </div>
              {settings.showPipCount !== false && (
                <div className="text-[9px] font-mono text-[#c2a278]/80">
                  {pips.black} pip
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 shadow-md flex items-center justify-center border transition-all ${
                  activePlayer === 'black' ? 'border-[#e5c07b] ring-2 ring-[#e5c07b]/50 scale-105' : 'border-[#4a3528]'
                }`}
                style={{
                  background: blackChecker.avatarBg,
                  borderColor: blackChecker.avatarBorder,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-inner"
                  style={{ backgroundColor: blackChecker.dotBg }}
                />
              </div>
              {activePlayer === 'black' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#160f0a] animate-pulse" />
              )}
            </div>
          </div>

        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo Button */}
          <button
            id="btn-undo-move"
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Hamleyi Geri Al"
            className={`p-2 rounded border transition-all ${
              canUndo
                ? 'border-[#c2a278] text-[#c2a278] bg-[#201610] hover:bg-[#c2a278] hover:text-[#140e0a] cursor-pointer shadow-md'
                : 'border-[#2d1e15] text-[#a89984]/30 bg-[#140e0a]/60 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            className="p-2 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-40" />
            )}
          </button>

          {/* Stats & History */}
          <button
            id="btn-stats-history"
            type="button"
            onClick={onOpenStats}
            title="Kariyer İstatistikleri ve Maç Geçmişi"
            className="p-2 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Rules */}
          <button
            id="btn-rules"
            type="button"
            onClick={onOpenRules}
            title="Tavla Kuralları ve Rehber"
            className="p-2 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Settings */}
          <button
            id="btn-settings"
            type="button"
            onClick={onOpenSettings}
            title="Oyun Ayarları"
            className="p-2 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Resign */}
          <button
            id="btn-resign"
            type="button"
            onClick={onResign}
            title="Mevcut Oyundan Çekil"
            className="p-2 rounded border border-[#2d1e15] text-[#a89984]/60 bg-[#201610] hover:text-rose-400 hover:border-rose-800 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

