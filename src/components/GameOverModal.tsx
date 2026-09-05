import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Player, WinType, ScoreState, GameSettings } from '../types/backgammon';
import { Trophy, Home, ClipboardList } from 'lucide-react';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

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

const secondaryBtnStyle: React.CSSProperties = {
  border: `1px solid ${RULE}`,
  background: 'rgba(58,42,24,0.06)',
  color: BRASS,
};

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
          colors: ['#a3773f', '#cba766', '#f5eddb', '#2f2113'],
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
        className="w-full max-w-md rounded-lg p-6 sm:p-8 text-center relative overflow-hidden"
        style={ledgerCardStyle}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: BRASS }}>
          {isMatchOver ? t('gameOver.matchConcluded') : t('gameOver.gameComplete', { n: score.gamesPlayed })}
        </p>

        <h2 className="text-2xl tracking-tight capitalize mb-4" style={{ ...serif, fontWeight: 600, color: INK }}>
          {t('gameOver.victory', { winner: t(`players.${winner}`) })}
        </h2>

        {/* Score & Points Breakdown */}
        <div
          className="p-4 rounded-md text-xs space-y-2 mb-6"
          style={{ background: 'rgba(58,42,24,0.06)', border: `1px solid ${RULE}` }}
        >
          <div className="flex items-center justify-between">
            <span className="capitalize font-medium" style={{ color: BRASS }}>
              {t(`gameOver.win${winType.charAt(0).toUpperCase()}${winType.slice(1)}`)}
            </span>
            <span className="font-mono" style={{ color: INK }}>
              {t('gameOver.pointsFormula', { points: pointsWon, cube: cubeValue })}{' '}
              <strong className="font-bold" style={{ color: INK }}>{t('gameOver.totalPoints', { n: totalPoints })}</strong>
            </span>
          </div>

          <p className="text-[11px] text-left pt-2" style={{ color: INK_MUTED, borderTop: `1px solid ${RULE}` }}>
            {getWinTypeDescription()}
          </p>

          <div className="pt-2 flex justify-between items-center text-xs font-mono" style={{ borderTop: `1px solid ${RULE}` }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>{t('gameOver.matchScore')}</span>
            <div className="flex items-center gap-2 text-sm" style={{ color: INK }}>
              <span>{t('players.white')} {score.white}</span>
              <span style={{ color: BRASS }}>—</span>
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
              className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold rounded-md transition-transform active:scale-[0.98] cursor-pointer"
              style={{
                background: `linear-gradient(160deg,#cba766,#a3773f)`,
                color: '#2a1c0e',
                boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {t('gameOver.continueNextGame')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewMatch}
              className="w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold rounded-md transition-transform active:scale-[0.98] cursor-pointer"
              style={{
                background: `linear-gradient(160deg,#cba766,#a3773f)`,
                color: '#2a1c0e',
                boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {t('gameOver.startNewMatch')}
            </button>
          )}

          {onOpenMoveReview && (
            <button
              type="button"
              onClick={onOpenMoveReview}
              className="w-full py-2.5 text-xs uppercase tracking-[0.15em] font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              style={secondaryBtnStyle}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{t('gameOver.reviewMoves')}</span>
              {mistakeCount > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold"
                  style={{ background: 'rgba(139,30,30,0.1)', color: '#7a231f', border: '1px solid rgba(139,30,30,0.3)' }}
                >
                  {mistakeCount}
                </span>
              )}
            </button>
          )}

          {onOpenStats && (
            <button
              type="button"
              onClick={onOpenStats}
              className="w-full py-2.5 text-xs uppercase tracking-[0.15em] font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              style={secondaryBtnStyle}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('gameOver.viewStats')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 text-xs uppercase tracking-[0.15em] rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            style={{ border: `1px solid ${RULE}`, background: 'transparent', color: INK_MUTED }}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('gameOver.backToHome')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
