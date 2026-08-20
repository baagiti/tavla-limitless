import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Player, WinType, ScoreState, GameSettings } from '../types/backgammon';
import { Trophy, Home, ClipboardList } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player;
  winType: WinType;
  pointsWon: number;
  cubeValue: number;
  score: ScoreState;
  settings: GameSettings;
  isMatchOver: boolean;
  onNextGame: () => void;
  onNewMatch: () => void;
  onGoHome: () => void;
  onOpenStats?: () => void;
  onOpenMoveReview?: () => void;
  mistakeCount?: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  winType,
  pointsWon,
  cubeValue,
  score,
  settings,
  isMatchOver,
  onNextGame,
  onNewMatch,
  onGoHome,
  onOpenStats,
  onOpenMoveReview,
  mistakeCount = 0,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: isMatchOver ? 100 : 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#c2a278', '#8b5e3c', '#f9f3e5', '#2d1e15'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, isMatchOver]);

  const { t } = useTranslation();
  if (!isOpen) return null;

  const totalPoints = pointsWon * cubeValue;

  const getWinTypeDescription = () => {
    switch (winType) {
      case 'backgammon':
        return t('gameOver.descBackgammon');
      case 'gammon':
        return t('gameOver.descGammon');
      default:
        return t('gameOver.descSingle');
    }
  };

  return (
    <div
      id="game-over-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 sm:p-8 text-[#e0d5c1] text-center relative overflow-hidden"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#c2a278] opacity-80 mb-2">
          {isMatchOver ? t('gameOver.matchConcluded') : t('gameOver.gameComplete', { n: score.gamesPlayed })}
        </p>

        <h2 className="text-2xl font-light font-serif tracking-tight text-[#f9f3e5] capitalize mb-4">
          {t('gameOver.victory', { winner: t(`players.${winner}`) })}
        </h2>

        {/* Score & Points Breakdown */}
        <div className="p-4 bg-[#1a130f] border border-[#2d1e15] rounded-sm text-xs space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="capitalize font-medium text-[#c2a278]">
              {t(`gameOver.win${winType.charAt(0).toUpperCase()}${winType.slice(1)}`)}
            </span>
            <span className="font-mono text-[#e0d5c1]">
              {t('gameOver.pointsFormula', { points: pointsWon, cube: cubeValue })}{' '}
              <strong className="text-[#f9f3e5] font-bold">{t('gameOver.totalPoints', { n: totalPoints })}</strong>
            </span>
          </div>

          <p className="text-[11px] text-[#e0d5c1]/50 text-left pt-2 border-t border-[#2d1e15]">
            {getWinTypeDescription()}
          </p>

          <div className="pt-2 flex justify-between items-center text-xs font-mono border-t border-[#2d1e15]">
            <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/60">{t('gameOver.matchScore')}</span>
            <div className="flex items-center gap-2 text-sm text-[#f9f3e5]">
              <span>{t('players.white')} {score.white}</span>
              <span className="text-[#c2a278]">—</span>
              <span>{t('players.black')} {score.black}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {!isMatchOver ? (
            <button
              type="button"
              onClick={onNextGame}
              className="w-full py-3.5 border border-[#c2a278] bg-[#c2a278] text-[#140e0a] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#d6b78d] transition-colors cursor-pointer"
            >
              {t('gameOver.continueNextGame')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewMatch}
              className="w-full py-3.5 border border-[#c2a278] bg-[#c2a278] text-[#140e0a] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#d6b78d] transition-colors cursor-pointer"
            >
              {t('gameOver.startNewMatch')}
            </button>
          )}

          {onOpenMoveReview && (
            <button
              type="button"
              onClick={onOpenMoveReview}
              className="w-full py-2.5 border border-[#c2a278]/40 bg-[#1a130f] text-[#c2a278] hover:bg-[#2d1e15] text-xs uppercase tracking-[0.15em] font-medium rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{t('gameOver.reviewMoves')}</span>
              {mistakeCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60 text-[9px] font-mono font-bold">
                  {mistakeCount}
                </span>
              )}
            </button>
          )}

          {onOpenStats && (
            <button
              type="button"
              onClick={onOpenStats}
              className="w-full py-2.5 border border-[#c2a278]/40 bg-[#1a130f] text-[#c2a278] hover:bg-[#2d1e15] text-xs uppercase tracking-[0.15em] font-medium rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('gameOver.viewStats')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 border border-[#2d1e15] bg-[#1a130f] text-[#e0d5c1]/60 hover:text-[#e0d5c1] text-xs uppercase tracking-[0.15em] rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('gameOver.backToHome')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
