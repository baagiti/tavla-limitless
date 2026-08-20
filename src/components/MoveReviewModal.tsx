import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MoveLogEntry, MoveStep } from '../types/backgammon';
import { X, AlertTriangle, ClipboardList } from 'lucide-react';

interface MoveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveLog: MoveLogEntry[];
}

function formatStep(step: MoveStep): string {
  const from = step.from === 'bar' ? 'Bar' : String(step.from + 1);
  const to = step.to === 'off' ? 'Off' : String(step.to + 1);
  return `${from}/${to}`;
}

function formatSteps(steps: MoveStep[]): string {
  return steps.map(formatStep).join(', ');
}

function formatDice(dice: number[]): string {
  const unique = Array.from(new Set(dice));
  return unique.length === 1 ? `${unique[0]}-${unique[0]}` : dice.join('-');
}

export const MoveReviewModal: React.FC<MoveReviewModalProps> = ({ isOpen, onClose, moveLog }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const mistakeCount = moveLog.filter((m) => m.isMistake).length;

  return (
    <div
      id="move-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg max-h-[85vh] flex flex-col bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl text-[#e0d5c1] relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#e0d5c1]/50 hover:text-[#e0d5c1] cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-3 border-b border-[#2d1e15] shrink-0">
          <h3 className="text-xl font-serif text-[#c2a278] flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            {t('moveReview.title')}
          </h3>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-40 mt-1">
            {mistakeCount > 0
              ? t('moveReview.subtitleWithMistakes', { count: mistakeCount, total: moveLog.length })
              : t('moveReview.subtitleClean', { total: moveLog.length })}
          </p>
        </div>

        <div className="overflow-y-auto p-4 space-y-1.5 flex-1">
          {moveLog.length === 0 ? (
            <p className="text-xs text-[#e0d5c1]/50 text-center py-8">{t('moveReview.empty')}</p>
          ) : (
            moveLog.map((entry, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-sm border text-xs ${
                  entry.isMistake
                    ? 'border-rose-800/50 bg-rose-950/20'
                    : 'border-[#2d1e15] bg-[#1a130f]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        entry.player === 'white'
                          ? 'bg-[#f9f3e5] border border-[#d4c5a9]'
                          : 'bg-[#961c1e] border border-[#52090a]'
                      }`}
                    />
                    <span className="font-mono text-[#c2a278] shrink-0">{formatDice(entry.dice)}</span>
                    <span className="text-[#e0d5c1] truncate">{formatSteps(entry.steps)}</span>
                  </div>
                  {entry.isMistake && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                </div>
                {entry.isMistake && entry.betterSteps && (
                  <div className="mt-1.5 pt-1.5 border-t border-rose-900/40 flex items-center gap-1.5 text-[11px]">
                    <span className="text-rose-400/80 uppercase tracking-wider text-[9px] shrink-0">
                      {t('moveReview.betterMove')}
                    </span>
                    <span className="text-rose-200 font-mono truncate">{formatSteps(entry.betterSteps)}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
