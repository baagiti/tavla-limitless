import {
  BoardState,
  MoveStep,
  Player,
  PipCount,
  MoveValidation,
  TurnSequence,
  WinType,
} from '../types/backgammon';

export function createInitialBoard(): BoardState {
  const points: BoardState['points'] = Array.from({ length: 24 }, () => ({
    count: 0,
    color: null,
  }));

  // Standard Backgammon initial setup:
  // White moves 24 down to 1 (indices 23 -> 0)
  // Black moves 1 up to 24 (indices 0 -> 23)

  // White checkers (15 total):
  points[23] = { count: 2, color: 'white' }; // Point 24
  points[12] = { count: 5, color: 'white' }; // Point 13
  points[7]  = { count: 3, color: 'white' }; // Point 8
  points[5]  = { count: 5, color: 'white' }; // Point 6

  // Black checkers (15 total):
  points[0]  = { count: 2, color: 'black' }; // Point 1
  points[11] = { count: 5, color: 'black' }; // Point 12
  points[16] = { count: 3, color: 'black' }; // Point 17
  points[18] = { count: 5, color: 'black' }; // Point 19

  return {
    points,
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
  };
}

export function cloneBoard(board: BoardState): BoardState {
  return {
    points: board.points.map((p) => ({ ...p })),
    bar: { ...board.bar },
    borneOff: { ...board.borneOff },
  };
}

export function calculatePipCount(board: BoardState): PipCount {
  let white = board.bar.white * 25;
  let black = board.bar.black * 25;

  for (let i = 0; i < 24; i++) {
    const pt = board.points[i];
    if (pt.count > 0 && pt.color) {
      if (pt.color === 'white') {
        // White distance to bear off (point 1 is idx 0 => 1 pip)
        white += pt.count * (i + 1);
      } else {
        // Black distance to bear off (point 24 is idx 23 => 1 pip)
        black += pt.count * (24 - i);
      }
    }
  }

  return { white, black };
}

/**
 * Checks if a player has all remaining checkers in their home board (or already borne off)
 * White home board: indices 0..5
 * Black home board: indices 18..23
 */
export function canBearOff(board: BoardState, player: Player): boolean {
  if (board.bar[player] > 0) return false;

  if (player === 'white') {
    for (let i = 6; i < 24; i++) {
      if (board.points[i].color === 'white' && board.points[i].count > 0) {
        return false;
      }
    }
    return true;
  } else {
    for (let i = 0; i < 18; i++) {
      if (board.points[i].color === 'black' && board.points[i].count > 0) {
        return false;
      }
    }
    return true;
  }
}

export function getHighestOccupiedHomePoint(board: BoardState, player: Player): number {
  if (player === 'white') {
    for (let i = 5; i >= 0; i--) {
      if (board.points[i].color === 'white' && board.points[i].count > 0) {
        return i; // index 0..5
      }
    }
  } else {
    for (let i = 18; i <= 23; i++) {
      if (board.points[i].color === 'black' && board.points[i].count > 0) {
        return i; // index 18..23
      }
    }
  }
  return -1;
}

export function validateSingleMove(
  board: BoardState,
  player: Player,
  from: number | 'bar',
  die: number
): MoveValidation {
  const opponent: Player = player === 'white' ? 'black' : 'white';

  // 1. If player has checkers on bar, they MUST move from bar first
  if (board.bar[player] > 0 && from !== 'bar') {
    return { valid: false, to: 'off', isHit: false, reason: 'Must enter from bar' };
  }

  // 2. Bar re-entry move
  if (from === 'bar') {
    if (board.bar[player] <= 0) {
      return { valid: false, to: 'off', isHit: false, reason: 'No checkers on bar' };
    }

    const targetIdx = player === 'white' ? 24 - die : die - 1;
    const targetPoint = board.points[targetIdx];

    if (targetPoint.color === opponent && targetPoint.count >= 2) {
      return { valid: false, to: targetIdx, isHit: false, reason: 'Point is blocked' };
    }

    const isHit = targetPoint.color === opponent && targetPoint.count === 1;
    return { valid: true, to: targetIdx, isHit };
  }

  // 3. Normal board move
  const sourcePoint = board.points[from];
  if (sourcePoint.color !== player || sourcePoint.count <= 0) {
    return { valid: false, to: 'off', isHit: false, reason: 'No friendly checker at source' };
  }

  const targetIdx = player === 'white' ? from - die : from + die;

  // Bearing off attempt
  if ((player === 'white' && targetIdx < 0) || (player === 'black' && targetIdx > 23)) {
    if (!canBearOff(board, player)) {
      return { valid: false, to: 'off', isHit: false, reason: 'Cannot bear off yet' };
    }

    // Exact bear off
    if (player === 'white' && targetIdx === -1) {
      return { valid: true, to: 'off', isHit: false };
    }
    if (player === 'black' && targetIdx === 24) {
      return { valid: true, to: 'off', isHit: false };
    }

    // Overshoot bear off: only allowed if no checkers on higher points in home board
    const highestPoint = getHighestOccupiedHomePoint(board, player);
    if (highestPoint === from) {
      return { valid: true, to: 'off', isHit: false };
    }

    return { valid: false, to: 'off', isHit: false, reason: 'Must bear off from highest point' };
  }

  // Normal point destination
  const targetPoint = board.points[targetIdx];
  if (targetPoint.color === opponent && targetPoint.count >= 2) {
    return { valid: false, to: targetIdx, isHit: false, reason: 'Point is blocked' };
  }

  const isHit = targetPoint.color === opponent && targetPoint.count === 1;
  return { valid: true, to: targetIdx, isHit };
}

export function applyMove(
  board: BoardState,
  player: Player,
  from: number | 'bar',
  to: number | 'off',
  dieUsed: number
): { nextBoard: BoardState; isHit: boolean } {
  const nextBoard = cloneBoard(board);
  const opponent: Player = player === 'white' ? 'black' : 'white';
  let isHit = false;

  // Remove checker from source
  if (from === 'bar') {
    nextBoard.bar[player]--;
  } else {
    nextBoard.points[from].count--;
    if (nextBoard.points[from].count === 0) {
      nextBoard.points[from].color = null;
    }
  }

  // Place checker at destination
  if (to === 'off') {
    nextBoard.borneOff[player]++;
  } else {
    const targetPoint = nextBoard.points[to];
    if (targetPoint.color === opponent && targetPoint.count === 1) {
      // Hit blot!
      targetPoint.count = 1;
      targetPoint.color = player;
      nextBoard.bar[opponent]++;
      isHit = true;
    } else {
      targetPoint.count++;
      targetPoint.color = player;
    }
  }

  return { nextBoard, isHit };
}

/**
 * Returns all possible single moves for the player given available dice
 */
export function getPossibleMoves(
  board: BoardState,
  player: Player,
  availableDice: number[]
): { from: number | 'bar'; to: number | 'off'; dieUsed: number; isHit: boolean }[] {
  const moves: { from: number | 'bar'; to: number | 'off'; dieUsed: number; isHit: boolean }[] = [];
  const uniqueDice: number[] = Array.from(new Set(availableDice));

  const checkFrom = (from: number | 'bar') => {
    for (const die of uniqueDice) {
      const val = validateSingleMove(board, player, from, die);
      if (val.valid) {
        moves.push({
          from,
          to: val.to,
          dieUsed: die,
          isHit: val.isHit,
        });
      }
    }
  };

  if (board.bar[player] > 0) {
    checkFrom('bar');
    return moves;
  }

  for (let i = 0; i < 24; i++) {
    if (board.points[i].color === player && board.points[i].count > 0) {
      checkFrom(i);
    }
  }

  return moves;
}

export function getAllLegalTurnSequences(
  board: BoardState,
  player: Player,
  dice: number[]
): TurnSequence[] {
  const validSequences: TurnSequence[] = [];

  function search(currentBoard: BoardState, remainingDice: number[], steps: MoveStep[]) {
    const possibleMoves = getPossibleMoves(currentBoard, player, remainingDice);

    if (possibleMoves.length === 0 || remainingDice.length === 0) {
      validSequences.push({ steps: [...steps], finalBoard: currentBoard });
      return;
    }

    let madeAnyMove = false;
    for (const move of possibleMoves) {
      madeAnyMove = true;
      const { nextBoard, isHit } = applyMove(
        currentBoard,
        player,
        move.from,
        move.to,
        move.dieUsed
      );

      // Remove one instance of used die
      const dieIdx = remainingDice.indexOf(move.dieUsed);
      const nextRemaining = [...remainingDice];
      nextRemaining.splice(dieIdx, 1);

      search(nextBoard, nextRemaining, [
        ...steps,
        {
          from: move.from,
          to: move.to,
          dieUsed: move.dieUsed,
          isHit,
          player,
        },
      ]);
    }

    if (!madeAnyMove) {
      validSequences.push({ steps: [...steps], finalBoard: currentBoard });
    }
  }

  search(board, dice, []);

  if (validSequences.length === 0) {
    return [{ steps: [], finalBoard: board }];
  }

  // Filter 1: Keep only sequences with maximum length
  const maxLength = Math.max(...validSequences.map((s) => s.steps.length));
  let filtered = validSequences.filter((s) => s.steps.length === maxLength);

  // Filter 2: If max length is 1 and dice had 2 distinct values, rule says player must play higher die if legal
  if (maxLength === 1 && dice.length === 2 && dice[0] !== dice[1]) {
    const higherDie = Math.max(dice[0], dice[1]);
    const withHigher = filtered.filter((s) => s.steps[0].dieUsed === higherDie);
    if (withHigher.length > 0) {
      filtered = withHigher;
    }
  }

  return filtered;
}

export function checkWin(
  board: BoardState
): { winner: Player | null; type: WinType; points: number } {
  if (board.borneOff.white === 15) {
    const loser: Player = 'black';
    const loserBorneOff = board.borneOff[loser];
    const loserInWinnerHomeOrBar =
      board.bar[loser] > 0 ||
      board.points.slice(0, 6).some((p) => p.color === loser && p.count > 0);

    if (loserBorneOff === 0) {
      if (loserInWinnerHomeOrBar) {
        return { winner: 'white', type: 'backgammon', points: 3 };
      }
      return { winner: 'white', type: 'gammon', points: 2 };
    }
    return { winner: 'white', type: 'single', points: 1 };
  }

  if (board.borneOff.black === 15) {
    const loser: Player = 'white';
    const loserBorneOff = board.borneOff[loser];
    const loserInWinnerHomeOrBar =
      board.bar[loser] > 0 ||
      board.points.slice(18, 24).some((p) => p.color === loser && p.count > 0);

    if (loserBorneOff === 0) {
      if (loserInWinnerHomeOrBar) {
        return { winner: 'black', type: 'backgammon', points: 3 };
      }
      return { winner: 'black', type: 'gammon', points: 2 };
    }
    return { winner: 'black', type: 'single', points: 1 };
  }

  return { winner: null, type: 'single', points: 0 };
}
