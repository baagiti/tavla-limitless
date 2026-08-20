import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, AIDifficulty, Player } from '../types/backgammon';
import { Bot, Users, Trophy, Settings } from 'lucide-react';

interface MatchStartModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartMatch: () => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

const segBase =
  'flex-1 py-2.5 px-2 rounded-sm border text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5';
const segActive = 'border-[#c2a278] bg-[#c2a278] text-[#140e0a]';
const segInactive = 'border-[#2d1e15] bg-[#1a130f] text-[#e0d5c1]/70 hover:border-[#4a3528] hover:text-[#e0d5c1]';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] tracking-[0.15em] uppercase text-[#c2a278]/60 block mb-2">{children}</label>
);

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
        className="w-full max-w-md bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-5 sm:p-6 text-[#e0d5c1] relative overflow-hidden"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-[#f9f3e5]">
            {t('matchSetup.title')}
          </h1>

          <div className="flex items-center gap-1.5">
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title={t('matchSetup.settings')}
                className="p-2 rounded-sm border border-[#2d1e15] bg-[#1a130f] text-[#c2a278] hover:border-[#c2a278] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            {onOpenStats && (
              <button
                type="button"
                onClick={onOpenStats}
                title={t('matchSetup.statistics')}
                className="p-2 rounded-sm border border-[#2d1e15] bg-[#1a130f] text-[#c2a278] hover:border-[#c2a278] transition-colors cursor-pointer"
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
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'ai' })}
                className={`${segBase} ${settings.mode === 'ai' ? segActive : segInactive}`}
              >
                <Bot className="w-3.5 h-3.5" />
                {t('matchSetup.aiOpponent')}
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'local' })}
                className={`${segBase} ${settings.mode === 'local' ? segActive : segInactive}`}
              >
                <Users className="w-3.5 h-3.5" />
                {t('matchSetup.passAndPlayTitle')}
              </button>
            </div>

            {settings.mode === 'ai' && (
              <div className="mt-3 space-y-3">
                <div>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#e0d5c1]/40 block mb-1.5">
                    {t('matchSetup.aiDifficultyLevel')}
                  </span>
                  <div className="flex gap-1.5">
                    {[
                      { key: 'easy', label: t('matchSetup.difficultyEasy') },
                      { key: 'medium', label: t('matchSetup.difficultyMedium') },
                      { key: 'hard', label: t('matchSetup.difficultyHard') },
                    ].map((diff) => {
                      const isSelected =
                        settings.aiDifficulty === diff.key ||
                        (diff.key === 'hard' && settings.aiDifficulty === 'master');
                      return (
                        <button
                          key={diff.key}
                          type="button"
                          onClick={() => onUpdateSettings({ aiDifficulty: diff.key as AIDifficulty })}
                          className={`${segBase} py-2 text-[10px] ${isSelected ? segActive : segInactive}`}
                        >
                          {diff.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#e0d5c1]/40 block mb-1.5">
                    {t('matchSetup.yourColor')}
                  </span>
                  <div className="flex gap-1.5">
                    {(['white', 'black'] as Player[]).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => onUpdateSettings({ playerColor: col })}
                        className={`${segBase} py-2 text-[10px] ${
                          settings.playerColor === col ? segActive : segInactive
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shadow-sm shrink-0 ${
                            col === 'white'
                              ? 'bg-[#f9f3e5] border border-[#d4c5a9]'
                              : 'bg-[#961c1e] border border-[#52090a]'
                          }`}
                        />
                        {col === 'white' ? t('matchSetup.playWhite') : t('matchSetup.playBlack')}
                      </button>
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
              <button
                type="button"
                onClick={() => onUpdateSettings({ cubeMode: 'with_cube' })}
                className={`${segBase} ${isCubeMode ? segActive : segInactive}`}
              >
                {t('matchSetup.doublingCubeTitle')}
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ cubeMode: 'no_cube' })}
                className={`${segBase} ${!isCubeMode ? segActive : segInactive}`}
              >
                {t('matchSetup.standardModeTitle')}
              </button>
            </div>
          </section>

          {/* Mistake Flagging Toggle */}
          <section className="flex items-center justify-between p-3 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.mistakeFlagging')}</div>
              <div className="text-[9px] opacity-50 mt-0.5">{t('settings.mistakeFlaggingDesc')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.mistakeFlagging}
              onClick={() => onUpdateSettings({ mistakeFlagging: !settings.mistakeFlagging })}
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer shrink-0 ${
                settings.mistakeFlagging ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.mistakeFlagging
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </section>

          {/* Stakes & Match Length */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>{t('matchSetup.matchStakeMode')}</SectionLabel>
              <div className="flex gap-1 -mt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'points' })}
                  className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wide transition-colors cursor-pointer ${
                    settings.stakeType === 'points'
                      ? 'border border-[#c2a278] text-[#c2a278] bg-[#2d1e15]'
                      : 'text-[#e0d5c1]/40 hover:text-[#e0d5c1]'
                  }`}
                >
                  {t('matchSetup.pointsRace')}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'money' })}
                  className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wide transition-colors cursor-pointer ${
                    settings.stakeType === 'money'
                      ? 'border border-[#c2a278] text-[#c2a278] bg-[#2d1e15]'
                      : 'text-[#e0d5c1]/40 hover:text-[#e0d5c1]'
                  }`}
                >
                  {t('matchSetup.moneyStake')}
                </button>
              </div>
            </div>

            {settings.stakeType === 'points' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#e0d5c1]/50">{t('matchSetup.targetMatchPoints')}</span>
                  <span className="font-mono text-[#c2a278] font-bold">
                    {settings.matchTarget} {t('matchSetup.pointsUnit')}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 3, 5, 7, 11].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => onUpdateSettings({ matchTarget: pts })}
                      className={`py-2 rounded-sm border text-xs font-mono transition-colors cursor-pointer ${
                        settings.matchTarget === pts
                          ? 'border-[#c2a278] bg-[#c2a278] text-[#140e0a] font-bold'
                          : 'border-[#2d1e15] bg-[#1a130f] text-[#e0d5c1]/60 hover:border-[#4a3528]'
                      }`}
                    >
                      {pts}p
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#e0d5c1]/50">{t('matchSetup.stakePerPoint')}</span>
                  <span className="font-mono text-[#c2a278] font-bold">${settings.stakePerPoint} / pt</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => onUpdateSettings({ stakePerPoint: amount })}
                      className={`py-2 rounded-sm border text-xs font-mono transition-colors cursor-pointer ${
                        settings.stakePerPoint === amount
                          ? 'border-[#c2a278] bg-[#c2a278] text-[#140e0a] font-bold'
                          : 'border-[#2d1e15] bg-[#1a130f] text-[#e0d5c1]/60 hover:border-[#4a3528]'
                      }`}
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
          className="w-full mt-6 py-3 rounded-sm border border-[#c2a278] bg-[#c2a278] text-[#140e0a] text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#d6b78d] transition-colors cursor-pointer shadow-lg"
        >
          {isCubeMode ? t('matchSetup.startMatchCube') : t('matchSetup.startMatchStandard')}
        </button>
      </motion.div>
    </div>
  );
};
