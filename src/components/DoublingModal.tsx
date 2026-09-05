import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { DoublingCubeState, Player } from '../types/backgammon';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

interface DoublingModalProps {
  isOpen: boolean;
  cube: DoublingCubeState;
  activePlayer: Player;
  onAccept: () => void;
  onDrop: () => void;
  onBeaver?: () => void;
}

export const DoublingModal: React.FC<DoublingModalProps> = ({
  isOpen,
  cube,
  activePlayer,
  onAccept,
  onDrop,
  onBeaver,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const nextValue = cube.value === 1 ? 2 : cube.value * 2;
  const offeredBy = cube.offeredBy ? t(`players.${cube.offeredBy}`) : t('players.opponent', 'Opponent');
  const answeringPlayer = t(`players.${activePlayer}`);

  return (
    <div
      id="doubling-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-lg p-6 text-center"
        style={ledgerCardStyle}
      >
        {/* Cube Badge */}
        <div
          className="w-16 h-16 mx-auto rounded-md flex items-center justify-center font-bold mb-4"
          style={{
            ...serif,
            fontSize: '22px',
            background: `linear-gradient(160deg,#cba766,#a3773f)`,
            color: '#2a1c0e',
            boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {nextValue}
        </div>

        <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: BRASS }}>
          {t('doubling.proposed')}
        </p>

        <h3 className="text-xl capitalize tracking-tight" style={{ ...serif, fontWeight: 600, color: INK }}>
          {t('doubling.doublesTo', { player: offeredBy, value: nextValue })}
        </h3>

        <p className="text-xs mt-2 mb-6" style={{ color: INK_MUTED }}>
          {t('doubling.stakesIncrease', { from: cube.value, to: nextValue, player: answeringPlayer })}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Accept */}
          <button
            type="button"
            onClick={onAccept}
            className="py-3 px-4 text-xs uppercase tracking-[0.15em] font-semibold rounded-md transition-transform active:scale-[0.98] cursor-pointer"
            style={{
              background: `linear-gradient(160deg,#cba766,#a3773f)`,
              color: '#2a1c0e',
              boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            {t('doubling.accept', { value: nextValue })}
          </button>

          {/* Drop */}
          <button
            type="button"
            onClick={onDrop}
            className="py-3 px-4 text-xs uppercase tracking-[0.15em] font-semibold rounded-md transition-colors cursor-pointer"
            style={{ border: '1px solid rgba(139,30,30,0.35)', color: '#7a231f', background: 'rgba(139,30,30,0.06)' }}
          >
            {t('doubling.drop', { value: cube.value })}
          </button>
        </div>

        {/* Optional Beaver */}
        {onBeaver && nextValue * 2 <= 64 && (
          <button
            type="button"
            onClick={onBeaver}
            className="w-full mt-3 py-2.5 text-[11px] uppercase tracking-wider font-semibold rounded-md transition-colors cursor-pointer"
            style={{ border: `1px solid ${RULE}`, background: 'rgba(58,42,24,0.06)', color: BRASS }}
          >
            {t('doubling.beaver', { value: nextValue * 2 })}
          </button>
        )}
      </motion.div>
    </div>
  );
};
