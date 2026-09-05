import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, MoveLogEntry, MoveStep } from '../types/backgammon';
import { X, AlertTriangle, ClipboardList, ChevronDown } from 'lucide-react';
import { MiniBoardDiagram } from './MiniBoardDiagram';
import { analyzeBestTurn, evaluateThreePly, replayTurn, MISTAKE_EQUITY_THRESHOLD } from '../logic/ai';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

interface MoveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveLog: MoveLogEntry[];
  settings: GameSettings;
  onUpdateMoveLog: (next: MoveLogEntry[]) => void;
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

const MISTAKE_RED = '#8b1e1e';

export const MoveReviewModal: React.FC<MoveReviewModalProps> = ({
  isOpen,
  onClose,
  moveLog,
  settings,
  onUpdateMoveLog,
}) => {
  const { t } = useTranslation();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [analyzeProgress, setAnalyzeProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const isAnalyzing = analyzeProgress !== null;
  const allDeepChecked = moveLog.length > 0 && moveLog.every((m) => m.deepChecked);

  // Move Review always shows the engine's strongest read of the match, not a
  // quick live estimate — so opening it re-checks every turn with the full
  // 3-ply search (see analyzeBestTurn) instead of waiting for a separate
  // button. Runs one turn at a time with a yield in between so the progress
  // bar can actually paint — a full match can take real seconds to tens of
  // seconds, and there's no time pressure once the match is over.
  useEffect(() => {
    if (!isOpen || allDeepChecked || isAnalyzing || moveLog.length === 0) return;

    let cancelled = false;

    const runDeepAnalysis = async () => {
      setAnalyzeProgress({ current: 0, total: moveLog.length });
      const updated = [...moveLog];

      for (let i = 0; i < updated.length; i++) {
        if (cancelled) return;
        const entry = updated[i];
        const deep = analyzeBestTurn(entry.boardBefore, entry.player, entry.dice);
        if (deep) {
          const playedBoard = replayTurn(entry.boardBefore, entry.steps);
          // Score the played move at the same depth as the candidates above —
          // comparing this against a plain 0-ply evaluateBoard would measure
          // two different things and flag nearly every turn as a mistake.
          const actualEquity = evaluateThreePly(playedBoard, entry.player);
          const isMistake = deep.bestEquity - actualEquity > MISTAKE_EQUITY_THRESHOLD;
          updated[i] = {
            ...entry,
            isMistake,
            betterSteps: isMistake ? deep.bestSeq.steps : undefined,
            deepChecked: true,
          };
        } else {
          updated[i] = { ...entry, deepChecked: true };
        }

        onUpdateMoveLog([...updated]);
        setAnalyzeProgress({ current: i + 1, total: updated.length });
        // Yield to the browser so the progress bar renders between turns
        // instead of the whole analysis running in one blocking tick.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (!cancelled) setAnalyzeProgress(null);
    };

    runDeepAnalysis();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, allDeepChecked]);

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
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-lg relative overflow-hidden"
        style={ledgerCardStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1 cursor-pointer z-10"
          style={{ color: INK_MUTED }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-3 shrink-0" style={{ borderBottom: `1px solid ${RULE}` }}>
          <h3 className="text-xl flex items-center gap-2" style={{ ...serif, fontWeight: 600, color: INK }}>
            <ClipboardList className="w-4 h-4" style={{ color: BRASS }} />
            {t('moveReview.title')}
          </h3>
          <p className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: BRASS }}>
            {mistakeCount > 0
              ? t('moveReview.subtitleWithMistakes', { count: mistakeCount, total: moveLog.length })
              : t('moveReview.subtitleClean', { total: moveLog.length })}
          </p>

          {isAnalyzing && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px]" style={{ color: BRASS }}>
                {t('moveReview.analyzing', {
                  current: analyzeProgress!.current,
                  total: analyzeProgress!.total,
                })}
              </p>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: RULE }}>
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${(analyzeProgress!.current / analyzeProgress!.total) * 100}%`,
                    background: `linear-gradient(90deg,#cba766,#a3773f)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto p-4 space-y-1.5 flex-1 ledger-scroll">
          {moveLog.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: INK_MUTED }}>{t('moveReview.empty')}</p>
          ) : (
            moveLog.map((entry, idx) => {
              const canExpand = entry.isMistake && !!entry.betterSteps;
              const isExpanded = canExpand && expandedIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-md border text-xs overflow-hidden"
                  style={
                    entry.isMistake
                      ? { borderColor: 'rgba(139,30,30,0.35)', background: 'rgba(139,30,30,0.06)' }
                      : { borderColor: RULE, background: 'rgba(58,42,24,0.04)' }
                  }
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
                        <span className="font-mono shrink-0" style={{ color: BRASS }}>{formatDice(entry.dice)}</span>
                        <span className="truncate" style={{ color: INK }}>{formatSteps(entry.steps)}</span>
                      </div>
                      {entry.isMistake && (
                        <div className="flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3.5 h-3.5" style={{ color: MISTAKE_RED }} />
                          {canExpand && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ color: MISTAKE_RED, opacity: 0.7 }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {entry.isMistake && entry.betterSteps && (
                      <div
                        className="mt-1.5 pt-1.5 flex items-center gap-1.5 text-[11px]"
                        style={{ borderTop: '1px solid rgba(139,30,30,0.25)' }}
                      >
                        <span className="uppercase tracking-wider text-[9px] shrink-0" style={{ color: MISTAKE_RED, opacity: 0.85 }}>
                          {t('moveReview.betterMove')}
                        </span>
                        <span className="font-mono truncate" style={{ color: MISTAKE_RED }}>{formatSteps(entry.betterSteps)}</span>
                      </div>
                    )}
                    {canExpand && !isExpanded && (
                      <div className="mt-1 text-[9px] uppercase tracking-wider" style={{ color: MISTAKE_RED, opacity: 0.6 }}>
                        {t('moveReview.tapToCompare')}
                      </div>
                    )}
                  </div>

                  {isExpanded && entry.betterSteps && (
                    <div
                      className="px-2.5 pb-3 pt-2 space-y-3"
                      style={{ borderTop: '1px solid rgba(139,30,30,0.25)', background: 'rgba(58,42,24,0.04)' }}
                    >
                      <div>
                        <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: MISTAKE_RED }}>
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
                        <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#2f7a4f' }}>
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
