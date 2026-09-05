import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { INK, INK_MUTED, BRASS, RULE, serif, ledgerCardStyle } from './LedgerUI';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-3.5 rounded-md" style={{ background: 'rgba(58,42,24,0.06)', border: `1px solid ${RULE}` }}>
    <div className="font-semibold text-xs uppercase tracking-wider mb-1" style={{ color: BRASS }}>
      {title}
    </div>
    {children}
  </div>
);

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      id="rules-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl rounded-lg p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto ledger-scroll"
        style={ledgerCardStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1 cursor-pointer"
          style={{ color: INK_MUTED }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6 pb-3" style={{ borderBottom: `1px solid ${RULE}` }}>
          <h2 className="text-xl" style={{ ...serif, fontWeight: 600, color: INK }}>{t('rules.title')}</h2>
          <p className="text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: BRASS }}>
            {t('rules.subtitle')}
          </p>
        </div>

        <div className="space-y-4 text-xs leading-relaxed" style={{ color: INK }}>
          <SectionCard title={t('rules.objectiveTitle')}>
            <p>{t('rules.objectiveText')}</p>
          </SectionCard>

          <SectionCard title={t('rules.movementTitle')}>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.movementWhite')}</li>
              <li>{t('rules.movementBlack')}</li>
              <li>{t('rules.movementDoubles')}</li>
              <li>{t('rules.movementMustPlay')}</li>
            </ul>
          </SectionCard>

          <SectionCard title={t('rules.hittingTitle')}>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.hittingBlot')}</li>
              <li>{t('rules.hittingReenter')}</li>
              <li>{t('rules.hittingBlocked')}</li>
            </ul>
          </SectionCard>

          <SectionCard title={t('rules.cubeTitle')}>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.cubeSingle')}</li>
              <li>{t('rules.cubeGammon')}</li>
              <li>{t('rules.cubeBackgammon')}</li>
              <li>{t('rules.cubeRaise')}</li>
            </ul>
          </SectionCard>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold rounded-md transition-transform active:scale-[0.98] cursor-pointer"
          style={{
            background: `linear-gradient(160deg,#cba766,#a3773f)`,
            color: '#2a1c0e',
            boxShadow: '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {t('rules.close')}
        </button>
      </motion.div>
    </div>
  );
};
