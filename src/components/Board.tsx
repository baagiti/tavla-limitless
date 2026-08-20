import React, { useEffect, useRef, useState } from 'react';
import {
  BoardState,
  Player,
  GameSettings,
  DoublingCubeState,
  MoveValidation,
} from '../types/backgammon';
import { Point } from './Point';
import { Bar } from './Bar';
import { BearOffTray } from './BearOffTray';
import { Dice } from './Dice';
import { BOARD_THEMES } from '../utils/themes';

interface BoardProps {
  board: BoardState;
  activePlayer: Player;
  settings: GameSettings;
  dice: number[];
  rolledDice: [number, number] | null;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  selectedSource: number | 'bar' | null;
  validTargets: Map<number | 'off', MoveValidation>;
  onSelectPoint: (index: number) => void;
  onSelectBar: () => void;
  onSelectTarget: (target: number | 'off') => void;
  cube: DoublingCubeState;
  canDouble: boolean;
  onOfferDouble: () => void;
  isOpeningRoll?: boolean;
  openingDice?: { white: number | null; black: number | null };
  openingRoller?: Player | null;
  onOpeningRoll?: (player?: Player) => void;
}

// A real backgammon board is inherently a wide shape. This is the ratio used
// on landscape/tablet screens, where there's width to spare. On a narrow
// portrait phone, fitting that same wide shape by width alone leaves most of
// the available height empty (confirmed: on a 375x812 phone this rendered a
// 359x265 board — centered, with ~166px of dead space above AND below it).
// So the ratio isn't fixed: it's clamped between this and MIN_BOARD_ASPECT_RATIO
// based on the container's own shape, letting the board actually use a tall
// portrait container's height instead of "containing" itself into a letterboxed
// sliver.
const MAX_BOARD_ASPECT_RATIO = 1.38;
const MIN_BOARD_ASPECT_RATIO = 0.62;

export const Board: React.FC<BoardProps> = ({
  board,
  activePlayer,
  settings,
  dice,
  rolledDice,
  isRolling,
  canRoll,
  onRoll,
  selectedSource,
  validTargets,
  onSelectPoint,
  onSelectBar,
  onSelectTarget,
  cube,
  canDouble,
  onOfferDouble,
  isOpeningRoll = false,
  openingDice,
  openingRoller,
  onOpeningRoll,
}) => {
  const currentTheme = BOARD_THEMES[settings.boardTheme || 'warm_oak'] || BOARD_THEMES.warm_oak;
  const isCCW = settings.bearingDirection === 'counterclockwise';

  // Fits the board to whatever space is actually available (phone portrait,
  // phone landscape, tablet — each leaves a very different amount of room),
  // rather than assuming desktop-sized space is always there. A fixed
  // min-height here would force phone-landscape (as little as ~250px tall
  // after the header/footer) to overflow instead of shrinking, since a pure
  // CSS aspect-ratio box sized from width alone doesn't know to give way
  // when height runs out.
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const ratio = Math.min(
        MAX_BOARD_ASPECT_RATIO,
        Math.max(MIN_BOARD_ASPECT_RATIO, width / height)
      );
      let w = width;
      let h = w / ratio;
      if (h > height) {
        h = height;
        w = h * ratio;
      }
      setBoardSize({ width: Math.floor(w), height: Math.floor(h) });
    };
    measure();
    // A couple of WKWebView builds finish their real safe-area/toolbar
    // layout a frame or two after this effect's first paint, so the very
    // first measurement here can be too small; these two rAFs catch that
    // late correction without waiting for an actual resize event.
    requestAnimationFrame(() => requestAnimationFrame(measure));
    // ResizeObserver alone covers real orientation changes and window
    // resizes, but is redundantly backed by these events — cheap insurance
    // against any host WebView that fires a layout change without the
    // observed element's box actually updating in the same tick.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    window.visualViewport?.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, []);

  let topLeftIndices: number[];
  let topRightIndices: number[];
  let bottomLeftIndices: number[];
  let bottomRightIndices: number[];

  if (isCCW) {
    topLeftIndices = [12, 13, 14, 15, 16, 17];
    topRightIndices = [18, 19, 20, 21, 22, 23];
    bottomLeftIndices = [11, 10, 9, 8, 7, 6];
    bottomRightIndices = [5, 4, 3, 2, 1, 0];
  } else {
    topLeftIndices = [23, 22, 21, 20, 19, 18];
    topRightIndices = [17, 16, 15, 14, 13, 12];
    bottomLeftIndices = [0, 1, 2, 3, 4, 5];
    bottomRightIndices = [6, 7, 8, 9, 10, 11];
  }

  const renderQuadrant = (indices: number[], isTop: boolean) => {
    return (
      <div className="flex-1 flex h-full">
        {indices.map((pointIdx) => {
          const ptState = board.points[pointIdx];
          const isValidTarget = validTargets.has(pointIdx);
          const isSelectedSource = selectedSource === pointIdx;
          const displayNumber = pointIdx + 1;
          const isDark = pointIdx % 2 === 1;

          return (
            <Point
              key={pointIdx}
              index={pointIdx}
              displayNumber={displayNumber}
              isTop={isTop}
              isDark={isDark}
              state={ptState}
              isValidTarget={isValidTarget}
              isSelectedSource={isSelectedSource}
              activePlayer={activePlayer}
              onPointClick={() => onSelectTarget(pointIdx)}
              onCheckerClick={() => onSelectPoint(pointIdx)}
              highlightMoves={settings.highlightMoves}
              theme={settings.boardTheme || 'royal_green'}
              checkerTheme={settings.checkerTheme || 'auto'}
            />
          );
        })}
      </div>
    );
  };

  const isBearOffTarget = validTargets.has('off');

  return (
    <div
      ref={containerRef}
      className="w-full h-full max-w-5xl mx-auto px-1 sm:px-3 py-1 select-none flex items-center justify-center min-h-0 min-w-0"
    >
      {/* Board Outer Luxury Frame */}
      <div
        id="backgammon-board"
        className="relative rounded-lg p-1.5 sm:p-2.5 flex shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[10px] sm:border-[14px] transition-[background,border-color,box-shadow] duration-300"
        style={{
          width: boardSize ? `${boardSize.width}px` : '100%',
          height: boardSize ? `${boardSize.height}px` : undefined,
          aspectRatio: boardSize ? undefined : `${MAX_BOARD_ASPECT_RATIO}`,
          visibility: boardSize ? 'visible' : 'hidden',
          background: currentTheme.outerFrame,
          borderColor: currentTheme.outerBorder,
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.85), inset 0 2px 4px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.7)',
        }}
      >
        {/* Brass Corner Braces (Tournament Grade Hardware) */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#e5c07b]/80 pointer-events-none rounded-tl-sm" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#e5c07b]/80 pointer-events-none rounded-tr-sm" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#e5c07b]/80 pointer-events-none rounded-bl-sm" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#e5c07b]/80 pointer-events-none rounded-br-sm" />

        {/* Playfield Interior Container with Inlaid Border */}
        <div
          className="relative w-full h-full flex overflow-hidden rounded-sm border transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.fieldBg,
            borderColor: currentTheme.fieldBorder,
            boxShadow: 'inset 0 0 28px rgba(0,0,0,0.55), inset 0 0 6px rgba(0,0,0,0.3)',
          }}
        >
          {/* If Clockwise, Bear-off tray is on Left */}
          {!isCCW && (
            <BearOffTray
              borneOff={board.borneOff}
              activePlayer={activePlayer}
              isValidTarget={isBearOffTarget}
              onBearOffClick={() => onSelectTarget('off')}
              position="left"
              highlightMoves={settings.highlightMoves}
              theme={settings.boardTheme || 'royal_green'}
              checkerTheme={settings.checkerTheme || 'auto'}
            />
          )}

          {/* Main Board Play Area (Left Quadrant, Bar, Right Quadrant) */}
          <div className="flex-1 flex flex-col h-full relative">
            {/* Top Row (Points anchored at the top) */}
            <div className="flex-1 flex w-full">
              {renderQuadrant(topLeftIndices, true)}
              <div className="w-12 sm:w-16 h-full pointer-events-none opacity-0" />
              {renderQuadrant(topRightIndices, true)}
            </div>

            {/* Middle Dice & Action Viewport */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-3 sm:px-10 pointer-events-none z-30">
              {isOpeningRoll ? (
                <div className="w-full flex justify-center pointer-events-auto">
                  <Dice
                    dice={dice}
                    rolledDice={rolledDice}
                    activePlayer={activePlayer}
                    isRolling={isRolling}
                    canRoll={canRoll}
                    onRoll={onRoll}
                    isOpeningRoll={isOpeningRoll}
                    openingDice={openingDice}
                    openingRoller={openingRoller}
                    onOpeningRoll={onOpeningRoll}
                    gameMode={settings.mode}
                    userColor={settings.playerColor}
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1 flex justify-center pointer-events-auto">
                    {activePlayer === 'white' && (
                      <Dice
                        dice={dice}
                        rolledDice={rolledDice}
                        activePlayer={activePlayer}
                        isRolling={isRolling}
                        canRoll={canRoll}
                        onRoll={onRoll}
                        isOpeningRoll={false}
                      />
                    )}
                  </div>

                  <div className="w-12 sm:w-16" />

                  <div className="flex-1 flex justify-center pointer-events-auto">
                    {activePlayer === 'black' && (
                      <Dice
                        dice={dice}
                        rolledDice={rolledDice}
                        activePlayer={activePlayer}
                        isRolling={isRolling}
                        canRoll={canRoll}
                        onRoll={onRoll}
                        isOpeningRoll={false}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Row (Points anchored at the bottom) */}
            <div className="flex-1 flex w-full">
              {renderQuadrant(bottomLeftIndices, false)}
              <div className="w-12 sm:w-16 h-full pointer-events-none opacity-0" />
              {renderQuadrant(bottomRightIndices, false)}
            </div>

            {/* Center Bar */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-20">
              <Bar
                bar={board.bar}
                activePlayer={activePlayer}
                selectedSource={selectedSource}
                onSelectBar={onSelectBar}
                cube={cube}
                cubeMode={settings.cubeMode}
                canDouble={canDouble}
                onOfferDouble={onOfferDouble}
                theme={settings.boardTheme || 'royal_green'}
                checkerTheme={settings.checkerTheme || 'auto'}
              />
            </div>
          </div>

          {/* If Counter-Clockwise (Standard), Bear-off tray is on Right */}
          {isCCW && (
            <BearOffTray
              borneOff={board.borneOff}
              activePlayer={activePlayer}
              isValidTarget={isBearOffTarget}
              onBearOffClick={() => onSelectTarget('off')}
              position="right"
              highlightMoves={settings.highlightMoves}
              theme={settings.boardTheme || 'royal_green'}
              checkerTheme={settings.checkerTheme || 'auto'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
