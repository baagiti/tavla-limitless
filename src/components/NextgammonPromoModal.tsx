import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

// Left blank until Nextgammon actually has an App Store listing. The CTA
// below falls back to a "coming soon" state whenever this is empty, so
// there's never a broken/guessed link shipped to players.
const NEXTGAMMON_APP_STORE_URL = '';

interface NextgammonPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextgammonPromoModal: React.FC<NextgammonPromoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      id="nextgammon-promo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 text-[#e0d5c1] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#e0d5c1]/50 hover:text-[#e0d5c1] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-1">
          <img
            src="/nextgammon-icon.png"
            alt="Nextgammon"
            className="w-16 h-16 rounded-2xl border border-white/10 shadow-lg"
          />

          <div>
            <h3 className="text-lg font-serif font-bold text-[#f9f3e5] tracking-wide">
              {t('nextgammonPromo.title')}
            </h3>
            <span className="inline-block mt-1 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-[#2d1e15] text-[#c2a278] border border-[#3d2b1f]">
              {t('nextgammonPromo.comingSoon')}
            </span>
          </div>

          <p className="text-xs text-[#e0d5c1]/70 leading-relaxed">
            {t('nextgammonPromo.description')}
          </p>

          {NEXTGAMMON_APP_STORE_URL ? (
            <a
              href={NEXTGAMMON_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-2.5 px-4 rounded-sm bg-gradient-to-r from-[#e5c07b] to-[#c2a278] text-[#140e0a] text-xs uppercase tracking-wider font-bold text-center cursor-pointer"
            >
              {t('nextgammonPromo.cta')}
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full mt-2 py-2.5 px-4 rounded-sm border border-[#2d1e15] bg-[#1a130f] text-[#a89984]/50 text-xs uppercase tracking-wider font-bold cursor-not-allowed"
            >
              {t('nextgammonPromo.comingSoon')}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
