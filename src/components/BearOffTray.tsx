import React from 'react';
import { motion } from 'motion/react';
import { Player, BoardTheme, CheckerTheme } from '../types/backgammon';
import { BOARD_THEMES, getCheckerStyle } from '../utils/themes';

interface BearOffTrayProps {
  borneOff: { white: number; black: number };
  activePlayer: Player;
  isValidTarget: boolean;
  onBearOffClick: () => void;
  position: 'left' | 'right';
  highlightMoves: boolean;
  theme?: BoardTheme;
  checkerTheme?: CheckerTheme;
}

export const BearOffTray: React.FC<BearOffTrayProps> = ({
  borneOff,
  activePlayer,
  isValidTarget,
  onBearOffClick,
  position,
  highlightMoves,
  theme = 'royal_green',
  checkerTheme = 'auto',
}) => {
  const isTarget = isValidTarget && highlightMoves;
  const currentTheme = BOARD_THEMES[theme] || BOARD_THEMES.royal_green;
  const whiteStyle = getCheckerStyle('white', theme, checkerTheme);
  const blackStyle = getCheckerStyle('black', theme, checkerTheme);

  return (
    <div
      id={`bear-off-tray-${position}`}
      onClick={isTarget ? onBearOffClick : undefined}
      className={`relative w-12 sm:w-16 h-full flex flex-col justify-between py-2 px-1 select-none transition-all duration-300 ${
        isTarget
          ? 'cursor-pointer ring-1 ring-[#c2a278] bg-[#c2a278]/20'
          : 'cursor-default'
      }`}
      style={{
        background: currentTheme.trayBg,
        borderLeft: position === 'right' ? `2px solid ${currentTheme.fieldBorder}` : 'none',
        borderRight: position === 'left' ? `2px solid ${currentTheme.fieldBorder}` : 'none',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7)',
      }}
      title={isTarget ? 'Click here to Bear Off checker' : 'Bear-off Tray'}
    >
      {/* Black Bear-Off Top Slot */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-[10px] font-mono text-[#e0d5c1]/60 uppercase tracking-wider flex items-center justify-between w-full px-1">
          <span className="truncate max-w-[36px]">{blackStyle.name.split(' ')[0]}</span>
          <span className="text-[#c2a278] font-bold">{borneOff.black}/15</span>
        </div>

        {/* Stacked borne off chips */}
        <div className="w-full flex flex-col-reverse gap-0.5 mt-1 max-h-[140px] overflow-hidden p-0.5">
          {Array.from({ length: Math.min(borneOff.black, 15) }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-2 rounded-sm"
              style={{
                background: blackStyle.bg,
                border: blackStyle.border,
                boxShadow: '0 1px 2px rgba(0,0,0,0.7)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Target indicator banner if active bearing off */}
      {isTarget && (
        <motion.div
          animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="my-auto py-2 px-1 rounded-sm bg-[#c2a278] text-[#140e0a] font-bold text-[9px] text-center uppercase tracking-widest shadow-md border border-[#f9f3e5]"
        >
          Bear Off
        </motion.div>
      )}

      {/* White Bear-Off Bottom Slot */}
      <div className="flex flex-col items-center gap-0.5">
        {/* Stacked borne off chips */}
        <div className="w-full flex flex-col gap-0.5 mb-1 max-h-[140px] overflow-hidden p-0.5">
          {Array.from({ length: Math.min(borneOff.white, 15) }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-2 rounded-sm"
              style={{
                background: whiteStyle.bg,
                border: whiteStyle.border,
                boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </div>

        <div className="text-[10px] font-mono text-[#e0d5c1]/60 uppercase tracking-wider flex items-center justify-between w-full px-1">
          <span className="truncate max-w-[36px]">{whiteStyle.name.split(' ')[0]}</span>
          <span className="text-[#c2a278] font-bold">{borneOff.white}/15</span>
        </div>
      </div>
    </div>
  );
};

