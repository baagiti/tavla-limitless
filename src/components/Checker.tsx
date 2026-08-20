import React from 'react';
import { motion } from 'motion/react';
import { Player, BoardTheme, CheckerTheme } from '../types/backgammon';
import { getCheckerStyle } from '../utils/themes';

interface CheckerProps {
  color: Player;
  isSelected?: boolean;
  isInteractive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: number;
  indexInStack?: number;
  totalInStack?: number;
  isDragging?: boolean;
  theme?: BoardTheme;
  checkerTheme?: CheckerTheme;
}

export const Checker: React.FC<CheckerProps> = ({
  color,
  isSelected = false,
  isInteractive = false,
  onClick,
  size = 40,
  indexInStack = 0,
  theme = 'royal_green',
  checkerTheme = 'auto',
}) => {
  const styleDef = getCheckerStyle(color, theme, checkerTheme);

  return (
    <motion.div
      id={`checker-${color}-${indexInStack}`}
      onClick={isInteractive ? onClick : undefined}
      whileHover={isInteractive ? { scale: 1.06, y: -2 } : undefined}
      whileTap={isInteractive ? { scale: 0.96 } : undefined}
      className={`relative rounded-full select-none flex items-center justify-center transition-all ${
        isInteractive ? 'cursor-pointer' : 'cursor-default'
      } ${
        isSelected
          ? 'ring-2 ring-[#e5c07b] ring-offset-2 ring-offset-[#0f0a07] shadow-[0_0_15px_rgba(229,192,123,0.85)] z-30'
          : 'shadow-[0_3px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(0,0,0,0.6)]'
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: styleDef.bg,
        border: styleDef.border,
        boxShadow: styleDef.boxShadow,
      }}
    >
      {/* Outer concentric turned groove */}
      <div
        className="absolute inset-[14%] rounded-full pointer-events-none"
        style={{
          border: styleDef.grooveBorder,
          boxShadow: styleDef.grooveShadow,
        }}
      />

      {/* Inner carved concentric disc */}
      <div
        className="absolute inset-[32%] rounded-full pointer-events-none flex items-center justify-center"
        style={{
          background: styleDef.innerBg,
          border: styleDef.innerBorder,
          boxShadow: styleDef.innerShadow,
        }}
      >
        {/* Center lathe point */}
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: styleDef.centerDotBg,
            boxShadow: styleDef.centerDotShadow,
          }}
        />
      </div>

      {/* Surface specular sheen / polish highlight */}
      <div
        className="absolute top-0.5 left-1.5 right-1.5 h-[40%] rounded-t-full pointer-events-none"
        style={{
          background: styleDef.sheenBg,
          opacity: 0.8,
        }}
      />
    </motion.div>
  );
};
