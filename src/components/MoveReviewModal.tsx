import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, MoveLogEntry, MoveStep } from '../types/backgammon';
import { X, AlertTriangle, ClipboardList, ChevronDown } from 'lucide-react';
import { MiniBoardDiagram } from './MiniBoardDiagram';

interface MoveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveLog: MoveLogEntry[];
  settings: GameSettings;
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

export const MoveReviewModal: React.FC<MoveReviewModalProps> = ({
  isOpen,
  onClose,
  moveLog,
  settings,
}) => {
  const { t } = useTranslation();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
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
            moveLog.map((entry, idx) => {
              const canExpand = entry.isMistake && !!entry.betterSteps;
              const isExpanded = canExpand && expandedIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-sm border text-xs overflow-hidden ${
                    entry.isMistake
                      ? 'border-rose-800/50 bg-rose-950/20'
                      : 'border-[#2d1e15] bg-[#1a130f]'
                  }`}
                >
                  <div
                    className={`p-2.5 ${canExpand ? 'cursor-pointer' : ''}`}
                    onClick={() => canExpand && setExpandedIdx(isExpanded ? null : idx)}
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
                        <div className="flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          {canExpand && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-rose-400/70 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
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
                    {canExpand && !isExpanded && (
                      <div className="mt-1 text-[9px] uppercase tracking-wider text-rose-400/50">
                        {t('moveReview.tapToCompare')}
                      </div>
                    )}
                  </div>

                  {isExpanded && entry.betterSteps && (
                    <div className="px-2.5 pb-3 pt-1 border-t border-rose-900/40 space-y-3 bg-black/20">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-rose-400/80 mb-1">
                          {t('moveReview.yourMove')} — {formatSteps(entry.steps)}
                        </div>
                        <MiniBoardDiagram
                          board={entry.boardBefore}
                          steps={entry.steps}
                          highlightColor="#f43f5e"
                          settings={settings}
                        />
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-emerald-400/80 mb-1">
                          {t('moveReview.betterMove')} {formatSteps(entry.betterSteps)}
                        </div>
                        <MiniBoardDiagram
                          board={entry.boardBefore}
                          steps={entry.betterSteps}
                          highlightColor="#34d399"
                          settings={settings}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
