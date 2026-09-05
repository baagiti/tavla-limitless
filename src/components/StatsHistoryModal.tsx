import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  CareerStats,
  MatchHistoryEntry,
  AIDifficulty,
} from '../types/backgammon';
import {
  X,
  Trophy,
  History,
  Flame,
  TrendingUp,
  Award,
  Bot,
  ChevronDown,
  ChevronUp,
  Trash2,
  Calendar,
  Zap,
} from 'lucide-react';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

interface StatsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CareerStats;
  history: MatchHistoryEntry[];
  onClearData: () => void;
}

const WIN_GREEN = '#2f7a4f';
const LOSS_RED = '#8b1e1e';
const STREAK_AMBER = '#9a6a1f';

const metricCardStyle: React.CSSProperties = {
  background: 'rgba(58,42,24,0.06)',
  border: `1px solid ${RULE}`,
};
const nestedCardStyle: React.CSSProperties = {
  background: 'rgba(58,42,24,0.1)',
  border: `1px solid ${RULE}`,
};

export const StatsHistoryModal: React.FC<StatsHistoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  onClearData,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');
  const [filterMode, setFilterMode] = useState<'all' | 'ai' | 'local'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (filterMode === 'ai') return item.mode === 'ai';
    if (filterMode === 'local') return item.mode === 'local';
    return true;
  });

  const getDifficultyBadge = (diff?: AIDifficulty) => {
    switch (diff) {
      case 'easy':
        return (
          <span
            className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold"
            style={{ background: 'rgba(47,122,79,0.1)', color: WIN_GREEN, border: '1px solid rgba(47,122,79,0.3)' }}
          >
            {t('stats.easyAi')}
          </span>
        );
      case 'medium':
        return (
          <span
            className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold"
            style={{ background: 'rgba(154,106,31,0.12)', color: STREAK_AMBER, border: '1px solid rgba(154,106,31,0.3)' }}
          >
            {t('stats.mediumAi')}
          </span>
        );
      case 'hard':
      case 'master':
      default:
        return (
          <span
            className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold"
            style={{ background: 'rgba(139,30,30,0.08)', color: LOSS_RED, border: '1px solid rgba(139,30,30,0.3)' }}
          >
            {t('stats.hardAi')}
          </span>
        );
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return t('stats.recent');
    }
  };

  return (
    <div
      id="stats-history-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] rounded-lg flex flex-col relative overflow-hidden"
        style={ledgerCardStyle}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${RULE}` }}>
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-md"
              style={{ background: `linear-gradient(160deg,#cba766,#a3773f)`, color: '#2a1c0e' }}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg tracking-tight" style={{ ...serif, fontWeight: 600, color: INK }}>
                {t('stats.title')}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: BRASS }}>
                {t('stats.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors cursor-pointer"
            style={{ color: INK_MUTED }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex px-6 shrink-0" style={{ borderBottom: `1px solid ${RULE}` }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('stats');
              setConfirmClear(false);
            }}
            className="flex items-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer"
            style={
              activeTab === 'stats'
                ? { borderColor: BRASS, color: BRASS, background: 'rgba(58,42,24,0.05)' }
                : { borderColor: 'transparent', color: INK_MUTED }
            }
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('stats.careerOverview')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setConfirmClear(false);
            }}
            className="flex items-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer"
            style={
              activeTab === 'history'
                ? { borderColor: BRASS, color: BRASS, background: 'rgba(58,42,24,0.05)' }
                : { borderColor: 'transparent', color: INK_MUTED }
            }
          >
            <History className="w-4 h-4" />
            <span>{t('stats.matchLog', { n: history.length })}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 ledger-scroll">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Top Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Games */}
                <div className="p-3.5 rounded-md flex flex-col justify-between" style={metricCardStyle}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                    {t('stats.gamesPlayed')}
                  </span>
                  <div className="text-2xl mt-1" style={{ ...serif, fontWeight: 600, color: INK }}>
                    {stats.totalGamesPlayed}
                  </div>
                  <span className="text-[10px] mt-1" style={{ color: BRASS }}>
                    {t('stats.matchesCount', { n: stats.totalMatchesPlayed })}
                  </span>
                </div>

                {/* Win / Loss */}
                <div className="p-3.5 rounded-md flex flex-col justify-between" style={metricCardStyle}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                    {t('stats.wonLost')}
                  </span>
                  <div className="text-2xl mt-1 flex items-baseline gap-1.5" style={{ ...serif, fontWeight: 600 }}>
                    <span style={{ color: WIN_GREEN }}>{stats.gamesWon}</span>
                    <span className="text-xs" style={{ color: INK_MUTED }}>/</span>
                    <span style={{ color: LOSS_RED }}>{stats.gamesLost}</span>
                  </div>
                  <span className="text-[10px] mt-1" style={{ color: WIN_GREEN }}>
                    {t('stats.matchWins', { n: stats.matchesWon })}
                  </span>
                </div>

                {/* Win Percentage */}
                <div className="p-3.5 rounded-md flex flex-col justify-between" style={metricCardStyle}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                    {t('stats.winRate')}
                  </span>
                  <div className="text-2xl mt-1" style={{ ...serif, fontWeight: 600, color: BRASS }}>
                    {stats.totalGamesPlayed > 0 ? `${stats.winPercentage}%` : '0%'}
                  </div>
                  <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: RULE }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${Math.min(100, stats.winPercentage)}%`, background: `linear-gradient(90deg,#cba766,#a3773f)` }}
                    />
                  </div>
                </div>

                {/* Streaks */}
                <div className="p-3.5 rounded-md flex flex-col justify-between" style={metricCardStyle}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                      {t('stats.streak')}
                    </span>
                    <Flame className="w-3.5 h-3.5" style={{ color: STREAK_AMBER }} />
                  </div>
                  <div className="text-2xl mt-1" style={{ ...serif, fontWeight: 600, color: INK }}>
                    {stats.currentStreak}
                    <span className="text-xs font-mono ml-1" style={{ color: INK_MUTED }}>{t('stats.current')}</span>
                  </div>
                  <span className="text-[10px] mt-1" style={{ color: STREAK_AMBER }}>
                    {t('stats.best', { n: stats.longestStreak })}
                  </span>
                </div>
              </div>

              {/* AI Difficulty Performance */}
              <div className="p-4 rounded-md space-y-3" style={metricCardStyle}>
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: `1px solid ${RULE}` }}>
                  <Bot className="w-4 h-4" style={{ color: BRASS }} />
                  <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: INK }}>
                    {t('stats.performanceByDifficulty')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Easy AI */}
                  <div className="p-3 rounded-md" style={nestedCardStyle}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: WIN_GREEN }}>{t('matchSetup.difficultyEasy')}</span>
                      <span className="text-[10px] font-mono" style={{ color: INK_MUTED }}>
                        {t('stats.gamesUnit', { n: stats.byDifficulty.easy.played })}
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between" style={{ color: INK }}>
                      <span>W: {stats.byDifficulty.easy.won}</span>
                      <span>L: {stats.byDifficulty.easy.lost}</span>
                      <span className="font-bold" style={{ color: WIN_GREEN }}>
                        {stats.byDifficulty.easy.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.easy.won / stats.byDifficulty.easy.played) * 100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Medium AI */}
                  <div className="p-3 rounded-md" style={nestedCardStyle}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: STREAK_AMBER }}>{t('matchSetup.difficultyMedium')}</span>
                      <span className="text-[10px] font-mono" style={{ color: INK_MUTED }}>
                        {t('stats.gamesUnit', { n: stats.byDifficulty.medium.played })}
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between" style={{ color: INK }}>
                      <span>W: {stats.byDifficulty.medium.won}</span>
                      <span>L: {stats.byDifficulty.medium.lost}</span>
                      <span className="font-bold" style={{ color: STREAK_AMBER }}>
                        {stats.byDifficulty.medium.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.medium.won / stats.byDifficulty.medium.played) *
                                100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Hard AI */}
                  <div className="p-3 rounded-md" style={nestedCardStyle}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: LOSS_RED }}>{t('stats.hardLabel')}</span>
                      <span className="text-[10px] font-mono" style={{ color: INK_MUTED }}>
                        {t('stats.gamesUnit', { n: stats.byDifficulty.hard.played })}
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between" style={{ color: INK }}>
                      <span>W: {stats.byDifficulty.hard.won}</span>
                      <span>L: {stats.byDifficulty.hard.lost}</span>
                      <span className="font-bold" style={{ color: LOSS_RED }}>
                        {stats.byDifficulty.hard.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.hard.won / stats.byDifficulty.hard.played) * 100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Victory Quality Breakdown */}
              <div className="p-4 rounded-md space-y-3" style={metricCardStyle}>
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: `1px solid ${RULE}` }}>
                  <Award className="w-4 h-4" style={{ color: BRASS }} />
                  <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: INK }}>
                    {t('stats.victoryBreakdown')}
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                  <div className="p-2.5 rounded-md" style={nestedCardStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                      {t('stats.single')}
                    </div>
                    <div className="text-lg mt-0.5" style={{ ...serif, fontWeight: 600, color: INK }}>
                      {stats.singleWins}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-md" style={nestedCardStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: STREAK_AMBER }}>
                      {t('stats.gammon')}
                    </div>
                    <div className="text-lg mt-0.5" style={{ ...serif, fontWeight: 600, color: STREAK_AMBER }}>
                      {stats.gammonWins}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-md" style={nestedCardStyle}>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: BRASS }}>
                      {t('stats.backgammon')}
                    </div>
                    <div className="text-lg mt-0.5" style={{ ...serif, fontWeight: 600, color: BRASS }}>
                      {stats.backgammonWins}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {(['all', 'ai', 'local'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilterMode(mode)}
                      className="px-3 py-1 rounded-md text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                      style={
                        filterMode === mode
                          ? { border: `1px solid ${BRASS}`, background: 'rgba(163,119,63,0.14)', color: BRASS }
                          : { border: `1px solid ${RULE}`, background: 'rgba(58,42,24,0.04)', color: INK_MUTED }
                      }
                    >
                      {mode === 'all' ? t('stats.allMatches') : mode === 'ai' ? t('stats.vsAi') : t('stats.passAndPlay')}
                    </button>
                  ))}
                </div>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    style={{ color: LOSS_RED, opacity: 0.75 }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('stats.clearArchive')}</span>
                  </button>
                )}
              </div>

              {/* Confirm Clear Alert */}
              {confirmClear && (
                <div
                  className="p-3 rounded-md flex items-center justify-between text-xs"
                  style={{ background: 'rgba(139,30,30,0.08)', border: '1px solid rgba(139,30,30,0.3)' }}
                >
                  <span style={{ color: LOSS_RED }}>
                    {t('stats.confirmClear')}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onClearData();
                        setConfirmClear(false);
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
                      style={{ background: LOSS_RED, color: '#f9f3e5' }}
                    >
                      {t('stats.yesReset')}
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                      style={{ background: 'rgba(58,42,24,0.1)', color: INK }}
                    >
                      {t('stats.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* History Match Items */}
              {filteredHistory.length === 0 ? (
                <div
                  className="text-center py-12 rounded-md"
                  style={{ border: `1px dashed ${RULE}`, background: 'rgba(58,42,24,0.03)' }}
                >
                  <History className="w-8 h-8 mx-auto mb-2" style={{ color: BRASS, opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: INK_MUTED }}>{t('stats.noMatches')}</p>
                  <p className="text-[11px] mt-1" style={{ color: INK_MUTED, opacity: 0.7 }}>
                    {t('stats.playToRecord')}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredHistory.map((match) => {
                    const isExpanded = expandedMatchId === match.id;

                    return (
                      <div
                        key={match.id}
                        className="rounded-md overflow-hidden transition-colors"
                        style={metricCardStyle}
                      >
                        {/* Match Summary Bar */}
                        <div
                          onClick={() =>
                            setExpandedMatchId(isExpanded ? null : match.id)
                          }
                          className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            {/* Outcome Badge */}
                            <span
                              className="px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider"
                              style={
                                match.isUserWinner
                                  ? { background: 'rgba(47,122,79,0.1)', color: WIN_GREEN, border: '1px solid rgba(47,122,79,0.3)' }
                                  : { background: 'rgba(139,30,30,0.08)', color: LOSS_RED, border: '1px solid rgba(139,30,30,0.3)' }
                              }
                            >
                              {match.isUserWinner ? t('stats.victory') : t('stats.defeat')}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold" style={{ color: INK }}>
                                  {match.mode === 'ai' ? t('stats.matchVsAi') : t('stats.passAndPlayMatch')}
                                </span>
                                {match.mode === 'ai' && getDifficultyBadge(match.aiDifficulty)}
                                <span
                                  className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase"
                                  style={{ background: 'rgba(58,42,24,0.1)', color: BRASS, border: `1px solid ${RULE}` }}
                                >
                                  {match.cubeMode === 'no_cube' ? t('stats.classic') : t('stats.cube64')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] mt-0.5" style={{ color: INK_MUTED }}>
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(match.date)}</span>
                                <span>•</span>
                                <span>{t('stats.game', { count: match.totalGames })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Score & Expand */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-mono font-bold" style={{ color: BRASS }}>
                                {match.finalScore.white} — {match.finalScore.black}
                              </div>
                              <div className="text-[10px] font-mono" style={{ color: INK_MUTED }}>
                                {match.stakeType === 'points'
                                  ? t('stats.target', { n: match.matchTarget })
                                  : t('stats.stakePerPoint', { n: match.stakePerPoint })}
                              </div>
                            </div>

                            <button style={{ color: INK_MUTED }}>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Key Events & Game Breakdown */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-1 space-y-3"
                              style={{ borderTop: `1px solid ${RULE}`, background: 'rgba(58,42,24,0.04)' }}
                            >
                              {/* Key Events Highlights */}
                              {match.keyEvents && match.keyEvents.length > 0 && (
                                <div>
                                  <span
                                    className="text-[10px] uppercase tracking-wider block mb-1.5 font-semibold flex items-center gap-1"
                                    style={{ color: BRASS }}
                                  >
                                    <Zap className="w-3 h-3" style={{ color: BRASS }} /> {t('stats.keyEvents')}
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {match.keyEvents.map((evt, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded text-[10px]"
                                        style={{ background: 'rgba(58,42,24,0.1)', border: `1px solid ${RULE}`, color: INK }}
                                      >
                                        {evt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Games Breakdown */}
                              {match.games && match.games.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase tracking-wider block" style={{ color: INK_MUTED }}>
                                    {t('stats.individualGames')}
                                  </span>
                                  <div className="space-y-1">
                                    {match.games.map((g, gIdx) => (
                                      <div
                                        key={gIdx}
                                        className="flex items-center justify-between text-[11px] p-2 rounded-md"
                                        style={nestedCardStyle}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono" style={{ color: BRASS }}>
                                            {t('stats.gameN', { n: g.gameNumber })}
                                          </span>
                                          <span className="capitalize" style={{ color: INK }}>
                                            {t('stats.wonBy', { winner: t(`players.${g.winner}`), type: g.winType })}
                                          </span>
                                          {g.cubeValue > 1 && (
                                            <span
                                              className="px-1.5 py-0.2 rounded text-[9px] font-mono"
                                              style={{ background: 'rgba(58,42,24,0.1)', color: BRASS }}
                                            >
                                              {t('stats.cubeValue', { n: g.cubeValue })}
                                            </span>
                                          )}
                                        </div>

                                        <div className="font-mono" style={{ color: INK_MUTED }}>
                                          {t('stats.pointsWon', { n: g.pointsWon * g.cubeValue })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex justify-end shrink-0" style={{ borderTop: `1px solid ${RULE}` }}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md text-xs uppercase tracking-[0.15em] font-semibold transition-transform active:scale-[0.98] cursor-pointer"
            style={{
              background: `linear-gradient(160deg,#cba766,#a3773f)`,
              color: '#2a1c0e',
              boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            {t('stats.close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
