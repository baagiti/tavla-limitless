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
} from 'lucide-react';
import { getCheckerStyle } from '../utils/themes';
import { useIsShortViewport } from '../hooks/useIsShortViewport';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

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
  onToggleSound: () => void;
  onResign: () => void;
}

// The header reads as a small brass-mounted ledger card set on the table
// beside the board — same parchment/brass material as Home, Settings and
// Match Setup — rather than a floating dark casino HUD. The board itself
// stays real wood/felt (Board.tsx, untouched): this card is the "chrome"
// resting next to it, not a re-skin of the playing surface.
const iconBtnBase =
  'rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0';
const iconBtnStyle: React.CSSProperties = {
  border: `1px solid rgba(58,42,24,0.28)`,
  background: 'rgba(58,42,24,0.06)',
  color: INK,
};
const iconBtnStyleDisabled: React.CSSProperties = {
  border: `1px solid rgba(58,42,24,0.14)`,
  background: 'rgba(58,42,24,0.03)',
  color: INK_MUTED,
};

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
  onToggleSound,
  onResign,
}) => {
  const { t } = useTranslation();
  const isCubeMode = settings.cubeMode === 'with_cube';
  const isShort = useIsShortViewport();

  const pipLeadWhite = pips.black - pips.white;
  const whiteChecker = getCheckerStyle('white', settings.boardTheme, settings.checkerTheme);
  const blackChecker = getCheckerStyle('black', settings.boardTheme, settings.checkerTheme);

  const modeLabel =
    settings.mode === 'ai' ? t('header.vsAi', { difficulty: settings.aiDifficulty }) : t('header.passAndPlay');
  const gameLabel = t('footer.game', { n: score.gamesPlayed });

  const actions: { id: string; icon: React.ReactNode; title: string; onClick: () => void; disabled?: boolean }[] = [
    { id: 'btn-undo-move', icon: <RotateCcw />, title: t('header.undo'), onClick: onUndo, disabled: !canUndo },
    {
      id: 'btn-toggle-sound',
      icon: settings.soundEnabled ? <Volume2 /> : <VolumeX className="opacity-50" />,
      title: settings.soundEnabled ? t('header.toggleSoundOn') : t('header.toggleSoundOff'),
      onClick: onToggleSound,
    },
    { id: 'btn-stats-history', icon: <Trophy />, title: t('header.stats'), onClick: onOpenStats },
    { id: 'btn-rules', icon: <BookOpen />, title: t('header.rules'), onClick: onOpenRules },
    { id: 'btn-settings', icon: <Settings />, title: t('header.settings'), onClick: onOpenSettings },
    { id: 'btn-resign', icon: <Flag />, title: t('header.resign'), onClick: onResign },
  ];

  // Landscape phones leave as little as ~380-430px of total height, so this
  // stays a single slim strip — same information, no second row, sized to
  // cost the board as little vertical room as possible.
  if (isShort) {
    return (
      <header className="w-full px-2 pt-1.5 select-none z-20">
        <div
          className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1"
          style={{ ...ledgerCardStyle, boxShadow: '0 8px 20px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(184,147,90,0.45)' }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-opacity"
              style={{ backgroundColor: whiteChecker.dotBg, opacity: activePlayer === 'white' ? 1 : 0.28, boxShadow: `0 0 0 1px ${RULE}` }}
            />
            <span className="text-[13px] tabular-nums shrink-0" style={{ ...serif, fontWeight: 600, color: INK }}>
              {score.white}–{score.black}
            </span>
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-opacity"
              style={{ backgroundColor: blackChecker.dotBg, opacity: activePlayer === 'black' ? 1 : 0.28, boxShadow: `0 0 0 1px ${RULE}` }}
            />
            {isCubeMode && (
              <span className="text-[10px] font-semibold shrink-0" style={{ color: BRASS }}>
                ×{cube.value}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {actions.map((a) => (
              <button
                key={a.id}
                id={a.id}
                type="button"
                onClick={a.onClick}
                disabled={a.disabled}
                title={a.title}
                className={`${iconBtnBase} w-6 h-6 [&_svg]:w-3 [&_svg]:h-3 ${a.disabled ? 'cursor-not-allowed' : ''}`}
                style={a.disabled ? iconBtnStyleDisabled : iconBtnStyle}
              >
                {a.icon}
              </button>
            ))}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-3 pt-1.5 sm:pt-2 select-none z-20">
      <div
        className="rounded-md px-3 py-2 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
        style={{ ...ledgerCardStyle, boxShadow: '0 12px 28px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(184,147,90,0.4)' }}
      >
        {/* Brand + mode, single line, never wraps */}
        <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto shrink-0">
          <img
            src="/app-icon.png"
            alt="Backgammon Limitless"
            className="w-7 h-7 rounded-[6px] object-cover shrink-0"
            style={{ boxShadow: `0 0 0 1px ${RULE}` }}
          />
          <div className="min-w-0">
            <h1
              className="text-[13px] sm:text-sm leading-tight whitespace-nowrap truncate"
              style={{ ...serif, fontWeight: 600, color: INK }}
            >
              {t('footer.appName')}
            </h1>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider whitespace-nowrap truncate" style={{ color: INK_MUTED }}>
              <span className="truncate">{modeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="shrink-0">{gameLabel}</span>
            </div>
          </div>
        </div>

        {/* Scoreboard ledger line */}
        <div
          className="flex items-center gap-2 sm:gap-3 lg:gap-5 px-2 sm:px-3 lg:px-4 py-1 rounded-md w-full sm:w-auto justify-center min-w-0"
          style={{ background: 'rgba(58,42,24,0.06)', border: `1px solid ${RULE}` }}
        >
          <div className={`flex items-center gap-2 transition-opacity ${activePlayer === 'white' ? 'opacity-100' : 'opacity-55'}`}>
            <span
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: whiteChecker.avatarBg,
                boxShadow: activePlayer === 'white' ? `0 0 0 2px #f5eddb, 0 0 0 3px ${BRASS}` : `0 0 0 1px ${RULE}`,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: whiteChecker.dotBg }} />
            </span>
            <div className="text-left leading-none">
              <div className="text-[9px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                {settings.mode === 'ai' && settings.playerColor === 'white'
                  ? t('header.you', { color: t('players.white') })
                  : settings.mode === 'ai'
                  ? t('header.aiPlayer')
                  : t('players.white')}
              </div>
              <div className="text-sm sm:text-base tabular-nums mt-0.5" style={{ ...serif, fontWeight: 600, color: INK }}>
                {score.white}
                {settings.showPipCount !== false && (
                  <span className="text-[9px] font-sans font-normal ml-1.5" style={{ color: BRASS }}>
                    {pips.white}p
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1" style={{ borderLeft: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}` }}>
            {isCubeMode ? (
              <div
                title={t('doublingCube.label', {
                  value: cube.value,
                  owner: cube.owner === 'neutral' ? t('doublingCube.shared') : t(`players.${cube.owner}`),
                })}
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{ background: `linear-gradient(160deg,#cba766,#a3773f)`, color: '#2a1c0e' }}
              >
                {t('header.cubeMultiplier', { value: cube.value })}
              </div>
            ) : (
              <div className="text-[9px] uppercase tracking-widest" style={{ color: INK_MUTED }}>
                {t('header.doublingCube') === settings.cubeMode ? '' : 'VS'}
              </div>
            )}
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold mt-1 whitespace-nowrap" style={{ color: BRASS }}>
              {phase === 'opening_roll'
                ? t('header.openingRoll')
                : settings.mode === 'ai' && activePlayer !== settings.playerColor
                ? t('header.aiTurn')
                : t('header.turnOf', { name: t(`players.${activePlayer}`) })}
            </span>
            {settings.showPipCount !== false && pipLeadWhite !== 0 && (
              <span className="text-[8px] mt-0.5 whitespace-nowrap" style={{ color: INK_MUTED }}>
                {pipLeadWhite > 0
                  ? t('header.aheadWhite', { n: pipLeadWhite })
                  : t('header.aheadBlack', { n: Math.abs(pipLeadWhite) })}
              </span>
            )}
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${activePlayer === 'black' ? 'opacity-100' : 'opacity-55'}`}>
            <div className="text-right leading-none">
              <div className="text-[9px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                {settings.mode === 'ai' && settings.playerColor === 'black'
                  ? t('header.you', { color: t('players.black') })
                  : settings.mode === 'ai'
                  ? t('header.aiPlayer')
                  : t('players.black')}
              </div>
              <div className="text-sm sm:text-base tabular-nums mt-0.5" style={{ ...serif, fontWeight: 600, color: INK }}>
                {settings.showPipCount !== false && (
                  <span className="text-[9px] font-sans font-normal mr-1.5" style={{ color: BRASS }}>
                    {pips.black}p
                  </span>
                )}
                {score.black}
              </div>
            </div>
            <span
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: blackChecker.avatarBg,
                boxShadow: activePlayer === 'black' ? `0 0 0 2px #f5eddb, 0 0 0 3px ${BRASS}` : `0 0 0 1px ${RULE}`,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: blackChecker.dotBg }} />
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 lg:gap-1.5 shrink-0">
          {actions.map((a) => (
            <button
              key={a.id}
              id={a.id}
              type="button"
              onClick={a.onClick}
              disabled={a.disabled}
              title={a.title}
              className={`${iconBtnBase} w-7 h-7 lg:w-8 lg:h-8 [&_svg]:w-3 [&_svg]:h-3 lg:[&_svg]:w-3.5 lg:[&_svg]:h-3.5 ${a.disabled ? 'cursor-not-allowed' : ''}`}
              style={a.disabled ? iconBtnStyleDisabled : iconBtnStyle}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
