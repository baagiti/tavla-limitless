import React from 'react';
import { motion } from 'motion/react';
import { PointState, Player, BoardTheme, CheckerTheme } from '../types/backgammon';
import { Checker } from './Checker';
import { BOARD_THEMES } from '../utils/themes';

interface PointProps {
  index: number;
  displayNumber: number;
  isTop: boolean;
  isDark: boolean;
  state: PointState;
  isValidTarget: boolean;
  isSelectedSource: boolean;
  activePlayer: Player;
  onPointClick: (index: number) => void;
  onCheckerClick: (index: number) => void;
  highlightMoves: boolean;
  theme?: BoardTheme;
  checkerTheme?: CheckerTheme;
  checkerSize?: number;
}

export const Point: React.FC<PointProps> = ({
  index,
  displayNumber,
  isTop,
  isDark,
  state,
  isValidTarget,
  isSelectedSource,
  activePlayer,
  onPointClick,
  onCheckerClick,
  highlightMoves,
  theme = 'royal_green',
  checkerTheme = 'auto',
  checkerSize = 36,
}) => {
  const hasFriendlyCheckers = state.count > 0 && state.color === activePlayer;
  const isTarget = isValidTarget && highlightMoves;
  const currentTheme = BOARD_THEMES[theme] || BOARD_THEMES.royal_green;

  const maxVisible = 5;
  const visibleCount = Math.min(state.count, maxVisible);
  const extraCount = state.count > maxVisible ? state.count - maxVisible : 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTarget) {
      onPointClick(index);
    } else if (hasFriendlyCheckers) {
      onCheckerClick(index);
    }
  };

  const darkGrad = currentTheme.pointDarkGradient;
  const lightGrad = currentTheme.pointLightGradient;

  return (
    <div
      id={`point-${index}`}
      onClick={handleClick}
      className={`relative flex-1 min-w-0 h-full flex ${
        isTop ? 'flex-col justify-start' : 'flex-col-reverse justify-start'
      } items-center transition-colors select-none ${
        isTarget
          ? 'bg-[#c2a278]/25 ring-1 ring-[#c2a278]/70 cursor-pointer z-20'
          : hasFriendlyCheckers
          ? 'cursor-pointer hover:bg-white/[0.04]'
          : 'cursor-default'
      }`}
    >
      {/* Triangular Wood Inlay Point */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-0.5">
        <svg
          viewBox="0 0 100 300"
          preserveAspectRatio="none"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        >
          <defs>
            {/* Dark Veneer Point */}
            <linearGradient id={`point-dark-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={darkGrad[0]} />
              <stop offset="35%" stopColor={darkGrad[1]} />
              <stop offset="70%" stopColor={darkGrad[2]} />
              <stop offset="100%" stopColor={darkGrad[3]} />
            </linearGradient>

            {/* Light Veneer Point */}
            <linearGradient id={`point-light-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={lightGrad[0]} />
              <stop offset="35%" stopColor={lightGrad[1]} />
              <stop offset="70%" stopColor={lightGrad[2]} />
              <stop offset="100%" stopColor={lightGrad[3]} />
            </linearGradient>

            {/* Target highlight gradient */}
            <linearGradient id={`point-target-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5c07b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fff8e7" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Subtle Outer Luminous Glow / Highlight Contour */}
          <polygon
            points={isTop ? '0,0 100,0 50,300' : '0,300 100,300 50,0'}
            fill="none"
            stroke={currentTheme.pointGlow}
            strokeWidth="2.2"
            strokeLinejoin="round"
            opacity={0.85}
          />

          {/* Main Point Polygon */}
          <polygon
            points={isTop ? '0,0 100,0 50,300' : '0,300 100,300 50,0'}
            fill={
              isTarget
                ? `url(#point-target-${index})`
                : isDark
                ? `url(#point-dark-${index})`
                : `url(#point-light-${index})`
            }
            stroke={isTarget ? '#e5c07b' : isDark ? currentTheme.pointDarkStroke : currentTheme.pointLightStroke}
            strokeWidth={isTarget ? '2.5' : '1'}
            opacity={isTarget ? 0.95 : 0.95}
          />
        </svg>
      </div>

      {/* Point number indicator */}
      <span
        className={`absolute text-[9px] sm:text-[10px] font-mono font-bold ${
          isTarget ? 'text-[#f9f3e5] drop-shadow' : ''
        } ${isTop ? 'top-1.5' : 'bottom-1.5'} select-none pointer-events-none z-10`}
        style={{
          color: isTarget ? undefined : currentTheme.pointNumberColor,
        }}
      >
        {displayNumber}
      </span>

      {/* Target landing indicator badge / beacon */}
      {isTarget && (
        <div
          className={`absolute inset-x-0 ${
            isTop ? 'bottom-6' : 'top-6'
          } flex flex-col items-center justify-center pointer-events-none z-30`}
        >
          <motion.div
            animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="w-4 h-4 rounded-full bg-[#e5c07b] border-2 border-[#ffffff] shadow-[0_0_15px_rgba(229,192,123,1)] flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#1c140f]" />
          </motion.div>
        </div>
      )}

      {/* Checkers Stack (Completely flush with the wooden frame edge, lined up sequentially without any overlap) */}
      <div
        className={`relative z-20 w-full flex flex-col items-center pointer-events-auto ${
          isTop ? 'justify-start pt-0.5' : 'justify-start pb-0.5 flex-col-reverse'
        }`}
      >
        {state.color && state.count > 0 && (
          <div
            className={`flex flex-col items-center w-full ${
              isTop ? '' : 'flex-col-reverse'
            }`}
          >
            {Array.from({ length: visibleCount }).map((_, stackIdx) => {
              const isStackTop = stackIdx === visibleCount - 1;
              const isSelected = isSelectedSource && isStackTop;
              const isExtraBadgeChecker = isStackTop && extraCount > 0;

              return (
                <div
                  key={stackIdx}
                  className="relative transition-transform cursor-pointer flex items-center justify-center"
                  style={{
                    marginTop: stackIdx > 0 && isTop ? '1.5px' : '0px',
                    marginBottom: stackIdx > 0 && !isTop ? '1.5px' : '0px',
                    zIndex: stackIdx + 1,
                  }}
                  onClick={handleClick}
                >
                  <Checker
                    key={checkerSize}
                    color={state.color!}
                    size={checkerSize}
                    indexInStack={stackIdx}
                    totalInStack={state.count}
                    isSelected={isSelected}
                    isInteractive={isTarget || (hasFriendlyCheckers && isStackTop)}
                    onClick={handleClick}
                    theme={theme}
                    checkerTheme={checkerTheme}
                  />

                  {/* If count > 5, display the total count badge cleanly on the 5th stone */}
                  {isExtraBadgeChecker && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                      <div className="w-6 h-6 rounded-full bg-[#120b08]/90 border border-[#e5c07b] shadow-[0_2px_6px_rgba(0,0,0,0.8)] flex items-center justify-center">
                        <span className="text-[11px] font-mono font-bold text-[#e5c07b] leading-none">
                          {state.count}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
