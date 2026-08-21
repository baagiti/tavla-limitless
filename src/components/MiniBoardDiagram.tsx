import React from 'react';
import { BoardState, GameSettings, MoveStep, Player } from '../types/backgammon';
import { getCheckerStyle } from '../utils/themes';

interface MiniBoardDiagramProps {
  board: BoardState;
  steps: MoveStep[];
  highlightColor: string;
  settings: GameSettings;
}

// Board dimensions for the fixed viewBox. Points are simple rectangular
// columns rather than the real board's triangles/wood-grain rendering —
// this is a read-only recap diagram inside a modal, not the game board
// itself, so clarity at small size matters far more than fidelity.
const VB_W = 480;
const VB_H = 190;
const MARGIN = 8;
const BAR_W = 18;
const COL_W = (VB_W - MARGIN * 2 - BAR_W) / 12;
const ROW_H = 78;
const CHECKER_R = 6.5;
const MAX_VISIBLE = 5;

// Point index -> {row, slot 0..11}, matching Board.tsx's quadrant ordering
// so this recap always agrees with what the player saw on the real board.
function pointSlot(index: number, isCCW: boolean): { row: 'top' | 'bottom'; slot: number } {
  const topLeft = isCCW ? [12, 13, 14, 15, 16, 17] : [23, 22, 21, 20, 19, 18];
  const topRight = isCCW ? [18, 19, 20, 21, 22, 23] : [17, 16, 15, 14, 13, 12];
  const bottomLeft = isCCW ? [11, 10, 9, 8, 7, 6] : [0, 1, 2, 3, 4, 5];
  const bottomRight = isCCW ? [5, 4, 3, 2, 1, 0] : [6, 7, 8, 9, 10, 11];
  const top = [...topLeft, ...topRight];
  const bottom = [...bottomLeft, ...bottomRight];
  const topIdx = top.indexOf(index);
  if (topIdx !== -1) return { row: 'top', slot: topIdx };
  return { row: 'bottom', slot: bottom.indexOf(index) };
}

function slotX(slot: number): number {
  const x = MARGIN + slot * COL_W;
  return slot < 6 ? x : x + BAR_W;
}

function pointCenter(index: number, isCCW: boolean): { x: number; y: number; row: 'top' | 'bottom' } {
  const { row, slot } = pointSlot(index, isCCW);
  const x = slotX(slot) + COL_W / 2;
  const y = row === 'top' ? MARGIN + ROW_H / 2 : VB_H - MARGIN - ROW_H / 2;
  return { x, y, row };
}

function barCenter(player: Player): { x: number; y: number } {
  const x = MARGIN + 6 * COL_W + BAR_W / 2;
  return { x, y: player === 'white' ? VB_H - MARGIN - ROW_H / 2 : MARGIN + ROW_H / 2 };
}

function offCenter(player: Player, isCCW: boolean): { x: number; y: number } {
  // The board renders a single shared bear-off tray — on the left when
  // play runs clockwise, on the right when counter-clockwise — holding
  // both colors (black stacked from the top, white from the bottom).
  const x = isCCW ? VB_W - MARGIN / 2 : MARGIN / 2;
  const y = player === 'white' ? VB_H - MARGIN - 14 : MARGIN + 14;
  return { x, y };
}

export const MiniBoardDiagram: React.FC<MiniBoardDiagramProps> = ({
  board,
  steps,
  highlightColor,
  settings,
}) => {
  const isCCW = settings.bearingDirection === 'counterclockwise';
  const whiteDot = getCheckerStyle('white', settings.boardTheme, settings.checkerTheme).dotBg;
  const blackDot = getCheckerStyle('black', settings.boardTheme, settings.checkerTheme).dotBg;
  const dotFor = (p: Player) => (p === 'white' ? whiteDot : blackDot);

  const columns: React.ReactNode[] = [];
  for (let slot = 0; slot < 12; slot++) {
    const x = slotX(slot);
    const shaded = slot % 2 === 1;
    columns.push(
      <rect
        key={`col-top-${slot}`}
        x={x}
        y={MARGIN}
        width={COL_W}
        height={ROW_H}
        fill={shaded ? 'rgba(194,162,120,0.08)' : 'transparent'}
      />
    );
    columns.push(
      <rect
        key={`col-bottom-${slot}`}
        x={x}
        y={VB_H - MARGIN - ROW_H}
        width={COL_W}
        height={ROW_H}
        fill={shaded ? 'rgba(194,162,120,0.08)' : 'transparent'}
      />
    );
  }

  const checkerStacks = board.points.map((pt, index) => {
    if (!pt.color || pt.count === 0) return null;
    const { x, y, row } = pointCenter(index, isCCW);
    const visible = Math.min(pt.count, MAX_VISIBLE);
    const extra = pt.count - visible;
    const dir = row === 'top' ? 1 : -1;
    const edgeY = row === 'top' ? MARGIN + 8 : VB_H - MARGIN - 8;
    return (
      <g key={`stack-${index}`}>
        {Array.from({ length: visible }).map((_, i) => (
          <circle
            key={i}
            cx={x}
            cy={edgeY + dir * i * (CHECKER_R * 1.75)}
            r={CHECKER_R}
            fill={dotFor(pt.color!)}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={0.75}
          />
        ))}
        {extra > 0 && (
          <text
            x={x}
            y={edgeY + dir * (visible - 1) * (CHECKER_R * 1.75)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={7}
            fontWeight={700}
            fill="#140e0a"
          >
            +{extra}
          </text>
        )}
        <text
          x={x}
          y={row === 'top' ? MARGIN + ROW_H - 3 : VB_H - MARGIN - ROW_H + 8}
          textAnchor="middle"
          fontSize={7}
          fill="#a89984"
          opacity={0.7}
        >
          {index + 1}
        </text>
      </g>
    );
  });

  const emptyLabels = board.points.map((pt, index) => {
    if (pt.color && pt.count > 0) return null;
    const { x, row } = pointCenter(index, isCCW);
    return (
      <text
        key={`lbl-${index}`}
        x={x}
        y={row === 'top' ? MARGIN + ROW_H - 3 : VB_H - MARGIN - ROW_H + 8}
        textAnchor="middle"
        fontSize={7}
        fill="#a89984"
        opacity={0.5}
      >
        {index + 1}
      </text>
    );
  });

  const posOf = (side: 'from' | 'to', step: MoveStep): { x: number; y: number } => {
    const ref = side === 'from' ? step.from : step.to;
    if (ref === 'bar') return barCenter(step.player);
    if (ref === 'off') return offCenter(step.player, isCCW);
    return pointCenter(ref, isCCW);
  };

  const arrows = steps.map((step, i) => {
    const from = posOf('from', step);
    const to = posOf('to', step);
    const markerId = `arrowhead-${highlightColor.replace('#', '')}-${i}`;
    return (
      <g key={`arrow-${i}`}>
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={highlightColor} />
          </marker>
        </defs>
        <circle cx={from.x} cy={from.y} r={CHECKER_R + 3} fill="none" stroke={highlightColor} strokeWidth={1.5} opacity={0.9} />
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={highlightColor}
          strokeWidth={1.75}
          opacity={0.85}
          markerEnd={`url(#${markerId})`}
        />
        <circle cx={to.x} cy={to.y} r={CHECKER_R + 3} fill="none" stroke={highlightColor} strokeWidth={1.5} opacity={0.9} />
      </g>
    );
  });

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto select-none" role="img">
      <rect x={0} y={0} width={VB_W} height={VB_H} rx={4} fill="#160f0a" stroke="#2d1e15" />
      <rect
        x={MARGIN + 6 * COL_W}
        y={MARGIN}
        width={BAR_W}
        height={VB_H - MARGIN * 2}
        fill="#0d0906"
      />
      {columns}
      <line x1={MARGIN} y1={VB_H / 2} x2={VB_W - MARGIN} y2={VB_H / 2} stroke="#2d1e15" strokeWidth={1} />
      {checkerStacks}
      {emptyLabels}
      {arrows}
    </svg>
  );
};
