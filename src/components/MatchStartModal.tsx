import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, AIDifficulty, Player } from '../types/backgammon';
import { Bot, Users, Trophy, ShieldCheck, Settings } from 'lucide-react';

interface MatchStartModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartMatch: () => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

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
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 sm:p-7 text-[#e0d5c1] relative overflow-hidden"
      >
        {/* Header */}
        <div className="mb-5 pb-4 border-b border-[#2d1e15] flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f9f3e5] via-[#e5c07b] to-[#c2a278]">
              {t('matchSetup.title')}
            </h1>
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#c2a278]/70">
              {t('matchSetup.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title={t('matchSetup.settings')}
                className="p-1.5 rounded border border-[#3d2b1f] bg-[#201610] text-[#e5c07b] hover:border-[#e5c07b] transition-all cursor-pointer shadow"
              >
                <Settings className="w-4 h-4 text-[#e5c07b]" />
              </button>
            )}
            {onOpenStats && (
              <button
                type="button"
                onClick={onOpenStats}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#3d2b1f] bg-[#201610] text-[#e5c07b] hover:border-[#e5c07b] text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow"
              >
                <Trophy className="w-3.5 h-3.5 text-[#e5c07b]" />
                <span className="hidden sm:inline">{t('matchSetup.statistics')}</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* 1. Game Rule Variant (Doubling Cube vs Standard Mode) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] tracking-[0.15em] uppercase opacity-40 block">
                {t('matchSetup.ruleVariant')}
              </label>
              <span className="text-[10px] text-[#c2a278] font-mono font-medium">
                {isCubeMode ? t('matchSetup.doublingCubeActive') : t('matchSetup.pureClassicMode')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Doubling Cube Mode Button */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ cubeMode: 'with_cube' })}
                className={`p-3 rounded-sm border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isCubeMode
                    ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278] shadow-md'
                    : 'border-[#2d1e15] bg-[#1a130f] opacity-60 hover:opacity-100 hover:border-[#4a3528]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-xs bg-[#c2a278]/20 border border-[#c2a278]/50 flex items-center justify-center text-[10px] font-mono font-bold text-[#c2a278]">
                      64
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {t('matchSetup.doublingCubeTitle')}
                    </span>
                  </div>
                  {isCubeMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2a278] animate-pulse" />
                  )}
                </div>
                <div className="text-[10px] text-[#e0d5c1]/70 leading-relaxed">
                  {t('matchSetup.doublingCubeDesc')}
                </div>
              </button>

              {/* Standard Classic Mode Button (No Cube) */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ cubeMode: 'no_cube' })}
                className={`p-3 rounded-sm border text-left transition-all relative overflow-hidden cursor-pointer ${
                  !isCubeMode
                    ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278] shadow-md'
                    : 'border-[#2d1e15] bg-[#1a130f] opacity-60 hover:opacity-100 hover:border-[#4a3528]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#c2a278]" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {t('matchSetup.standardModeTitle')}
                    </span>
                  </div>
                  {!isCubeMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2a278] animate-pulse" />
                  )}
                </div>
                <div className="text-[10px] text-[#e0d5c1]/70 leading-relaxed">
                  {t('matchSetup.standardModeDesc')}
                </div>
              </button>
            </div>
          </section>

          {/* 2. Opponent Selection */}
          <section>
            <label className="text-[10px] tracking-[0.15em] uppercase opacity-40 block mb-2">
              {t('matchSetup.opponentSelection')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'ai' })}
                className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                  settings.mode === 'ai'
                    ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278]'
                    : 'border-[#2d1e15] bg-[#1a130f] opacity-70 hover:opacity-100 hover:border-[#4a3528]'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Bot className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('matchSetup.aiOpponent')}</span>
                </div>
                <p className="text-[10px] opacity-60">{t('matchSetup.aiOpponentDesc')}</p>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'local' })}
                className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                  settings.mode === 'local'
                    ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278]'
                    : 'border-[#2d1e15] bg-[#1a130f] opacity-70 hover:opacity-100 hover:border-[#4a3528]'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{t('matchSetup.passAndPlayTitle')}</span>
                </div>
                <p className="text-[10px] opacity-60">{t('matchSetup.passAndPlayDesc')}</p>
              </button>
            </div>
          </section>

          {/* AI Settings (Difficulty & Checkers) */}
          {settings.mode === 'ai' && (
            <div className="space-y-3 p-3 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase opacity-40 block mb-1.5">
                  {t('matchSetup.aiDifficultyLevel')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'easy', label: t('matchSetup.difficultyEasy'), desc: t('matchSetup.difficultyEasyDesc') },
                    { key: 'medium', label: t('matchSetup.difficultyMedium'), desc: t('matchSetup.difficultyMediumDesc') },
                    { key: 'hard', label: t('matchSetup.difficultyHard'), desc: t('matchSetup.difficultyHardDesc') },
                  ].map((diff) => {
                    const isSelected =
                      settings.aiDifficulty === diff.key ||
                      (diff.key === 'hard' && settings.aiDifficulty === 'master');

                    return (
                      <button
                        key={diff.key}
                        type="button"
                        onClick={() =>
                          onUpdateSettings({ aiDifficulty: diff.key as AIDifficulty })
                        }
                        className={`p-2 rounded-sm border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278]'
                            : 'border-[#2d1e15] bg-[#140e0a] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="text-xs font-bold uppercase tracking-wider">
                          {diff.label}
                        </div>
                        <div className="text-[9px] opacity-70 leading-tight mt-0.5">
                          {diff.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.15em] uppercase opacity-40 block mb-1.5">
                  {t('matchSetup.yourColor')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['white', 'black'] as Player[]).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => onUpdateSettings({ playerColor: col })}
                      className={`py-1.5 px-3 rounded-sm border text-xs capitalize flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        settings.playerColor === col
                          ? 'border-[#c2a278] bg-[#2d1e15] text-[#c2a278]'
                          : 'border-[#2d1e15] bg-[#140e0a] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full shadow-sm ${
                          col === 'white' ? 'bg-[#f9f3e5] border border-[#d4c5a9]' : 'bg-[#961c1e] border border-[#52090a]'
                        }`}
                      />
                      <span>{col === 'white' ? t('matchSetup.playWhite') : t('matchSetup.playBlack')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stakes & Match Length */}
          <section className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] tracking-[0.15em] uppercase opacity-40">
                {t('matchSetup.matchStakeMode')}
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'points' })}
                  className={`px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    settings.stakeType === 'points'
                      ? 'border border-[#c2a278] text-[#c2a278] bg-[#2d1e15]'
                      : 'text-[#e0d5c1]/50 hover:text-[#e0d5c1]'
                  }`}
                >
                  {t('matchSetup.pointsRace')}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ stakeType: 'money' })}
                  className={`px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                    settings.stakeType === 'money'
                      ? 'border border-[#c2a278] text-[#c2a278] bg-[#2d1e15]'
                      : 'text-[#e0d5c1]/50 hover:text-[#e0d5c1]'
                  }`}
                >
                  {t('matchSetup.moneyStake')}
                </button>
              </div>
            </div>

            {settings.stakeType === 'points' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="opacity-70">{t('matchSetup.targetMatchPoints')}</span>
                  <span className="font-mono text-[#c2a278] font-bold">{settings.matchTarget} {t('matchSetup.pointsUnit')}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 3, 5, 7, 11].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => onUpdateSettings({ matchTarget: pts })}
                      className={`py-1.5 rounded-sm border text-xs font-mono transition-all cursor-pointer ${
                        settings.matchTarget === pts
                          ? 'border-[#c2a278] bg-[#c2a278] text-[#140e0a] font-bold'
                          : 'border-[#2d1e15] bg-[#140e0a] text-[#e0d5c1]/70 hover:border-[#4a3528]'
                      }`}
                    >
                      {pts}p
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="opacity-70">{t('matchSetup.stakePerPoint')}</span>
                  <span className="font-mono text-[#c2a278] font-bold">${settings.stakePerPoint} / pt</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => onUpdateSettings({ stakePerPoint: amount })}
                      className={`py-1.5 rounded-sm border text-xs font-mono transition-all cursor-pointer ${
                        settings.stakePerPoint === amount
                          ? 'border-[#c2a278] bg-[#c2a278] text-[#140e0a] font-bold'
                          : 'border-[#2d1e15] bg-[#140e0a] text-[#e0d5c1]/70 hover:border-[#4a3528]'
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
          className="w-full mt-5 py-3 border border-[#c2a278] text-[#c2a278] text-xs tracking-[0.2em] uppercase hover:bg-[#c2a278] hover:text-[#140e0a] transition-colors font-semibold cursor-pointer shadow-lg"
        >
          {isCubeMode ? t('matchSetup.startMatchCube') : t('matchSetup.startMatchStandard')}
        </button>
      </motion.div>
    </div>
  );
};

