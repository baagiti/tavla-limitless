import { BoardState, Player, AIDifficulty, TurnSequence } from '../types/backgammon';
import {
  calculatePipCount,
  getAllLegalTurnSequences,
  canBearOff,
} from './rules';

// Precomputed probability table of being hit from N pips away by a single checker (out of 36 combinations)
const SHOT_PROBABILITIES: { [distance: number]: number } = {
  1: 11 / 36, // direct
  2: 12 / 36, // direct
  3: 14 / 36, // direct
  4: 15 / 36, // direct
  5: 15 / 36, // direct
  6: 17 / 36, // direct
  7: 6 / 36,  // combination (6-1, 5-2, 4-3)
  8: 6 / 36,  // combination (6-2, 5-3, 4-4, 2-2)
  9: 5 / 36,  // combination (6-3, 5-4, 3-3)
  10: 3 / 36, // combination (6-4, 5-5)
  11: 2 / 36, // combination (6-5)
  12: 3 / 36, // combination (6-6, 4-4, 3-3)
};

/**
 * Anticipates opponent return shots by simulating potential hit rolls
 */
function calculateAnticipatedOpponentHitRisk(board: BoardState, player: Player): number {
  const opponent: Player = player === 'white' ? 'black' : 'white';
  let totalExposurePenalty = 0;

  for (let i = 0; i < 24; i++) {
    const pt = board.points[i];
    if (pt.count === 1 && pt.color === player) {
      let blotHitChance = 0;

      // 1. Threat from opponent bar
      if (board.bar[opponent] > 0) {
        const distFromBar = opponent === 'white' ? i + 1 : 24 - i;
        if (distFromBar >= 1 && distFromBar <= 6) {
          blotHitChance = Math.max(blotHitChance, SHOT_PROBABILITIES[distFromBar] || 0.35);
        }
      }

      // 2. Threat from opponent checkers on board
      for (let j = 0; j < 24; j++) {
        const oppPt = board.points[j];
        if (oppPt.color === opponent && oppPt.count > 0) {
          const dist = opponent === 'white' ? i - j : j - i;
          if (dist > 0 && dist <= 12) {
            const prob = SHOT_PROBABILITIES[dist] || 0;
            blotHitChance = Math.max(blotHitChance, prob);
          }
        }
      }

      // Deeper loss in inner/outer board
      const severity = player === 'white' ? 24 - i : i + 1;
      totalExposurePenalty += blotHitChance * severity * 2.2;
    }
  }

  return totalExposurePenalty;
}

/**
 * Calculates positional equity for a given player on a board
 */
export function evaluateBoard(board: BoardState, player: Player, difficulty: AIDifficulty): number {
  const normalizedDiff: 'easy' | 'medium' | 'hard' =
    difficulty === 'master' || difficulty === 'hard'
      ? 'hard'
      : difficulty === 'medium'
      ? 'medium'
      : 'easy';

  const opponent: Player = player === 'white' ? 'black' : 'white';

  // 1. Borne off checkers (ultimate objective)
  const myBorne = board.borneOff[player];
  const oppBorne = board.borneOff[opponent];
  if (myBorne === 15) return 2000;
  if (oppBorne === 15) return -2000;

  let score = (myBorne - oppBorne) * 30;

  // 2. Pip count racing advantage
  const pip = calculatePipCount(board);
  const pipDiff = player === 'white' ? pip.black - pip.white : pip.white - pip.black;
  score += pipDiff * 1.6;

  // 3. Bar penalties & rewards
  const myBar = board.bar[player];
  const oppBar = board.bar[opponent];
  score -= myBar * 48;
  score += oppBar * 42;

  // 4. Prime formations & Made points
  let myConsecutivePoints = 0;
  let maxMyPrime = 0;
  let oppConsecutivePoints = 0;
  let maxOppPrime = 0;

  let myHomePointsMade = 0;
  let oppHomePointsMade = 0;

  for (let i = 0; i < 24; i++) {
    const pt = board.points[i];
    const isMyHome = player === 'white' ? i <= 5 : i >= 18;
    const isOppHome = opponent === 'white' ? i <= 5 : i >= 18;

    if (pt.count >= 2) {
      if (pt.color === player) {
        myConsecutivePoints++;
        if (myConsecutivePoints > maxMyPrime) maxMyPrime = myConsecutivePoints;
        oppConsecutivePoints = 0;

        if (isMyHome) {
          myHomePointsMade++;
          score += 16;
          // Golden Points: 5-point (White idx 4, Black idx 19)
          if ((player === 'white' && i === 4) || (player === 'black' && i === 19)) {
            score += 24;
          }
          // 4-point (White idx 3, Black idx 20)
          if ((player === 'white' && i === 3) || (player === 'black' && i === 20)) {
            score += 16;
          }
          // Bar Point: 7-point (White idx 6, Black idx 17)
          if ((player === 'white' && i === 6) || (player === 'black' && i === 17)) {
            score += 18;
          }
        }
      } else if (pt.color === opponent) {
        oppConsecutivePoints++;
        if (oppConsecutivePoints > maxOppPrime) maxOppPrime = oppConsecutivePoints;
        myConsecutivePoints = 0;

        if (isOppHome) {
          oppHomePointsMade++;
          score -= 16;
        }
      }
    } else {
      myConsecutivePoints = 0;
      oppConsecutivePoints = 0;
    }
  }

  // Prime power (4, 5, 6-prime creates impenetrable wall)
  if (maxMyPrime >= 4) score += Math.pow(maxMyPrime - 2, 2) * 18;
  if (maxOppPrime >= 4) score -= Math.pow(maxOppPrime - 2, 2) * 18;

  // Blitz bonus: if opponent has checkers on bar and AI has strong home board
  if (oppBar > 0 && myHomePointsMade >= 3) {
    score += myHomePointsMade * 15 * oppBar;
  }

  // 5. Blot Risk & Anticipated Opponent Moves
  if (normalizedDiff === 'hard') {
    // Advanced tactical anticipation
    const hitRisk = calculateAnticipatedOpponentHitRisk(board, player);
    score -= hitRisk * 1.5;

    const oppHitRisk = calculateAnticipatedOpponentHitRisk(board, opponent);
    score += oppHitRisk * 1.2;
  } else if (normalizedDiff === 'medium') {
    // Standard blot counting
    let myBlots = 0;
    let oppBlots = 0;
    for (let i = 0; i < 24; i++) {
      const pt = board.points[i];
      if (pt.count === 1) {
        if (pt.color === player) myBlots++;
        else if (pt.color === opponent) oppBlots++;
      }
    }
    score -= myBlots * 18;
    score += oppBlots * 14;
  } else {
    // Easy: Very low penalty for leaving blots, making it beginner-friendly/suboptimal
    let myBlots = 0;
    for (let i = 0; i < 24; i++) {
      if (board.points[i].count === 1 && board.points[i].color === player) {
        myBlots++;
      }
    }
    score -= myBlots * 4;
  }

  // 6. Anchors in Opponent Home Board (Holding defensive outposts)
  if (player === 'white') {
    for (let i = 18; i < 24; i++) {
      if (board.points[i].color === 'white' && board.points[i].count >= 2) {
        score += 20; // Anchor
        if (i === 19) score += 10; // Advanced 20-point anchor
      }
    }
  } else {
    for (let i = 0; i < 6; i++) {
      if (board.points[i].color === 'black' && board.points[i].count >= 2) {
        score += 20;
        if (i === 4) score += 10; // Advanced anchor
      }
    }
  }

  // 7. Bearing Off Phase
  if (canBearOff(board, player)) {
    score += 50;
    // Reward smooth distribution on home points
    if (normalizedDiff === 'hard') {
      const homeIndices = player === 'white' ? [0, 1, 2, 3, 4, 5] : [18, 19, 20, 21, 22, 23];
      const emptyHome = homeIndices.filter((idx) => board.points[idx].count === 0).length;
      score -= emptyHome * 8;
    }
  }
  if (canBearOff(board, opponent)) {
    score -= 50;
  }

  return score;
}

// Every distinct dice-roll outcome (21 combinations), weighted by how many of
// the 36 physical two-die rolls produce it (doubles: 1/36, others: 2/36).
const ALL_ROLLS: { dice: number[]; weight: number }[] = (() => {
  const rolls: { dice: number[]; weight: number }[] = [];
  for (let a = 1; a <= 6; a++) {
    for (let b = a; b <= 6; b++) {
      rolls.push({ dice: a === b ? [a, a, a, a] : [a, b], weight: a === b ? 1 : 2 });
    }
  }
  return rolls;
})();

/**
 * 2-ply equity: from a resulting board, averages over every possible
 * opponent dice roll (weighted by probability), assuming the opponent
 * replies with their own best move. This is what actually gives a move
 * "lookahead" instead of just judging how the board looks immediately
 * after playing it.
 */
function evaluateTwoPly(board: BoardState, player: Player): number {
  const opponent: Player = player === 'white' ? 'black' : 'white';
  let weightedTotal = 0;

  for (const { dice, weight } of ALL_ROLLS) {
    const oppSequences = getAllLegalTurnSequences(board, opponent, dice);

    let bestOppFinalBoard = oppSequences[0]?.finalBoard ?? board;
    let bestOppScore = -Infinity;
    for (const seq of oppSequences) {
      const oppScore = evaluateBoard(seq.finalBoard, opponent, 'hard');
      if (oppScore > bestOppScore) {
        bestOppScore = oppScore;
        bestOppFinalBoard = seq.finalBoard;
      }
    }

    weightedTotal += evaluateBoard(bestOppFinalBoard, player, 'hard') * weight;
  }

  return weightedTotal / 36;
}

/**
 * Selects the optimal turn sequence for AI based on difficulty level
 */
export function chooseBestTurn(
  board: BoardState,
  player: Player,
  dice: number[],
  difficulty: AIDifficulty
): TurnSequence | null {
  const sequences = getAllLegalTurnSequences(board, player, dice);

  if (sequences.length === 0) return null;
  if (sequences.length === 1) return sequences[0];

  const normalizedDiff: 'easy' | 'medium' | 'hard' =
    difficulty === 'master' || difficulty === 'hard'
      ? 'hard'
      : difficulty === 'medium'
      ? 'medium'
      : 'easy';

  // 1. Easy AI: Makes basic, often suboptimal moves
  if (normalizedDiff === 'easy') {
    const rand = Math.random();
    // 35% chance to pick a completely random legal sequence
    if (rand < 0.35) {
      const randomIdx = Math.floor(Math.random() * sequences.length);
      return sequences[randomIdx];
    }
    // 35% chance to pick a naive greedy sequence (advancing furthest checkers regardless of safety)
    if (rand < 0.7) {
      let maxPipsMoved = -1;
      let greedySeq = sequences[0];
      for (const seq of sequences) {
        let pipsMoved = 0;
        for (const step of seq.steps) {
          pipsMoved += step.dieUsed;
        }
        if (pipsMoved > maxPipsMoved) {
          maxPipsMoved = pipsMoved;
          greedySeq = seq;
        }
      }
      return greedySeq;
    }
    // Otherwise picks with huge random noise
    let bestSeq = sequences[0];
    let bestScore = -Infinity;
    for (const seq of sequences) {
      const score = evaluateBoard(seq.finalBoard, player, 'easy') + (Math.random() - 0.5) * 80;
      if (score > bestScore) {
        bestScore = score;
        bestSeq = seq;
      }
    }
    return bestSeq;
  }

  // 2. Medium AI: Solid reasonable strategy with minor noise
  if (normalizedDiff === 'medium') {
    let bestSeq = sequences[0];
    let bestScore = -Infinity;
    for (const seq of sequences) {
      const score = evaluateBoard(seq.finalBoard, player, 'medium') + (Math.random() - 0.5) * 12;
      if (score > bestScore) {
        bestScore = score;
        bestSeq = seq;
      }
    }
    return bestSeq;
  }

  // 3. Hard / Master AI: 2-ply lookahead. Evaluating every legal first move
  // against all 21 opponent dice rolls would be too slow (each expansion re-runs
  // full move generation 21 times), so first rank every legal move with the
  // cheap 0-ply heuristic, then only deepen the top candidates. Master deepens
  // more candidates than Hard — that width is what actually separates the two
  // tiers now, both share the same evaluation function.
  const rankedByZeroPly = sequences
    .map((seq) => ({ seq, zeroPlyScore: evaluateBoard(seq.finalBoard, player, 'hard') }))
    .sort((a, b) => b.zeroPlyScore - a.zeroPlyScore);

  // Both tiers deepen a bounded number of candidates — unbounded 2-ply search
  // was tested and can blow past several seconds on chaotic, blot-heavy
  // positions with doubles (each extra candidate re-runs full move generation
  // 21 times for the opponent's replies). Master deepens more than Hard.
  const candidateWidth = difficulty === 'master' ? 14 : 5;
  const candidates = rankedByZeroPly.slice(0, candidateWidth);

  let bestSeq = candidates[0].seq;
  let bestScore = -Infinity;
  for (const { seq } of candidates) {
    const score = evaluateTwoPly(seq.finalBoard, player);
    if (score > bestScore) {
      bestScore = score;
      bestSeq = seq;
    }
  }

  return bestSeq;
}

/**
 * Decides whether the AI should offer to double based on difficulty & match state
 */
export function shouldAIDouble(
  board: BoardState,
  player: Player,
  cubeValue: number,
  isCrawford: boolean,
  difficulty: AIDifficulty = 'hard'
): boolean {
  if (isCrawford) return false;
  if (cubeValue >= 64) return false;

  const normalizedDiff: 'easy' | 'medium' | 'hard' =
    difficulty === 'master' || difficulty === 'hard'
      ? 'hard'
      : difficulty === 'medium'
      ? 'medium'
      : 'easy';

  if (normalizedDiff === 'easy') {
    // Easy AI doubles randomly / unpredictably (10% chance when ahead)
    const evalScore = evaluateBoard(board, player, 'easy');
    return evalScore > 30 && Math.random() < 0.2;
  }

  if (normalizedDiff === 'medium') {
    const evalScore = evaluateBoard(board, player, 'medium');
    return evalScore >= 55 && evalScore <= 150;
  }

  // Hard AI: Doubling window between 45 and 165 equity
  const evalScore = evaluateBoard(board, player, 'hard');
  return evalScore >= 45 && evalScore <= 165;
}

/**
 * Decides whether the AI should accept (take) or decline (drop) a double
 */
export function shouldAIAcceptDouble(
  board: BoardState,
  player: Player,
  difficulty: AIDifficulty = 'hard'
): 'accept' | 'drop' {
  const normalizedDiff: 'easy' | 'medium' | 'hard' =
    difficulty === 'master' || difficulty === 'hard'
      ? 'hard'
      : difficulty === 'medium'
      ? 'medium'
      : 'easy';

  if (normalizedDiff === 'easy') {
    // Easy AI drops easily (50% drop rate when slightly behind)
    const evalScore = evaluateBoard(board, player, 'easy');
    return evalScore < -20 && Math.random() < 0.6 ? 'drop' : 'accept';
  }

  const evalScore = evaluateBoard(board, player, normalizedDiff);
  // Dropping loses 1 point. If winning chance > 25% (equity > -78), accept (take).
  if (evalScore >= -78) {
    return 'accept';
  }
  return 'drop';
}
