import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, BoardTheme, CheckerTheme } from '../types/backgammon';
import { X, Flag } from 'lucide-react';
import { BOARD_THEMES, CHECKER_PAIRS, getActiveCheckerPair } from '../utils/themes';
import { LanguageSwitcher } from './LanguageSwitcher';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle, LedgerToggle } from './LedgerUI';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResign: () => void;
}

function LedgerRow({
  label,
  value,
  description,
  children,
}: {
  label: string;
  value?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-3.5 flex items-center justify-between gap-3" style={{ borderBottom: `1px solid ${RULE}` }}>
      <div className="min-w-0">
        <div className="text-[13.5px]" style={{ ...serif, fontWeight: 600, color: INK }}>
          {label}
        </div>
        {description && (
          <div className="text-[10.5px] mt-0.5" style={{ color: INK_MUTED }}>
            {description}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <span className="text-[11px]" style={{ color: BRASS, fontWeight: 500 }}>
            {value}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onResign,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const boardKey = settings.boardTheme || 'royal_green';
  const boardName = t(`themes.board.${boardKey}.name`, { defaultValue: BOARD_THEMES[boardKey]?.name }).split(
    ' ('
  )[0];

  const checkerLabel =
    settings.checkerTheme && settings.checkerTheme !== 'auto'
      ? t(`themes.checker.${settings.checkerTheme}.name`, {
          defaultValue: CHECKER_PAIRS[settings.checkerTheme]?.name,
        }).split(' & ')[0]
      : t('settings.autoLabel').split(' (')[0];

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-lg relative ledger-scroll"
        style={ledgerCardStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1 cursor-pointer z-10"
          style={{ color: INK_MUTED }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-6 pb-4">
          <h3 className="text-xl" style={{ ...serif, fontWeight: 600, color: INK }}>
            {t('settings.title')}
          </h3>
          <p className="text-[9.5px] tracking-[0.22em] uppercase mt-1" style={{ color: BRASS }}>
            {t('settings.subtitle')}
          </p>
        </div>

        <div className="px-6 pb-6">
          <LedgerRow label={t('header.language')}>
            <LanguageSwitcher />
          </LedgerRow>

          {/* Board theme */}
          <div className="py-3.5" style={{ borderBottom: `1px solid ${RULE}` }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[13.5px]" style={{ ...serif, fontWeight: 600, color: INK }}>
                {t('settings.boardTheme')}
              </div>
              <span className="text-[11px]" style={{ color: BRASS, fontWeight: 500 }}>
                {boardName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {(Object.keys(BOARD_THEMES) as BoardTheme[]).map((themeKey) => {
                const theme = BOARD_THEMES[themeKey];
                const themeName = t(`themes.board.${themeKey}.name`, { defaultValue: theme.name });
                const isSelected = boardKey === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    title={themeName}
                    onClick={() => onUpdateSettings({ boardTheme: themeKey })}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform"
                    style={{
                      background: theme.fieldBg,
                      boxShadow: isSelected
                        ? `0 0 0 2px #f5eddb, 0 0 0 3.5px ${BRASS}`
                        : '0 0 0 1px rgba(58,42,24,0.25)',
                      transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: theme.pointDarkStroke }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checker material */}
          <div className="py-3.5" style={{ borderBottom: `1px solid ${RULE}` }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[13.5px]" style={{ ...serif, fontWeight: 600, color: INK }}>
                {t('settings.checkerTheme')}
              </div>
              <span className="text-[11px] truncate max-w-[150px]" style={{ color: BRASS, fontWeight: 500 }}>
                {checkerLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {(() => {
                const autoPair = getActiveCheckerPair(boardKey, 'auto');
                const isAutoSelected = !settings.checkerTheme || settings.checkerTheme === 'auto';
                return (
                  <button
                    type="button"
                    title={t('settings.autoLabel')}
                    onClick={() => onUpdateSettings({ checkerTheme: 'auto' })}
                    className="relative w-8 h-8 shrink-0 cursor-pointer transition-transform"
                    style={{ transform: isAutoSelected ? 'scale(1.06)' : 'scale(1)' }}
                  >
                    <span
                      className="absolute left-0 top-0 w-6 h-6 rounded-full"
                      style={{
                        background: autoPair.white.avatarBg,
                        boxShadow: isAutoSelected
                          ? `0 0 0 2px #f5eddb, 0 0 0 3.5px ${BRASS}`
                          : '0 0 0 1px rgba(58,42,24,0.25)',
                      }}
                    />
                    <span
                      className="absolute right-0 bottom-0 w-6 h-6 rounded-full"
                      style={{
                        background: autoPair.black.avatarBg,
                        boxShadow: isAutoSelected
                          ? `0 0 0 2px #f5eddb, 0 0 0 3.5px ${BRASS}`
                          : '0 0 0 1px rgba(58,42,24,0.25)',
                      }}
                    />
                  </button>
                );
              })()}
              {(Object.keys(CHECKER_PAIRS) as Exclude<CheckerTheme, 'auto'>[]).map((pairKey) => {
                const pair = CHECKER_PAIRS[pairKey];
                const pairName = t(`themes.checker.${pairKey}.name`, { defaultValue: pair.name });
                const isSelected = settings.checkerTheme === pairKey;
                return (
                  <button
                    key={pairKey}
                    type="button"
                    title={pairName}
                    onClick={() => onUpdateSettings({ checkerTheme: pairKey })}
                    className="relative w-8 h-8 shrink-0 cursor-pointer transition-transform"
                    style={{ transform: isSelected ? 'scale(1.06)' : 'scale(1)' }}
                  >
                    <span
                      className="absolute left-0 top-0 w-6 h-6 rounded-full"
                      style={{
                        background: pair.white.avatarBg,
                        boxShadow: isSelected
                          ? `0 0 0 2px #f5eddb, 0 0 0 3.5px ${BRASS}`
                          : '0 0 0 1px rgba(58,42,24,0.25)',
                      }}
                    />
                    <span
                      className="absolute right-0 bottom-0 w-6 h-6 rounded-full"
                      style={{
                        background: pair.black.avatarBg,
                        boxShadow: isSelected
                          ? `0 0 0 2px #f5eddb, 0 0 0 3.5px ${BRASS}`
                          : '0 0 0 1px rgba(58,42,24,0.25)',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <LedgerRow label={t('settings.soundEffects')} description={t('settings.soundEffectsDesc')}>
            <LedgerToggle
              checked={settings.soundEnabled}
              onToggle={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            />
          </LedgerRow>

          <LedgerRow label={t('settings.highlightMoves')} description={t('settings.highlightMovesDesc')}>
            <LedgerToggle
              checked={settings.highlightMoves}
              onToggle={() => onUpdateSettings({ highlightMoves: !settings.highlightMoves })}
            />
          </LedgerRow>

          <LedgerRow
            label={t('settings.pipCount')}
            description={settings.showPipCount !== false ? t('settings.pipCountDesc') : t('settings.pipCountDescOff')}
          >
            <LedgerToggle
              checked={settings.showPipCount !== false}
              onToggle={() => onUpdateSettings({ showPipCount: settings.showPipCount === false })}
            />
          </LedgerRow>

          <LedgerRow label={t('settings.mirrorView')} description={t('settings.mirrorViewDesc')}>
            <LedgerToggle
              checked={settings.bearingDirection === 'clockwise'}
              onToggle={() =>
                onUpdateSettings({
                  bearingDirection: settings.bearingDirection === 'counterclockwise' ? 'clockwise' : 'counterclockwise',
                })
              }
            />
          </LedgerRow>

          <LedgerRow
            label={t('settings.doublingCubeToggle')}
            description={
              settings.cubeMode !== 'no_cube' ? t('settings.doublingCubeEnabled') : t('settings.doublingCubeDisabled')
            }
          >
            <LedgerToggle
              checked={settings.cubeMode !== 'no_cube'}
              onToggle={() => onUpdateSettings({ cubeMode: settings.cubeMode === 'no_cube' ? 'with_cube' : 'no_cube' })}
            />
          </LedgerRow>

          <LedgerRow label={t('settings.mistakeFlagging')} description={t('settings.mistakeFlaggingDesc')}>
            <LedgerToggle
              checked={settings.mistakeFlagging}
              onToggle={() => onUpdateSettings({ mistakeFlagging: !settings.mistakeFlagging })}
            />
          </LedgerRow>

          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onResign();
              }}
              className="w-full py-3 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              style={{
                border: '1px solid rgba(139,30,30,0.35)',
                color: '#7a231f',
                background: 'rgba(139,30,30,0.06)',
              }}
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">{t('settings.resign')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
