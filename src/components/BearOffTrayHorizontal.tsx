import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Player, BoardTheme, CheckerTheme } from '../types/backgammon';
import { BOARD_THEMES, getCheckerStyle, getActiveCheckerPair } from '../utils/themes';

interface BearOffTrayHorizontalProps {
  player: Player;
  count: number;
  isValidTarget: boolean;
  onBearOffClick: () => void;
  highlightMoves: boolean;
  theme?: BoardTheme;
  checkerTheme?: CheckerTheme;
}

// Sits outside the felt frame, in the ambient space above/below the board —
// the vertical side tray this replaces (still used on wide/landscape
// viewports, see Board.tsx's useHorizontalTrays) ate into the one thing a
// narrow phone can least spare: column width. A phone can spare a thin
// horizontal strip in the dead space it already had above and below the
// board far more easily than it can spare a whole tray column's width
// split across 24 points.
export const BearOffTrayHorizontal: React.FC<BearOffTrayHorizontalProps> = ({
  player,
  count,
  isValidTarget,
  onBearOffClick,
  highlightMoves,
  theme = 'royal_green',
  checkerTheme = 'auto',
}) => {
  const { t } = useTranslation();
  const isTarget = isValidTarget && highlightMoves;
  const currentTheme = BOARD_THEMES[theme] || BOARD_THEMES.royal_green;
  const checkerStyle = getCheckerStyle(player, theme, checkerTheme);
  const activePair = getActiveCheckerPair(theme, checkerTheme);
  const name = t(`themes.checker.${activePair.id}.${player}Name`, {
    defaultValue: player === 'white' ? activePair.whiteName : activePair.blackName,
  });

  return (
    <div
      id={`bear-off-tray-${player}`}
      onClick={isTarget ? onBearOffClick : undefined}
      title={isTarget ? t('bearOff.clickToBearOff') : t('bearOff.tray')}
      className={`relative w-full max-w-5xl mx-auto h-8 sm:h-10 rounded-md flex items-center gap-2 px-2 sm:px-3 shrink-0 transition-all duration-300 ${
        isTarget ? 'cursor-pointer ring-1 ring-[#c2a278] bg-[#c2a278]/20' : 'cursor-default'
      }`}
      style={{
        background: currentTheme.trayBg,
        border: `2px solid ${currentTheme.fieldBorder}`,
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)',
      }}
    >
      <span className="text-[9px] sm:text-[10px] font-mono text-[#c2a278] font-bold tracking-wider shrink-0" title={name}>
        {count}/15
      </span>

      <div className="flex-1 flex items-center gap-[3px] overflow-hidden">
        {Array.from({ length: count }).map((_, idx) => (
          <span
            key={idx}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shrink-0"
            style={{
              background: checkerStyle.bg,
              border: checkerStyle.border,
              boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
            }}
          />
        ))}
      </div>

      {isTarget && (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="px-2 py-0.5 rounded-full bg-[#c2a278] text-[#140e0a] font-bold text-[8px] sm:text-[9px] uppercase tracking-widest shrink-0"
        >
          {t('bearOff.label')}
        </motion.div>
      )}
    </div>
  );
};
