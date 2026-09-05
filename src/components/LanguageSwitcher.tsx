import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage } from '../i18n/config';
import { INK, BRASS, ledgerCardStyle } from './LedgerUI';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  const current = (i18n.resolvedLanguage || 'en') as SupportedLanguage;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title={t('header.language', 'Language')}
        onClick={() => setOpen((v) => !v)}
        className="p-2.5 rounded-full border border-[#3d2b1f] text-[#c2a278] bg-[#1c140f]/80 hover:border-[#c2a278] transition-colors cursor-pointer"
      >
        <Languages className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="absolute end-0 mt-2 w-44 max-h-72 overflow-y-auto rounded-md z-50 py-1 ledger-scroll"
          style={{ ...ledgerCardStyle, boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1.5px rgba(184,147,90,0.4)' }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => changeLanguage(lang)}
              className="w-full text-start px-3.5 py-2 text-sm transition-colors cursor-pointer"
              style={
                current === lang
                  ? { color: BRASS, background: 'rgba(163,119,63,0.14)', fontWeight: 600 }
                  : { color: INK }
              }
              onMouseEnter={(e) => {
                if (current !== lang) e.currentTarget.style.background = 'rgba(58,42,24,0.08)';
              }}
              onMouseLeave={(e) => {
                if (current !== lang) e.currentTarget.style.background = 'transparent';
              }}
            >
              {LANGUAGE_NAMES[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
