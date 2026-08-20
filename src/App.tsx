/**
 * Backgammon - Master Craft Implementation
 * Featuring realistic wooden textures, super smooth animations,
 * challenging heuristic AI, local pass & play multiplayer,
 * mirrorable view (clockwise/counter-clockwise), custom stakes & auto-doubles.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BoardState,
  Player,
  GameSettings,
  ScoreState,
  DoublingCubeState,
  GamePhase,
  MoveStep,
  MoveValidation,
  WinType,
  CareerStats,
  MatchHistoryEntry,
  GameHistoryEntry,
} from './types/backgammon';
import {
  createInitialBoard,
  cloneBoard,
  calculatePipCount,
  validateSingleMove,
  applyMove,
  getPossibleMoves,
  checkWin,
} from './logic/rules';
import { chooseBestTurn, shouldAIDouble, shouldAIAcceptDouble } from './logic/ai';
import { sound } from './utils/audio';
import {
  loadCareerStats,
  loadMatchHistory,
  recordCompletedGame,
  recordMatchEntry,
  clearAllStatsAndHistory,
} from './utils/statsStorage';

import { HomeScreen } from './components/HomeScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { Board } from './components/Board';
import { MatchStartModal } from './components/MatchStartModal';
import { DoublingModal } from './components/DoublingModal';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { StatsHistoryModal } from './components/StatsHistoryModal';

export default function App() {
  const { t } = useTranslation();
  // 1. Settings State
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'ai',
    cubeMode: 'with_cube',
    boardTheme: 'royal_green',
    checkerTheme: 'auto',
    aiDifficulty: 'hard',
    playerColor: 'white',
    stakeType: 'points',
    matchTarget: 5,
    stakePerPoint: 25,
    autoDoubleOnTie: true,
    bearingDirection: 'counterclockwise',
    soundEnabled: true,
    highlightMoves: true,
    showPipCount: true,
    autoRoll: false,
    crawfordRule: true,
  });

  // Career Statistics and Match History State
  const [stats, setStats] = useState<CareerStats>(loadCareerStats);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>(loadMatchHistory);

  // In-flight match tracking
  const currentMatchGamesRef = useRef<GameHistoryEntry[]>([]);
  const currentMatchEventsRef = useRef<string[]>([]);
  const matchStartTimeRef = useRef<number>(Date.now());
  const gameTurnsCountRef = useRef<number>(0);
  const gameHitsCountRef = useRef<{ white: number; black: number }>({ white: 0, black: 0 });

  // 2. Core Game State
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [activePlayer, setActivePlayer] = useState<Player>('white');
  const [phase, setPhase] = useState<GamePhase>('start_menu');

  // Dice state
  const [dice, setDice] = useState<number[]>([]);
  const [rolledDice, setRolledDice] = useState<[number, number] | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [openingDice, setOpeningDice] = useState<{ white: number | null; black: number | null }>({
    white: null,
    black: null,
  });
  const [openingRoller, setOpeningRoller] = useState<Player | null>('white');

  // Doubling Cube State
  const [cube, setCube] = useState<DoublingCubeState>({
    value: 1,
    owner: 'neutral',
    isOffered: false,
    offeredBy: null,
    autoDoublesCount: 0,
  });

  // Score & Match State
  const [score, setScore] = useState<ScoreState>({
    white: 0,
    black: 0,
    whiteEarnings: 0,
    blackEarnings: 0,
    gamesPlayed: 1,
    isCrawford: false,
  });

  // Interactive Movement State
  const [selectedSource, setSelectedSource] = useState<number | 'bar' | null>(null);
  const [turnHistory, setTurnHistory] = useState<{ steps: MoveStep[]; boardBefore: BoardState }[]>([]);

  // Landing screen — shown once before the very first match is set up, so
  // launching the app doesn't drop straight into match-configuration UI.
  const [showHome, setShowHome] = useState<boolean>(true);

  // Modals & Overlays
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isDoublingModalOpen, setIsDoublingModalOpen] = useState<boolean>(false);
  const [gameOverInfo, setGameOverInfo] = useState<{
    winner: Player;
    winType: WinType;
    pointsWon: number;
    cubeValue: number;
    isMatchOver: boolean;
  } | null>(null);

  // Status toast / message for feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string, durationMs = 2500) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((curr) => (curr === msg ? null : curr));
    }, durationMs);
  }, []);

  // Update sound engine on setting change
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Compute Pip Counts
  const pips = calculatePipCount(board);

  // Determine valid targets for the currently selected checker
  const validTargets = React.useMemo(() => {
    const targets = new Map<number | 'off', MoveValidation>();
    if (selectedSource === null || dice.length === 0 || phase !== 'moving') {
      return targets;
    }

    const uniqueDice: number[] = Array.from(new Set(dice));
    for (const die of uniqueDice) {
      const val = validateSingleMove(board, activePlayer, selectedSource, die);
      if (val.valid) {
        targets.set(val.to, val);
      }
    }

    return targets;
  }, [board, activePlayer, selectedSource, dice, phase]);

  // ----------------------------------------------------
  // Match & Round Management
  // ----------------------------------------------------
  // Switch Turn
  const switchTurn = useCallback(
    (currentP: Player) => {
      const nextP: Player = currentP === 'white' ? 'black' : 'white';
      setActivePlayer(nextP);
      setSelectedSource(null);
      setTurnHistory([]);
      setDice([]);
      setRolledDice(null);
      setPhase('rolling');
    },
    []
  );

  // ----------------------------------------------------
  // Interactive Sequential Opening Roll
  // ----------------------------------------------------
  const resolveOpeningRoll = useCallback(
    (diceResult: { white: number; black: number }) => {
      const dWhite = diceResult.white;
      const dBlack = diceResult.black;

      if (dWhite === dBlack) {
        // Opening tie!
        if (settings.cubeMode === 'with_cube' && settings.autoDoubleOnTie) {
          setCube((prev) => {
            const nextVal = Math.min(prev.value * 2, 64);
            sound.playDouble();
            showToast(t('toast.tieDoubleCube', { d1: dWhite, d2: dBlack, value: nextVal }));
            return {
              ...prev,
              value: nextVal,
              autoDoublesCount: prev.autoDoublesCount + 1,
            };
          });
        } else {
          showToast(t('toast.tieRollAgain', { d1: dWhite, d2: dBlack }));
        }

        // Set the designated first roller for the manual re-roll (do NOT auto-roll with timeout)
        const firstRoller: Player = settings.mode === 'ai' ? settings.playerColor : 'white';
        setOpeningRoller(firstRoller);
      } else {
        // Winner determined: higher die wins and starts game with [dWhite, dBlack]
        const firstPlayer: Player = dWhite > dBlack ? 'white' : 'black';
        const higherVal = Math.max(dWhite, dBlack);
        const lowerVal = Math.min(dWhite, dBlack);

        showToast(
          t('toast.wonOpening', { player: t(`players.${firstPlayer}`), high: higherVal, low: lowerVal })
        );

        setTimeout(() => {
          setActivePlayer(firstPlayer);
          setRolledDice([dWhite, dBlack]);
          setDice([dWhite, dBlack]);
          setPhase('moving');

          // Check if first player has any legal moves with opening dice
          const initialMoves = getPossibleMoves(createInitialBoard(), firstPlayer, [dWhite, dBlack]);
          if (initialMoves.length === 0) {
            showToast(t('toast.noMoves', { d1: dWhite, d2: dBlack }));
            setTimeout(() => {
              switchTurn(firstPlayer);
            }, 1500);
          }
        }, 1200);
      }
    },
    [settings.cubeMode, settings.autoDoubleOnTie, settings.mode, settings.playerColor, showToast, switchTurn]
  );

  const startOpeningRoll = useCallback(
    (customSettings?: GameSettings) => {
      const activeSettings = customSettings || settings;
      setBoard(createInitialBoard());
      setSelectedSource(null);
      setTurnHistory([]);
      setPhase('opening_roll');
      setOpeningDice({ white: null, black: null });
      setIsRolling(false);

      const firstRoller: Player =
        activeSettings.mode === 'ai' ? activeSettings.playerColor : 'white';
      setOpeningRoller(firstRoller);

      if (activeSettings.mode === 'ai') {
        showToast(t('toast.openingRollPrompt'));
      } else {
        showToast(t('toast.openingRollTurn', { player: t(`players.${firstRoller}`) }));
      }
    },
    [settings, showToast]
  );

  const handleRollOpeningDie = useCallback(
    (playerColorToRoll?: Player) => {
      if (phase !== 'opening_roll' || isRolling) return;

      // Check if we are currently in a tie state (both dice rolled and equal)
      const isTieState =
        openingDice.white !== null &&
        openingDice.black !== null &&
        openingDice.white === openingDice.black;

      const currentRoller = isTieState
        ? (settings.mode === 'ai' ? settings.playerColor : (playerColorToRoll || openingRoller || 'white'))
        : (playerColorToRoll || openingRoller || (settings.mode === 'ai' ? settings.playerColor : 'white'));

      // In AI mode, if the human player hasn't thrown yet, don't allow throwing as AI
      if (
        !isTieState &&
        settings.mode === 'ai' &&
        currentRoller !== settings.playerColor &&
        openingDice[settings.playerColor] === null
      ) {
        return;
      }

      setIsRolling(true);
      sound.playDiceRoll();

      setTimeout(() => {
        const rolledVal = Math.floor(Math.random() * 6) + 1;
        setIsRolling(false);

        const otherPlayer: Player = currentRoller === 'white' ? 'black' : 'white';

        // If it was a tie state, start fresh with the new roll for currentRoller
        const baseDice = isTieState ? { white: null, black: null } : openingDice;
        const updatedDice = { ...baseDice, [currentRoller]: rolledVal };

        if (updatedDice[otherPlayer] === null) {
          // Next player's turn to throw opening die
          setOpeningDice(updatedDice);
          setOpeningRoller(otherPlayer);

          if (settings.mode === 'ai') {
            showToast(t('toast.aiRolling'));
            setTimeout(() => {
              setIsRolling(true);
              sound.playDiceRoll();

              setTimeout(() => {
                const aiVal = Math.floor(Math.random() * 6) + 1;
                setIsRolling(false);

                const finalDice = { ...updatedDice, [otherPlayer]: aiVal } as { white: number; black: number };
                setOpeningDice(finalDice);
                resolveOpeningRoll(finalDice);
              }, 550);
            }, 650);
          } else {
            showToast(t('toast.playerRollNow', { player: t(`players.${otherPlayer}`) }));
          }
        } else {
          // Both players have rolled
          setOpeningDice(updatedDice);
          resolveOpeningRoll(updatedDice as { white: number; black: number });
        }
      }, 500);
    },
    [phase, isRolling, openingRoller, openingDice, settings.mode, settings.playerColor, showToast, resolveOpeningRoll]
  );

  // ----------------------------------------------------
  // Match & Round Management
  // ----------------------------------------------------
  const startNewMatch = useCallback(
    (customSettings?: Partial<GameSettings>) => {
      let activeSettings = settings;
      if (customSettings) {
        activeSettings = { ...settings, ...customSettings };
        setSettings(activeSettings);
      }
      setScore({
        white: 0,
        black: 0,
        whiteEarnings: 0,
        blackEarnings: 0,
        gamesPlayed: 1,
        isCrawford: false,
      });
      setCube({
        value: 1,
        owner: 'neutral',
        isOffered: false,
        offeredBy: null,
        autoDoublesCount: 0,
      });
      setGameOverInfo(null);
      setIsStartModalOpen(false);

      // Reset match tracking refs
      currentMatchGamesRef.current = [];
      currentMatchEventsRef.current = [];
      matchStartTimeRef.current = Date.now();
      gameTurnsCountRef.current = 0;
      gameHitsCountRef.current = { white: 0, black: 0 };

      startOpeningRoll(activeSettings);
    },
    [settings, startOpeningRoll]
  );

  const startNextGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCube({
      value: 1,
      owner: 'neutral',
      isOffered: false,
      offeredBy: null,
      autoDoublesCount: 0,
    });
    setSelectedSource(null);
    setTurnHistory([]);
    setDice([]);
    setRolledDice(null);
    setGameOverInfo(null);

    // Reset game tracking refs
    gameTurnsCountRef.current = 0;
    gameHitsCountRef.current = { white: 0, black: 0 };

    startOpeningRoll();
  }, [startOpeningRoll]);

  // ----------------------------------------------------
  // Dice Rolling
  // ----------------------------------------------------
  const handleRollDice = useCallback(() => {
    if (phase !== 'rolling' || isRolling) return;

    setIsRolling(true);
    sound.playDiceRoll();

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const rolled: [number, number] = [d1, d2];
      const availableDice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];

      setIsRolling(false);
      setRolledDice(rolled);
      setDice(availableDice);
      setPhase('moving');

      if (d1 === d2) {
        showToast(t('toast.rolledDoubles', { n: d1 }));
      }

      // Check if player has any legal moves
      const moves = getPossibleMoves(board, activePlayer, availableDice);
      if (moves.length === 0) {
        showToast(t('toast.noLegalMoves', { d1, d2 }));
        setTimeout(() => {
          switchTurn(activePlayer);
        }, 1500);
      }
    }, 550);
  }, [phase, isRolling, board, activePlayer, showToast, switchTurn]);

  // ----------------------------------------------------
  // Moving Checkers (Human Click & Move)
  // ----------------------------------------------------
  const handleSelectPoint = useCallback(
    (index: number) => {
      if (phase !== 'moving') return;

      // If playing vs AI and it's AI's turn, ignore human click
      if (settings.mode === 'ai' && activePlayer !== settings.playerColor) return;

      // If player has checkers on bar, they MUST move from bar first!
      if (board.bar[activePlayer] > 0) {
        showToast(t('toast.mustEnterFromBar'));
        setSelectedSource('bar');
        return;
      }

      const pt = board.points[index];
      if (pt.color === activePlayer && pt.count > 0) {
        setSelectedSource((prev) => (prev === index ? null : index));
        sound.playCheckerSlide();
      }
    },
    [phase, settings.mode, activePlayer, settings.playerColor, board, showToast]
  );

  const handleSelectBar = useCallback(() => {
    if (phase !== 'moving') return;
    if (settings.mode === 'ai' && activePlayer !== settings.playerColor) return;

    if (board.bar[activePlayer] > 0) {
      setSelectedSource('bar');
      sound.playCheckerSlide();
    }
  }, [phase, settings.mode, activePlayer, settings.playerColor, board]);

  // Execute Move to Target
  const handleSelectTarget = useCallback(
    (target: number | 'off') => {
      if (selectedSource === null || phase !== 'moving') return;

      // Find valid die for this destination
      let usedDie: number | null = null;
      const uniqueDice: number[] = Array.from(new Set(dice));

      for (const d of uniqueDice) {
        const val = validateSingleMove(board, activePlayer, selectedSource, d);
        if (val.valid && val.to === target) {
          usedDie = d;
          break;
        }
      }

      if (usedDie === null) return;

      // Apply move
      const { nextBoard, isHit } = applyMove(
        board,
        activePlayer,
        selectedSource,
        target,
        usedDie
      );

      // Play audio feedback & track hits
      if (target === 'off') {
        sound.playBearOff();
      } else if (isHit) {
        sound.playHit();
        gameHitsCountRef.current[activePlayer] += 1;
        showToast(t('toast.capturedChecker'));
      } else {
        sound.playCheckerDrop();
      }

      // Update history for undo
      const step: MoveStep = {
        from: selectedSource,
        to: target,
        dieUsed: usedDie,
        isHit,
        player: activePlayer,
      };

      setTurnHistory((prev) => [...prev, { steps: [step], boardBefore: board }]);
      setBoard(nextBoard);

      // Remove used die
      const nextDice = [...dice];
      const dieIdx = nextDice.indexOf(usedDie);
      nextDice.splice(dieIdx, 1);
      setDice(nextDice);
      setSelectedSource(null);

      // Check win condition
      const win = checkWin(nextBoard);
      if (win.winner !== null) {
        handleGameWin(win.winner, win.type, win.points);
        return;
      }

      // Check remaining dice and moves
      if (nextDice.length === 0) {
        // End of turn
        gameTurnsCountRef.current += 1;
        switchTurn(activePlayer);
      } else {
        const remainingMoves = getPossibleMoves(nextBoard, activePlayer, nextDice);
        if (remainingMoves.length === 0) {
          showToast(t('toast.noFurtherMoves'));
          gameTurnsCountRef.current += 1;
          setTimeout(() => {
            switchTurn(activePlayer);
          }, 1200);
        }
      }
    },
    [selectedSource, phase, dice, board, activePlayer, showToast, switchTurn]
  );

  // Undo Last Step in Current Turn
  const handleUndo = useCallback(() => {
    if (turnHistory.length === 0 || phase !== 'moving') return;

    const last = turnHistory[turnHistory.length - 1];
    if (last.steps[0]?.isHit) {
      gameHitsCountRef.current[activePlayer] = Math.max(0, gameHitsCountRef.current[activePlayer] - 1);
    }
    setBoard(last.boardBefore);

    // Restore die
    const restoredDie = last.steps[0].dieUsed;
    setDice((prev) => [...prev, restoredDie]);
    setTurnHistory((prev) => prev.slice(0, -1));
    setSelectedSource(null);
    sound.playCheckerSlide();
  }, [turnHistory, phase, activePlayer]);

  // ----------------------------------------------------
  // Doubling Cube Mechanics
  // ----------------------------------------------------
  const canPlayerDouble =
    settings.cubeMode === 'with_cube' &&
    phase === 'rolling' &&
    !isRolling &&
    (cube.owner === 'neutral' || cube.owner === activePlayer) &&
    !score.isCrawford &&
    cube.value < 64 &&
    (settings.mode === 'local' || activePlayer === settings.playerColor);

  const handleOfferDouble = useCallback(() => {
    if (!canPlayerDouble) return;

    setPhase('doubling_offered');
    setCube((prev) => ({
      ...prev,
      isOffered: true,
      offeredBy: activePlayer,
    }));
    sound.playDouble();

    if (settings.mode === 'ai') {
      // AI evaluates whether to accept or drop
      setTimeout(() => {
        const aiColor: Player = settings.playerColor === 'white' ? 'black' : 'white';
        const decision = shouldAIAcceptDouble(board, aiColor, settings.aiDifficulty);

        if (decision === 'accept') {
          const nextVal = cube.value === 1 ? 2 : cube.value * 2;
          setCube((prev) => ({
            ...prev,
            value: nextVal,
            owner: aiColor,
            isOffered: false,
            offeredBy: null,
          }));
          setPhase('rolling');
          currentMatchEventsRef.current.push(`AI accepted double to ${nextVal}x`);
          showToast(t('toast.aiAcceptedDouble', { value: nextVal }));
        } else {
          // AI drops -> Human wins 1x cube value
          currentMatchEventsRef.current.push(`AI dropped double offer`);
          showToast(t('toast.aiDroppedDouble'));
          handleGameWin(settings.playerColor, 'single', 1);
        }
      }, 1000);
    } else {
      // 2-Player local modal
      setIsDoublingModalOpen(true);
    }
  }, [canPlayerDouble, activePlayer, settings.mode, settings.playerColor, settings.aiDifficulty, board, cube.value, showToast]);

  const handleAcceptDouble = useCallback(() => {
    const nextVal = cube.value === 1 ? 2 : cube.value * 2;
    const opponent: Player = activePlayer === 'white' ? 'black' : 'white';

    setCube((prev) => ({
      ...prev,
      value: nextVal,
      owner: activePlayer, // player who accepted now owns cube
      isOffered: false,
      offeredBy: null,
    }));
    setIsDoublingModalOpen(false);
    setPhase('rolling');
    sound.playDouble();
    currentMatchEventsRef.current.push(`${activePlayer.toUpperCase()} accepted double to ${nextVal}x`);
    showToast(t('toast.doubleAccepted', { value: nextVal }));
  }, [cube.value, activePlayer, showToast]);

  const handleDropDouble = useCallback(() => {
    setIsDoublingModalOpen(false);
    const opponent: Player = activePlayer === 'white' ? 'black' : 'white';
    currentMatchEventsRef.current.push(`${activePlayer.toUpperCase()} declined double`);
    showToast(t('toast.playerDropped', { player: t(`players.${activePlayer}`) }));
    handleGameWin(opponent, 'single', 1);
  }, [activePlayer, showToast]);

  // ----------------------------------------------------
  // Win / Game Over Handling
  // ----------------------------------------------------
  const handleGameWin = useCallback(
    (winner: Player, winType: WinType, pointsWon: number) => {
      setPhase('game_over');
      sound.playWin();

      const isCubeActive = settings.cubeMode === 'with_cube';
      const effectiveCube = isCubeActive ? cube.value : 1;
      const totalGamePoints = pointsWon * effectiveCube;

      setScore((prev) => {
        const nextWhite = winner === 'white' ? prev.white + totalGamePoints : prev.white;
        const nextBlack = winner === 'black' ? prev.black + totalGamePoints : prev.black;

        const moneyEarnings = totalGamePoints * settings.stakePerPoint;
        const nextWhiteMoney =
          winner === 'white'
            ? prev.whiteEarnings + moneyEarnings
            : prev.whiteEarnings - moneyEarnings;
        const nextBlackMoney =
          winner === 'black'
            ? prev.blackEarnings + moneyEarnings
            : prev.blackEarnings - moneyEarnings;

        const isMatchOver =
          settings.stakeType === 'points' &&
          (nextWhite >= settings.matchTarget || nextBlack >= settings.matchTarget);

        // Crawford Rule check: occurs once when a player reaches 1 point away from match target
        const isCrawford =
          isCubeActive &&
          settings.crawfordRule &&
          settings.stakeType === 'points' &&
          !prev.isCrawford &&
          (nextWhite === settings.matchTarget - 1 || nextBlack === settings.matchTarget - 1);

        // Build game key events
        const gameKeyEvents: string[] = [];
        if (winType === 'backgammon') {
          gameKeyEvents.push(`Backgammon victory (3x points)`);
        } else if (winType === 'gammon') {
          gameKeyEvents.push(`Gammon victory (2x points)`);
        }
        if (isCubeActive && cube.value > 1) {
          gameKeyEvents.push(`Played with ${cube.value}x doubling cube`);
        }
        const totalHits = gameHitsCountRef.current.white + gameHitsCountRef.current.black;
        if (totalHits > 0) {
          gameKeyEvents.push(`${totalHits} total checker hits`);
        }

        const gameEntry: GameHistoryEntry = {
          gameNumber: prev.gamesPlayed,
          winner,
          winType,
          pointsWon,
          cubeValue: effectiveCube,
          finalScore: { white: nextWhite, black: nextBlack },
          totalTurns: gameTurnsCountRef.current,
          hitsCount: { ...gameHitsCountRef.current },
          keyEvents: gameKeyEvents,
        };

        currentMatchGamesRef.current.push(gameEntry);

        // Record game in career stats
        const updatedStats = recordCompletedGame(
          winner,
          settings.playerColor,
          winType,
          effectiveCube,
          settings.mode,
          settings.aiDifficulty
        );
        setStats(updatedStats);

        // If match concluded or in money mode (every game is a match), record full match entry
        if (isMatchOver || settings.stakeType === 'money') {
          const matchEvents: string[] = [...currentMatchEventsRef.current];
          if (winType === 'backgammon') matchEvents.push('Backgammon 3x Win');
          if (winType === 'gammon') matchEvents.push('Gammon 2x Win');
          if (isCubeActive && cube.value > 1) matchEvents.push(`Doubled to ${cube.value}x`);

          const isUserWin =
            settings.mode === 'ai' ? winner === settings.playerColor : winner === 'white';

          const matchEntry: MatchHistoryEntry = {
            id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            date: Date.now(),
            mode: settings.mode,
            cubeMode: settings.cubeMode,
            aiDifficulty: settings.aiDifficulty,
            playerColor: settings.playerColor,
            stakeType: settings.stakeType,
            matchTarget: settings.matchTarget,
            stakePerPoint: settings.stakePerPoint,
            winner,
            isUserWinner: isUserWin,
            finalScore: { white: nextWhite, black: nextBlack },
            games: [...currentMatchGamesRef.current],
            totalGames: currentMatchGamesRef.current.length,
            keyEvents: matchEvents,
            durationSeconds: Math.max(10, Math.round((Date.now() - matchStartTimeRef.current) / 1000)),
          };

          const { stats: finalStats, history: finalHist } = recordMatchEntry(matchEntry);
          setStats(finalStats);
          setMatchHistory(finalHist);
        }

        setGameOverInfo({
          winner,
          winType,
          pointsWon,
          cubeValue: effectiveCube,
          isMatchOver,
        });

        return {
          white: nextWhite,
          black: nextBlack,
          whiteEarnings: nextWhiteMoney,
          blackEarnings: nextBlackMoney,
          gamesPlayed: prev.gamesPlayed + 1,
          isCrawford,
        };
      });
    },
    [
      cube.value,
      settings.cubeMode,
      settings.stakePerPoint,
      settings.stakeType,
      settings.matchTarget,
      settings.crawfordRule,
      settings.playerColor,
      settings.mode,
      settings.aiDifficulty,
    ]
  );

  const handleResign = useCallback(() => {
    const opponent: Player = activePlayer === 'white' ? 'black' : 'white';
    showToast(t('toast.playerResigned', { player: t(`players.${activePlayer}`) }));
    handleGameWin(opponent, 'single', 1);
  }, [activePlayer, showToast, handleGameWin]);

  // ----------------------------------------------------
  // AI Automation Loop
  // ----------------------------------------------------
  const aiTurnInProgress = useRef(false);

  useEffect(() => {
    if (settings.mode !== 'ai') return;
    const aiColor: Player = settings.playerColor === 'white' ? 'black' : 'white';

    if (activePlayer !== aiColor) return;
    if (phase === 'game_over' || phase === 'match_over' || phase === 'opening_roll') return;
    if (aiTurnInProgress.current) return;

    const playMoves = (diceToPlay: number[], currentBoard: BoardState) => {
      const bestSeq = chooseBestTurn(currentBoard, aiColor, diceToPlay, settings.aiDifficulty);

      if (!bestSeq || bestSeq.steps.length === 0) {
        showToast(t('toast.aiNoLegalMoves'));
        setTimeout(() => {
          aiTurnInProgress.current = false;
          switchTurn(aiColor);
        }, 1400);
        return;
      }

      let stateBoard = currentBoard;
      let stateDice = [...diceToPlay];

      bestSeq.steps.forEach((step, stepIdx) => {
        setTimeout(() => {
          const { nextBoard, isHit } = applyMove(
            stateBoard,
            aiColor,
            step.from,
            step.to,
            step.dieUsed
          );

          if (step.to === 'off') {
            sound.playBearOff();
          } else if (isHit) {
            sound.playHit();
            gameHitsCountRef.current[aiColor] += 1;
          } else {
            sound.playCheckerDrop();
          }

          stateBoard = nextBoard;
          setBoard(nextBoard);

          const dieIdx = stateDice.indexOf(step.dieUsed);
          if (dieIdx !== -1) {
            stateDice.splice(dieIdx, 1);
            setDice([...stateDice]);
          }

          if (stepIdx === bestSeq.steps.length - 1) {
            gameTurnsCountRef.current += 1;
            const win = checkWin(nextBoard);
            if (win.winner !== null) {
              aiTurnInProgress.current = false;
              handleGameWin(win.winner, win.type, win.points);
            } else {
              setTimeout(() => {
                aiTurnInProgress.current = false;
                switchTurn(aiColor);
              }, 600);
            }
          }
        }, (stepIdx + 1) * 600);
      });
    };

    // AI Turn step 1: Check doubling decision before roll
    if (phase === 'rolling') {
      aiTurnInProgress.current = true;

      setTimeout(() => {
        const shouldDouble =
          settings.cubeMode === 'with_cube' &&
          (cube.owner === 'neutral' || cube.owner === aiColor) &&
          !score.isCrawford &&
          cube.value < 64 &&
          shouldAIDouble(board, aiColor, cube.value, score.isCrawford, settings.aiDifficulty);

        if (shouldDouble) {
          setPhase('doubling_offered');
          setCube((prev) => ({
            ...prev,
            isOffered: true,
            offeredBy: aiColor,
          }));
          sound.playDouble();
          setIsDoublingModalOpen(true);
          aiTurnInProgress.current = false;
        } else {
          // AI Rolls Dice
          setIsRolling(true);
          sound.playDiceRoll();

          setTimeout(() => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const rolled: [number, number] = [d1, d2];
            const aiDice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];

            setIsRolling(false);
            setRolledDice(rolled);
            setDice(aiDice);
            setPhase('ai_thinking');

            playMoves(aiDice, board);
          }, 600);
        }
      }, 700);
    } else if (phase === 'moving' && dice.length > 0) {
      // AI after opening roll or re-render
      aiTurnInProgress.current = true;
      setPhase('ai_thinking');
      setTimeout(() => {
        playMoves(dice, board);
      }, 600);
    }
  }, [
    settings.mode,
    settings.playerColor,
    settings.aiDifficulty,
    activePlayer,
    phase,
    dice,
    board,
    cube,
    score.isCrawford,
    showToast,
    switchTurn,
    handleGameWin,
  ]);

  if (showHome) {
    return (
      <>
        <HomeScreen
          onNewMatch={() => {
            setShowHome(false);
            setIsStartModalOpen(true);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
          onResign={handleResign}
        />
      </>
    );
  }

  return (
    <div
      className="app-safe-area h-dvh w-full bg-[#0d0906] text-[#e0d5c1] flex flex-col justify-between selection:bg-[#e5c07b] selection:text-[#0d0906] font-sans overflow-hidden relative"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 35%, rgba(65, 43, 26, 0.45) 0%, rgba(20, 14, 9, 0.95) 75%, #0a0604 100%)',
      }}
    >
      {/* Dynamic Toast Banner */}
      {statusMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="bg-[#1a120b]/95 backdrop-blur-md text-[#f9f3e5] px-6 py-2.5 rounded-full text-xs tracking-wider font-medium shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-[#e5c07b]/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e5c07b] animate-pulse" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header HUD */}
      <HeaderHUD
        settings={settings}
        score={score}
        pips={pips}
        activePlayer={activePlayer}
        phase={phase}
        cube={cube}
        canUndo={turnHistory.length > 0 && phase === 'moving'}
        onUndo={handleUndo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onNewGame={() => setIsStartModalOpen(true)}
        onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onResign={handleResign}
      />

      {/* Main Board Viewport */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-1 sm:p-2 relative">
        <Board
          board={board}
          activePlayer={activePlayer}
          settings={settings}
          dice={dice}
          rolledDice={rolledDice}
          isRolling={isRolling}
          canRoll={
            phase === 'rolling' &&
            (settings.mode === 'local' || activePlayer === settings.playerColor)
          }
          onRoll={handleRollDice}
          selectedSource={selectedSource}
          validTargets={validTargets}
          onSelectPoint={handleSelectPoint}
          onSelectBar={handleSelectBar}
          onSelectTarget={handleSelectTarget}
          cube={cube}
          canDouble={canPlayerDouble}
          onOfferDouble={handleOfferDouble}
          isOpeningRoll={phase === 'opening_roll'}
          openingDice={openingDice}
          openingRoller={openingRoller}
          onOpeningRoll={handleRollOpeningDie}
        />
      </main>

      {/* Minimalist Bottom Status Bar */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] tracking-wider uppercase text-[#a89984]/60 border-t border-[#2d1e15]">
        <div className="flex items-center gap-2">
          <span className="text-[#e5c07b] font-medium">{t('footer.appName')}</span>
          <span>•</span>
          <span className="capitalize">
            {settings.mode === 'ai' ? t('footer.vsAi', { difficulty: settings.aiDifficulty }) : t('footer.twoPlayer')}
          </span>
          <span>•</span>
          <span>
            {settings.bearingDirection === 'counterclockwise' ? t('footer.directionStandard') : t('footer.directionReverse')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsStatsOpen(true)}
            className="text-[#c2a278] hover:text-[#f9f3e5] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
          >
            {t('footer.statsAndHistory')}
          </button>
          <span>•</span>
          <span>{t('footer.game', { n: score.gamesPlayed })}</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setIsRulesOpen(true)}
            className="text-[#c2a278] hover:text-[#f9f3e5] hover:underline cursor-pointer transition-colors"
          >
            {t('footer.howToPlay')}
          </button>
        </div>
      </footer>

      {/* Modals */}
      <MatchStartModal
        isOpen={isStartModalOpen}
        settings={settings}
        onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
        onStartMatch={() => startNewMatch()}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <DoublingModal
        isOpen={isDoublingModalOpen}
        cube={cube}
        activePlayer={activePlayer}
        onAccept={handleAcceptDouble}
        onDrop={handleDropDouble}
      />

      <GameOverModal
        isOpen={gameOverInfo !== null}
        winner={gameOverInfo?.winner || 'white'}
        winType={gameOverInfo?.winType || 'single'}
        pointsWon={gameOverInfo?.pointsWon || 1}
        cubeValue={gameOverInfo?.cubeValue || 1}
        score={score}
        settings={settings}
        isMatchOver={gameOverInfo?.isMatchOver || false}
        onNextGame={startNextGame}
        onNewMatch={() => setIsStartModalOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newS) => setSettings((prev) => ({ ...prev, ...newS }))}
        onResign={handleResign}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <StatsHistoryModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        history={matchHistory}
        onClearData={() => {
          const { stats: s, history: h } = clearAllStatsAndHistory();
          setStats(s);
          setMatchHistory(h);
          showToast(t('toast.statsCleared'));
        }}
      />
    </div>
  );
}
