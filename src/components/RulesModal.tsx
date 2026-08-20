import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { X, BookOpen, Target, ArrowRight, ShieldCheck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        className="w-full max-w-xl bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 sm:p-8 text-[#e0d5c1] relative max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#e0d5c1]/50 hover:text-[#e0d5c1] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6 pb-3 border-b border-[#2d1e15]">
          <h2 className="text-xl font-serif text-[#c2a278]">{t('rules.title')}</h2>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
            {t('rules.subtitle')}
          </p>
        </div>

        <div className="space-y-4 text-xs text-[#e0d5c1]/80 leading-relaxed">
          {/* Objective */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              {t('rules.objectiveTitle')}
            </div>
            <p>{t('rules.objectiveText')}</p>
          </div>

          {/* Movement & Dice */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              {t('rules.movementTitle')}
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.movementWhite')}</li>
              <li>{t('rules.movementBlack')}</li>
              <li>{t('rules.movementDoubles')}</li>
              <li>{t('rules.movementMustPlay')}</li>
            </ul>
          </div>

          {/* Hitting & The Bar */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              {t('rules.hittingTitle')}
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.hittingBlot')}</li>
              <li>{t('rules.hittingReenter')}</li>
              <li>{t('rules.hittingBlocked')}</li>
            </ul>
          </div>

          {/* Scoring & Doubling Cube */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              {t('rules.cubeTitle')}
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>{t('rules.cubeSingle')}</li>
              <li>{t('rules.cubeGammon')}</li>
              <li>{t('rules.cubeBackgammon')}</li>
              <li>{t('rules.cubeRaise')}</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3 border border-[#c2a278] text-[#c2a278] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#c2a278] hover:text-[#140e0a] transition-colors rounded-sm cursor-pointer"
        >
          {t('rules.close')}
        </button>
      </motion.div>
    </div>
  );
};
