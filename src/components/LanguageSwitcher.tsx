import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage } from '../i18n/config';

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
        <div className="absolute end-0 mt-2 w-44 max-h-72 overflow-y-auto bg-[#140e0a] border border-[#3d2b1f] rounded-md shadow-2xl z-50 py-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => changeLanguage(lang)}
              className={`w-full text-start px-3.5 py-2 text-sm transition-colors cursor-pointer ${
                current === lang
                  ? 'text-[#e5c07b] bg-[#2d1e15] font-semibold'
                  : 'text-[#e0d5c1] hover:bg-[#1a130f]'
              }`}
            >
              {LANGUAGE_NAMES[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
