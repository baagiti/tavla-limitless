import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { GameSettings, BearingDirection, BoardTheme, CheckerTheme } from '../types/backgammon';
import { X, Flag, Palette, CircleDot, Languages } from 'lucide-react';
import { BOARD_THEMES, CHECKER_PAIRS, getActiveCheckerPair } from '../utils/themes';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResign: () => void;
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

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 text-[#e0d5c1] relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#e0d5c1]/50 hover:text-[#e0d5c1] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-3 border-b border-[#2d1e15]">
          <h3 className="text-xl font-serif text-[#c2a278]">{t('settings.title')}</h3>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
            {t('settings.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Language Selection */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#c2a278]" />
              <span className="text-xs font-semibold text-[#f9f3e5]">{t('header.language')}</span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Board Color Theme Selection */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#c2a278]" />
                <span className="text-xs font-semibold text-[#f9f3e5]">{t('settings.boardTheme')}</span>
              </div>
              <span className="text-[10px] text-[#c2a278]/80 font-medium">
                {(() => {
                  const key = settings.boardTheme || 'royal_green';
                  return t(`themes.board.${key}.name`, { defaultValue: BOARD_THEMES[key]?.name });
                })()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(BOARD_THEMES) as BoardTheme[]).map((themeKey) => {
                const theme = BOARD_THEMES[themeKey];
                const themeName = t(`themes.board.${themeKey}.name`, { defaultValue: theme.name });
                const themeDesc = t(`themes.board.${themeKey}.description`, { defaultValue: theme.description });
                const isSelected = (settings.boardTheme || 'royal_green') === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => onUpdateSettings({ boardTheme: themeKey })}
                    className={`p-2 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e5c07b] bg-[#2a1e16] ring-1 ring-[#e5c07b]/60'
                        : 'border-[#2d1e15] bg-[#140e0a] hover:border-[#4a3528]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Swatch preview */}
                      <div
                        className="w-4 h-4 rounded-sm border border-black/40 shadow-inner flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: theme.fieldBg }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.pointDarkStroke }}
                        />
                      </div>
                      <span className={`text-[11px] font-semibold ${isSelected ? 'text-[#e5c07b]' : 'text-[#e0d5c1]'}`}>
                        {themeName.split(' (')[0]}
                      </span>
                    </div>
                    <span className="text-[9px] opacity-50 line-clamp-1">{themeDesc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checker / Stone Color Theme Selection */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-[#e5c07b]" />
                <span className="text-xs font-semibold text-[#f9f3e5]">{t('settings.checkerTheme')}</span>
              </div>
              <span className="text-[10px] text-[#e5c07b]/80 font-medium truncate max-w-[150px]">
                {settings.checkerTheme && settings.checkerTheme !== 'auto'
                  ? t(`themes.checker.${settings.checkerTheme}.name`, {
                      defaultValue: CHECKER_PAIRS[settings.checkerTheme]?.name,
                    }).split(' & ')[0] + ' & ...'
                  : t('settings.autoMatched')}
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Option: Auto (Theme Matched) */}
              {(() => {
                const autoPair = getActiveCheckerPair(settings.boardTheme || 'royal_green', 'auto');
                const isAutoSelected = !settings.checkerTheme || settings.checkerTheme === 'auto';
                return (
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ checkerTheme: 'auto' })}
                    className={`w-full p-2 rounded-sm border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isAutoSelected
                        ? 'border-[#e5c07b] bg-[#2a1e16] ring-1 ring-[#e5c07b]/60'
                        : 'border-[#2d1e15] bg-[#140e0a] hover:border-[#4a3528]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1.5">
                        <div
                          className="w-4 h-4 rounded-full border shadow-sm"
                          style={{
                            background: autoPair.white.avatarBg,
                            borderColor: autoPair.white.avatarBorder,
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border shadow-sm"
                          style={{
                            background: autoPair.black.avatarBg,
                            borderColor: autoPair.black.avatarBorder,
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-semibold ${isAutoSelected ? 'text-[#e5c07b]' : 'text-[#e0d5c1]'}`}>
                          {t('settings.autoLabel')}
                        </span>
                        <span className="text-[9px] opacity-50">
                          {t(`themes.checker.${autoPair.id}.whiteName`, { defaultValue: autoPair.whiteName })} &{' '}
                          {t(`themes.checker.${autoPair.id}.blackName`, { defaultValue: autoPair.blackName })}
                        </span>
                      </div>
                    </div>
                    {isAutoSelected && (
                      <span className="text-[9px] text-[#e5c07b] font-mono font-bold bg-[#e5c07b]/10 px-1.5 py-0.5 rounded border border-[#e5c07b]/30">
                        {t('settings.active')}
                      </span>
                    )}
                  </button>
                );
              })()}

              {/* Preset Pairs */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {(Object.keys(CHECKER_PAIRS) as Exclude<CheckerTheme, 'auto'>[]).map((pairKey) => {
                  const pair = CHECKER_PAIRS[pairKey];
                  const pairName = t(`themes.checker.${pairKey}.name`, { defaultValue: pair.name });
                  const pairBlackName = t(`themes.checker.${pairKey}.blackName`, { defaultValue: pair.blackName });
                  const isSelected = settings.checkerTheme === pairKey;
                  return (
                    <button
                      key={pairKey}
                      type="button"
                      onClick={() => onUpdateSettings({ checkerTheme: pairKey })}
                      className={`p-2 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#e5c07b] bg-[#2a1e16] ring-1 ring-[#e5c07b]/60'
                          : 'border-[#2d1e15] bg-[#140e0a] hover:border-[#4a3528]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <div
                            className="w-3.5 h-3.5 rounded-full border shadow-sm"
                            style={{
                              background: pair.white.avatarBg,
                              borderColor: pair.white.avatarBorder,
                            }}
                          />
                          <div
                            className="w-3.5 h-3.5 rounded-full border shadow-sm"
                            style={{
                              background: pair.black.avatarBg,
                              borderColor: pair.black.avatarBorder,
                            }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold truncate ${isSelected ? 'text-[#e5c07b]' : 'text-[#e0d5c1]'}`}>
                          {pairName.split(' & ')[0]}
                        </span>
                      </div>
                      <span className="text-[9px] opacity-50 truncate">{pairBlackName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.soundEffects')}</div>
              <div className="text-[10px] opacity-50">{t('settings.soundEffectsDesc')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.soundEnabled
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </div>

          {/* Move Highlights */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.highlightMoves')}</div>
              <div className="text-[10px] opacity-50">{t('settings.highlightMovesDesc')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.highlightMoves}
              onClick={() => onUpdateSettings({ highlightMoves: !settings.highlightMoves })}
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                settings.highlightMoves ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.highlightMoves
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </div>

          {/* Show Pip Count Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.pipCount')}</div>
              <div className="text-[10px] opacity-50">
                {settings.showPipCount !== false ? t('settings.pipCountDesc') : t('settings.pipCountDescOff')}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showPipCount !== false}
              onClick={() => onUpdateSettings({ showPipCount: settings.showPipCount === false })}
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                settings.showPipCount !== false ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.showPipCount !== false
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </div>

          {/* Mirror View */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.mirrorView')}</div>
              <div className="text-[10px] opacity-50">{t('settings.mirrorViewDesc')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.bearingDirection === 'clockwise'}
              onClick={() =>
                onUpdateSettings({
                  bearingDirection:
                    settings.bearingDirection === 'counterclockwise'
                      ? 'clockwise'
                      : 'counterclockwise',
                })
              }
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                settings.bearingDirection === 'clockwise' ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.bearingDirection === 'clockwise'
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </div>

          {/* Doubling Cube Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.doublingCubeToggle')}</div>
              <div className="text-[10px] opacity-50">
                {settings.cubeMode !== 'no_cube' ? t('settings.doublingCubeEnabled') : t('settings.doublingCubeDisabled')}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.cubeMode !== 'no_cube'}
              onClick={() =>
                onUpdateSettings({
                  cubeMode: settings.cubeMode === 'no_cube' ? 'with_cube' : 'no_cube',
                })
              }
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
                settings.cubeMode !== 'no_cube' ? 'bg-[#c2a278]' : 'bg-[#2d1e15]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  settings.cubeMode !== 'no_cube'
                    ? 'translate-x-5 bg-[#140e0a]'
                    : 'translate-x-0 bg-[#c2a278]'
                }`}
              />
            </button>
          </div>

          {/* Mistake Flagging Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div>
              <div className="text-xs font-semibold text-[#f9f3e5]">{t('settings.mistakeFlagging')}</div>
              <div className="text-[10px] opacity-50">{t('settings.mistakeFlaggingDesc')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.mistakeFlagging}
              onClick={() => onUpdateSettings({ mistakeFlagging: !settings.mistakeFlagging })}
              className={`w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer ${
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
          </div>

          {/* Resign Current Game */}
          <div className="pt-2 border-t border-[#2d1e15]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onResign();
              }}
              className="w-full py-2.5 px-4 rounded-sm border border-[#4a3528] bg-[#1a130f] text-rose-300 hover:bg-rose-950/40 hover:border-rose-700 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4" />
              <span>{t('settings.resign')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
