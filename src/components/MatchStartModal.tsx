import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, AIDifficulty, Player } from '../types/backgammon';
import { Bot, Users, Trophy, Settings } from 'lucide-react';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle, LedgerToggle, LedgerPill } from './LedgerUI';

interface MatchStartModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartMatch: () => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] tracking-[0.15em] uppercase block mb-2" style={{ color: BRASS }}>
    {children}
  </label>
);

const iconBtn: React.CSSProperties = {
  border: `1px solid rgba(58,42,24,0.25)`,
  background: 'rgba(58,42,24,0.06)',
  color: INK,
};

export const MatchStartModal: React.FC<MatchStartModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onStartMatch,
  onOpenStats,
  onOpenSettings,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const isCubeMode = settings.cubeMode !== 'no_cube';

  return (
    <div
      id="match-start-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto select-none"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="w-full max-w-md rounded-lg p-5 sm:p-6 relative overflow-hidden ledger-scroll"
        style={ledgerCardStyle}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl" style={{ ...serif, fontWeight: 600, color: INK }}>
            {t('matchSetup.title')}
          </h1>

          <div className="flex items-center gap-1.5">
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title={t('matchSetup.settings')}
                className="p-2 rounded-full transition-colors cursor-pointer"
                style={iconBtn}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            {onOpenStats && (
              <button
                type="button"
                onClick={onOpenStats}
                title={t('matchSetup.statistics')}
                className="p-2 rounded-full transition-colors cursor-pointer"
                style={iconBtn}
              >
                <Trophy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Opponent */}
          <section>
            <SectionLabel>{t('matchSetup.opponentSelection')}</SectionLabel>
            <div className="flex gap-2">
              <LedgerPill selected={settings.mode === 'ai'} onClick={() => onUpdateSettings({ mode: 'ai' })}>
                <Bot className="w-3.5 h-3.5" />
                {t('matchSetup.aiOpponent')}
              </LedgerPill>
              <LedgerPill selected={settings.mode === 'local'} onClick={() => onUpdateSettings({ mode: 'local' })}>
                <Users className="w-3.5 h-3.5" />
                {t('matchSetup.passAndPlayTitle')}
              </LedgerPill>
            </div>

            {settings.mode === 'ai' && (
              <div className="mt-3 space-y-3">
                <div>
                  <span className="text-[9px] tracking-[0.15em] uppercase block mb-1.5" style={{ color: INK_MUTED }}>
                    {t('matchSetup.aiDifficultyLevel')}
                  </span>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'easy', label: t('matchSetup.difficultyEasy') },
                      { key: 'medium', label: t('matchSetup.difficultyMedium') },
                      { key: 'hard', label: t('matchSetup.difficultyHard') },
                      { key: 'master', label: t('matchSetup.difficultyMaster') },
                    ].map((diff) => (
                      <LedgerPill
                        key={diff.key}
                        selected={settings.aiDifficulty === diff.key}
                        onClick={() => onUpdateSettings({ aiDifficulty: diff.key as AIDifficulty })}
                        className="py-2 text-[10px]"
                      >
                        {diff.label}
                      </LedgerPill>
                    ))}
                  </div>
                  {settings.aiDifficulty === 'hard' && (
                    <p className="text-[9px] mt-1.5 leading-relaxed" style={{ color: INK_MUTED }}>
                      {t('matchSetup.difficultyHardDesc')}
                    </p>
                  )}
                  {settings.aiDifficulty === 'master' && (
                    <p className="text-[9px] mt-1.5 leading-relaxed" style={{ color: INK_MUTED }}>
                      {t('matchSetup.difficultyMasterDesc')}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[9px] tracking-[0.15em] uppercase block mb-1.5" style={{ color: INK_MUTED }}>
                    {t('matchSetup.yourColor')}
                  </span>
                  <div className="flex gap-1.5">
                    {(['white', 'black'] as Player[]).map((col) => (
                      <LedgerPill
                        key={col}
                        selected={settings.playerColor === col}
                        onClick={() => onUpdateSettings({ playerColor: col })}
                        className="py-2 text-[10px]"
                      >
                        <span
                          className={`w-3 h-3 rounded-full shadow-sm shrink-0 ${
                            col === 'white'
                              ? 'bg-[#f9f3e5] border border-[#d4c5a9]'
                              : 'bg-[#961c1e] border border-[#52090a]'
                          }`}
                        />
                        {col === 'white' ? t('matchSetup.playWhite') : t('matchSetup.playBlack')}
                      </LedgerPill>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Rule Variant */}
          <section>
            <SectionLabel>{t('matchSetup.ruleVariant')}</SectionLabel>
            <div className="flex gap-2">
              <LedgerPill selected={isCubeMode} onClick={() => onUpdateSettings({ cubeMode: 'with_cube' })}>
                {t('matchSetup.doublingCubeTitle')}
              </LedgerPill>
              <LedgerPill selected={!isCubeMode} onClick={() => onUpdateSettings({ cubeMode: 'no_cube' })}>
                {t('matchSetup.standardModeTitle')}
              </LedgerPill>
            </div>
          </section>

          {/* Mistake Flagging Toggle */}
          <section
            className="flex items-center justify-between p-3 rounded-md"
            style={{ background: 'rgba(58,42,24,0.06)', border: `1px solid ${RULE}` }}
          >
            <div>
              <div className="text-xs font-semibold" style={{ ...serif, color: INK }}>
                {t('settings.mistakeFlagging')}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: INK_MUTED }}>
                {t('settings.mistakeFlaggingDesc')}
              </div>
            </div>
            <LedgerToggle
              checked={settings.mistakeFlagging}
              onToggle={() => onUpdateSettings({ mistakeFlagging: !settings.mistakeFlagging })}
            />
          </section>

          {/* Stakes & Match Length */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>{t('matchSetup.matchStakeMode')}</SectionLabel>
              <div className="flex gap-1 -mt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'points' })}
                  className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide transition-colors cursor-pointer"
                  style={
                    settings.stakeType === 'points'
                      ? { color: BRASS, background: 'rgba(163,119,63,0.14)', fontWeight: 600 }
                      : { color: INK_MUTED }
                  }
                >
                  {t('matchSetup.pointsRace')}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'money' })}
                  className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide transition-colors cursor-pointer"
                  style={
                    settings.stakeType === 'money'
                      ? { color: BRASS, background: 'rgba(163,119,63,0.14)', fontWeight: 600 }
                      : { color: INK_MUTED }
                  }
                >
                  {t('matchSetup.moneyStake')}
                </button>
              </div>
            </div>

            {settings.stakeType === 'points' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: INK_MUTED }}>{t('matchSetup.targetMatchPoints')}</span>
                  <span className="font-mono font-bold" style={{ color: BRASS }}>
                    {settings.matchTarget} {t('matchSetup.pointsUnit')}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 3, 5, 7, 11].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => onUpdateSettings({ matchTarget: pts })}
                      className="py-2 rounded-md text-xs font-mono transition-colors cursor-pointer"
                      style={
                        settings.matchTarget === pts
                          ? { background: `linear-gradient(160deg,#cba766,#a3773f)`, color: '#2a1c0e', fontWeight: 700 }
                          : { background: 'rgba(58,42,24,0.06)', color: INK_MUTED, border: `1px solid ${RULE}` }
                      }
                    >
                      {pts}p
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span style={{ color: INK_MUTED }}>{t('matchSetup.stakePerPoint')}</span>
                  <span className="font-mono font-bold" style={{ color: BRASS }}>
                    ${settings.stakePerPoint} / pt
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => onUpdateSettings({ stakePerPoint: amount })}
                      className="py-2 rounded-md text-xs font-mono transition-colors cursor-pointer"
                      style={
                        settings.stakePerPoint === amount
                          ? { background: `linear-gradient(160deg,#cba766,#a3773f)`, color: '#2a1c0e', fontWeight: 700 }
                          : { background: 'rgba(58,42,24,0.06)', color: INK_MUTED, border: `1px solid ${RULE}` }
                      }
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Start Button */}
        <button
          id="btn-start-match"
          type="button"
          onClick={onStartMatch}
          className="w-full mt-6 py-3.5 rounded-md text-xs tracking-[0.2em] uppercase font-bold transition-transform active:scale-[0.98] cursor-pointer"
          style={{
            background: 'linear-gradient(160deg,#cba766,#a3773f)',
            color: '#2a1c0e',
            boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {isCubeMode ? t('matchSetup.startMatchCube') : t('matchSetup.startMatchStandard')}
        </button>
      </motion.div>
    </div>
  );
};
