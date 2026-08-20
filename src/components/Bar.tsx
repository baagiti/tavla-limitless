import React from 'react';
import { useTranslation } from 'react-i18next';
import { Player, DoublingCubeState, CubeMode, BoardTheme, CheckerTheme } from '../types/backgammon';
import { Checker } from './Checker';
import { DoublingCube } from './DoublingCube';
import { BOARD_THEMES } from '../utils/themes';

interface BarProps {
  bar: { white: number; black: number };
  activePlayer: Player;
  selectedSource: number | 'bar' | null;
  onSelectBar: () => void;
  cube: DoublingCubeState;
  cubeMode?: CubeMode;
  canDouble: boolean;
  onOfferDouble: () => void;
  theme?: BoardTheme;
  checkerTheme?: CheckerTheme;
}

export const Bar: React.FC<BarProps> = ({
  bar,
  activePlayer,
  selectedSource,
  onSelectBar,
  cube,
  cubeMode = 'with_cube',
  canDouble,
  onOfferDouble,
  theme = 'royal_green',
  checkerTheme = 'auto',
}) => {
  const { t } = useTranslation();
  const isSelected = selectedSource === 'bar';
  const hasMyCheckers = bar[activePlayer] > 0;
  const isCubeActive = cubeMode === 'with_cube';
  const currentTheme = BOARD_THEMES[theme] || BOARD_THEMES.royal_green;

  return (
    <div
      id="board-bar"
      className="relative w-12 sm:w-16 h-full flex flex-col items-center justify-between py-2.5 select-none transition-colors duration-300"
      style={{
        background: currentTheme.barBg,
        borderLeft: `2px solid ${currentTheme.barBorder}`,
        borderRight: `2px solid ${currentTheme.barBorder}`,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top Brass Hinge / Inlay */}
      <div className="flex flex-col items-center gap-0.5 opacity-80">
        <div className="w-7 h-1.5 rounded-sm bg-gradient-to-r from-[#9c7a4b] via-[#e5c07b] to-[#9c7a4b] border border-[#5a3f2c] shadow" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#1c130d] border border-[#9c7a4b]" />
      </div>

      {/* Top Bar Checkers (Black captured checkers) */}
      <div className="flex flex-col items-center gap-1 min-h-[75px]">
        {bar.black > 0 && (
          <div className="flex flex-col items-center relative gap-1">
            {Array.from({ length: Math.min(bar.black, 3) }).map((_, idx) => (
              <div key={idx} className="z-10">
                <Checker
                  color="black"
                  size={34}
                  isSelected={isSelected && activePlayer === 'black'}
                  isInteractive={activePlayer === 'black'}
                  onClick={onSelectBar}
                  theme={theme}
                  checkerTheme={checkerTheme}
                />
              </div>
            ))}
            {bar.black > 3 && (
              <div className="bg-[#1c130d] text-[#f9f3e5] font-mono font-bold text-[9px] px-2 py-0.5 rounded border border-[#e5c07b]/70 mt-0.5 shadow-md">
                +{bar.black - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Section: Doubling Cube OR Luxury Tournament Medallion */}
      <div className="flex flex-col items-center justify-center my-auto py-2 z-20">
        {isCubeActive ? (
          <DoublingCube
            cube={cube}
            activePlayer={activePlayer}
            canDouble={canDouble}
            onOfferDouble={onOfferDouble}
          />
        ) : (
          /* Handcrafted Brass Tournament Medallion (Clean, no 64, no cube text) */
          <div
            title={t('bar.medallionTitle')}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#3d2b1f] via-[#201610] to-[#120b08] border-2 border-[#8b6b47] flex items-center justify-center shadow-lg relative group"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#e5c07b]/40 flex items-center justify-center">
              {/* Star Inlay */}
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 border border-[#e5c07b]/80 bg-[#4a3528]/60 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#f3e5ab]" />
              </div>
            </div>
          </div>
        )}

        {hasMyCheckers && (
          <span className="text-[8px] uppercase tracking-widest text-[#e5c07b] font-bold mt-1.5 text-center animate-pulse drop-shadow">
            {t('bar.onBar')}
          </span>
        )}
      </div>

      {/* Bottom Bar Checkers (White captured checkers) */}
      <div className="flex flex-col-reverse items-center gap-1 min-h-[75px]">
        {bar.white > 0 && (
          <div className="flex flex-col-reverse items-center relative gap-1">
            {Array.from({ length: Math.min(bar.white, 3) }).map((_, idx) => (
              <div key={idx} className="z-10">
                <Checker
                  color="white"
                  size={34}
                  isSelected={isSelected && activePlayer === 'white'}
                  isInteractive={activePlayer === 'white'}
                  onClick={onSelectBar}
                  theme={theme}
                  checkerTheme={checkerTheme}
                />
              </div>
            ))}
            {bar.white > 3 && (
              <div className="bg-[#1c130d] text-[#f9f3e5] font-mono font-bold text-[9px] px-2 py-0.5 rounded border border-[#e5c07b]/70 mb-0.5 shadow-md">
                +{bar.white - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Brass Hinge / Inlay */}
      <div className="flex flex-col items-center gap-0.5 opacity-80">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1c130d] border border-[#9c7a4b]" />
        <div className="w-7 h-1.5 rounded-sm bg-gradient-to-r from-[#9c7a4b] via-[#e5c07b] to-[#9c7a4b] border border-[#5a3f2c] shadow" />
      </div>
    </div>
  );
};

