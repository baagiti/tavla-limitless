import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Sparkles,
} from 'lucide-react';
import { getCheckerStyle } from '../utils/themes';
import { useIsShortViewport } from '../hooks/useIsShortViewport';

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
  const { t } = useTranslation();
  const isAIMode = settings.mode === 'ai';
  const humanPlayer = settings.playerColor;
  const isAITurn = isAIMode && activePlayer !== humanPlayer;
  const isCubeMode = settings.cubeMode === 'with_cube';
  const isShort = useIsShortViewport();

  // Calculate Pip difference (positive = White has fewer pips = White is leading)
  // Note: in backgammon, lower pip count is better/ahead
  const pipLeadWhite = pips.black - pips.white; // > 0 means White is ahead in race
  const whiteChecker = getCheckerStyle('white', settings.boardTheme, settings.checkerTheme);
  const blackChecker = getCheckerStyle('black', settings.boardTheme, settings.checkerTheme);

  // Landscape phones leave as little as ~380-430px of total height, so a
  // structurally different single-row header replaces the full HUD instead
  // of trying to squeeze the same three-section layout down with padding
  // tweaks — the board needs that vertical space far more than the header
  // needs its avatars, subtitle, or target box.
  if (isShort) {
    const iconBtnClass =
      'p-1 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer';
    return (
      <header className="w-full px-2 pt-1 select-none z-20">
        <div className="flex items-center justify-between gap-2 bg-[#160f0a]/95 border border-[#2d1e15] rounded px-2 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-1.5">
            <img
              src="/app-icon.png"
              alt="Backgammon Limitless"
              className="w-4 h-4 rounded-[3px] object-cover border border-[#c2a278]/40"
            />
            <span
              className="w-2 h-2 rounded-full shadow-inner transition-opacity"
              style={{ backgroundColor: whiteChecker.dotBg, opacity: activePlayer === 'white' ? 1 : 0.3 }}
            />
            <span className="text-xs font-serif font-bold text-[#f9f3e5] leading-none">
              {score.white}–{score.black}
            </span>
            <span
              className="w-2 h-2 rounded-full shadow-inner transition-opacity"
              style={{ backgroundColor: blackChecker.dotBg, opacity: activePlayer === 'black' ? 1 : 0.3 }}
            />
            {isCubeMode && (
              <span className="text-[9px] font-mono font-bold text-[#e5c07b] ml-0.5">
                ×{cube.value}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={onUndo} disabled={!canUndo} title={t('header.undo')} className={`${iconBtnClass} ${!canUndo ? 'opacity-30 cursor-not-allowed' : ''}`}>
              <RotateCcw className="w-3 h-3" />
            </button>
            <button type="button" onClick={onToggleSound} title={t('header.toggleSoundOn')} className={iconBtnClass}>
              {settings.soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3 opacity-40" />}
            </button>
            <button type="button" onClick={onOpenStats} title={t('header.stats')} className={iconBtnClass}>
              <Trophy className="w-3 h-3" />
            </button>
            <button type="button" onClick={onOpenRules} title={t('header.rules')} className={iconBtnClass}>
              <BookOpen className="w-3 h-3" />
            </button>
            <button type="button" onClick={onOpenSettings} title={t('header.settings')} className={iconBtnClass}>
              <Settings className="w-3 h-3" />
            </button>
            <button type="button" onClick={onResign} title={t('header.resign')} className={iconBtnClass}>
              <Flag className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-3 py-1 sm:py-1.5 [@media(max-height:480px)]:py-0.5 select-none z-20">
      <div className="flex flex-col md:flex-row [@media(max-height:480px)]:flex-row items-center justify-between gap-1.5 sm:gap-3 [@media(max-height:480px)]:gap-1.5 bg-gradient-to-b from-[#1c140f]/95 to-[#120c08]/95 border border-[#3d2b1f] rounded-md p-1.5 sm:px-3 sm:py-1.5 [@media(max-height:480px)]:py-1 shadow-[0_6px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">

        {/* Left: Brand Identity & Match Stakes */}
        <div className="flex items-center gap-2.5 w-full md:w-auto [@media(max-height:480px)]:w-auto justify-between md:justify-start [@media(max-height:480px)]:justify-start">
          <div className="flex items-center gap-2">
            <img
              src="/app-icon.png"
              alt="Backgammon Limitless"
              className="w-6 h-6 sm:w-7 sm:h-7 [@media(max-height:480px)]:w-6 [@media(max-height:480px)]:h-6 rounded-[6px] object-cover shadow-[0_0_10px_rgba(194,162,120,0.25)] border border-[#c2a278]/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm [@media(max-height:480px)]:text-xs font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f9f3e5] via-[#e5c07b] to-[#c2a278] drop-shadow-sm">
                  BACKGAMMON LIMITLESS
                </h1>
              </div>
              <div className="[@media(max-height:480px)]:hidden flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#c2a278]/70 uppercase">
                <span>
                  {settings.mode === 'ai'
                    ? t('header.vsAi', { difficulty: settings.aiDifficulty })
                    : t('header.passAndPlay')}
                </span>
                <span className="text-[#4a3528]">•</span>
                <span className={isCubeMode ? 'text-[#e5c07b]' : 'text-[#a89984]'}>
                  {isCubeMode ? t('header.doublingCube') : t('header.standardTavla')}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex [@media(max-height:480px)]:!hidden items-center gap-1.5 px-2 py-0.5 rounded bg-[#201610] border border-[#3d2b1f] text-[10px] font-mono">
            <span className="text-[#a89984] text-[8px] uppercase tracking-wider">{t('header.target')}</span>
            <span className="text-[#f9f3e5] font-semibold">
              {settings.stakeType === 'points'
                ? t('header.targetPoints', { n: settings.matchTarget })
                : t('matchSetup.stakePerPoint') + `: $${settings.stakePerPoint}`}
            </span>
          </div>
        </div>

        {/* Center: Live Match Scoreboard & Pip Gauge */}
        <div className="flex items-center gap-2.5 sm:gap-5 [@media(max-height:480px)]:gap-2 bg-[#160f0a] border border-[#2d1e15] px-3 sm:px-5 [@media(max-height:480px)]:px-2 py-1 [@media(max-height:480px)]:py-0.5 rounded-md shadow-inner">

          {/* WHITE PLAYER */}
          <div className={`flex items-center gap-2.5 transition-all ${activePlayer === 'white' ? 'opacity-100' : 'opacity-65'}`}>
            <div className="relative">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 [@media(max-height:480px)]:w-6 [@media(max-height:480px)]:h-6 rounded-full p-0.5 shadow-md flex items-center justify-center border transition-all ${
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
                <span>
                  {settings.mode === 'ai' && settings.playerColor === 'white'
                    ? t('header.you', { color: t('players.white') })
                    : settings.mode === 'ai'
                    ? t('header.aiPlayer')
                    : t('players.white')}
                </span>
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#f9f3e5] leading-none mt-0.5">
                {score.white} <span className="text-[10px] font-normal text-[#a89984]">pts</span>
              </div>
              {settings.showPipCount !== false && (
                <div className="[@media(max-height:480px)]:hidden text-[9px] font-mono text-[#c2a278]/80">
                  {pips.white} pip
                </div>
              )}
            </div>
          </div>

          {/* CENTER MATCH STATE & DIFFERENTIAL */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-4 border-x border-[#2d1e15]">
            {isCubeMode ? (
              <div
                title={t('doublingCube.label', {
                  value: cube.value,
                  owner: cube.owner === 'neutral' ? t('doublingCube.shared') : t(`players.${cube.owner}`),
                })}
                className="px-2 py-0.5 rounded bg-gradient-to-r from-[#2d1e15] to-[#1f1510] border border-[#c2a278]/60 text-[#e5c07b] text-[10px] font-mono font-bold shadow flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#e5c07b]" />
                <span>{t('header.cubeMultiplier', { value: cube.value })}</span>
              </div>
            ) : (
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#a89984]/80">
                VS
              </div>
            )}

            {/* Turn or State Notice */}
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold text-[#c2a278] mt-1">
              {phase === 'opening_roll'
                ? t('header.openingRoll')
                : isAITurn
                ? t('header.aiTurn')
                : t('header.turnOf', { name: t(`players.${activePlayer}`) })}
            </span>

            {/* Pip Lead Gauge */}
            {settings.showPipCount !== false && pipLeadWhite !== 0 && (
              <span className="[@media(max-height:480px)]:hidden text-[8px] font-mono text-[#a89984] -mt-0.5">
                {pipLeadWhite > 0
                  ? t('header.aheadWhite', { n: pipLeadWhite })
                  : t('header.aheadBlack', { n: Math.abs(pipLeadWhite) })}
              </span>
            )}
          </div>

          {/* BLACK PLAYER */}
          <div className={`flex items-center gap-2.5 transition-all ${activePlayer === 'black' ? 'opacity-100' : 'opacity-65'}`}>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[9px] font-mono uppercase tracking-wider text-[#a89984]">
                <span>
                  {settings.mode === 'ai' && settings.playerColor === 'black'
                    ? t('header.you', { color: t('players.black') })
                    : settings.mode === 'ai'
                    ? t('header.aiPlayer')
                    : t('players.black')}
                </span>
              </div>
              <div className="text-sm sm:text-base font-serif font-bold text-[#f9f3e5] leading-none mt-0.5">
                {score.black} <span className="text-[10px] font-normal text-[#a89984]">pts</span>
              </div>
              {settings.showPipCount !== false && (
                <div className="[@media(max-height:480px)]:hidden text-[9px] font-mono text-[#c2a278]/80">
                  {pips.black} pip
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 [@media(max-height:480px)]:w-6 [@media(max-height:480px)]:h-6 rounded-full p-0.5 shadow-md flex items-center justify-center border transition-all ${
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
        <div className="flex items-center gap-1.5 sm:gap-2 [@media(max-height:480px)]:gap-1">
          {/* Undo Button */}
          <button
            id="btn-undo-move"
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title={t('header.undo')}
            className={`p-2 [@media(max-height:480px)]:p-1 rounded border transition-all ${
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
            title={settings.soundEnabled ? t('header.toggleSoundOn') : t('header.toggleSoundOff')}
            className="p-1.5 [@media(max-height:480px)]:p-1 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
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
            title={t('header.stats')}
            className="p-1.5 [@media(max-height:480px)]:p-1 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Rules */}
          <button
            id="btn-rules"
            type="button"
            onClick={onOpenRules}
            title={t('header.rules')}
            className="p-1.5 [@media(max-height:480px)]:p-1 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Settings */}
          <button
            id="btn-settings"
            type="button"
            onClick={onOpenSettings}
            title={t('header.settings')}
            className="p-1.5 [@media(max-height:480px)]:p-1 rounded border border-[#2d1e15] text-[#c2a278] bg-[#201610] hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Resign */}
          <button
            id="btn-resign"
            type="button"
            onClick={onResign}
            title={t('header.resign')}
            className="p-1.5 [@media(max-height:480px)]:p-1 rounded border border-[#2d1e15] text-[#a89984]/60 bg-[#201610] hover:text-rose-400 hover:border-rose-800 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

