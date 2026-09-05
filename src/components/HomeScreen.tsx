import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, ArrowRight } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HomeScreenProps {
  onNewMatch: () => void;
  onOpenSettings: () => void;
}

// Hand-tuned marble veins (not procedural noise) — a handful of confident,
// slightly irregular strokes reads as real stone; too many or perfectly
// random ones read as static.
const VEINS = [
  'M 20 40 C 90 55, 140 30, 210 65 S 320 90, 360 60',
  'M -10 120 C 60 100, 120 140, 190 118 S 300 150, 380 130',
  'M 40 210 C 100 195, 170 225, 230 205 S 330 185, 390 215',
  'M 10 300 C 80 320, 150 285, 220 310 S 320 340, 370 305',
  'M 60 15 C 75 90, 55 160, 80 230',
  'M 260 20 C 245 100, 270 175, 250 260',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNewMatch, onOpenSettings }) => {
  const { t } = useTranslation();
  return (
    <div
      className="app-safe-area app-full-height w-full flex flex-col items-center select-none relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(120% 60% at 50% 0%, #4a3320 0%, #2a1d12 45%, #17100a 100%)',
      }}
    >
      <div className="w-full flex items-center justify-between px-5 pt-4 relative z-10">
        <div
          className="text-[11px] tracking-[0.14em] text-[#f0e6cf]/90"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          {t('home.title')} {t('home.subtitle')}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onOpenSettings}
            title={t('home.settings')}
            className="w-10 h-10 rounded-full border border-[#6b5230]/60 text-[#e8dcc0] bg-[#1c140f]/70 hover:border-[#c9a262] transition-colors cursor-pointer flex items-center justify-center"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full flex items-end justify-center px-4 pb-4 sm:pb-6 relative z-10">
        <div
          className="relative w-full max-w-md rounded-lg overflow-hidden"
          style={{
            height: '74%',
            background:
              'radial-gradient(140% 100% at 22% 0%, #f5eddb 0%, #e8dbb9 38%, #d4c093 68%, #c0a878 100%)',
            boxShadow:
              '0 24px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.3), inset 0 -34px 60px rgba(80,55,20,0.18)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 3px rgba(184,147,90,0.4)' }}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 380 380"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {VEINS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(122,95,55,0.16)"
                strokeWidth={i % 2 === 0 ? 1.4 : 0.8}
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 sm:gap-14 px-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-14 flex items-center justify-center">
                <div
                  className="absolute w-9 h-9 rounded-md"
                  style={{
                    left: 2,
                    top: 8,
                    transform: 'rotate(-10deg)',
                    background: 'linear-gradient(155deg,#fffaf0,#f0e4c9)',
                    boxShadow: '0 5px 10px rgba(40,25,10,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  <Pips value={6} />
                </div>
                <div
                  className="absolute w-9 h-9 rounded-md"
                  style={{
                    right: 2,
                    top: 0,
                    transform: 'rotate(8deg)',
                    background: 'linear-gradient(155deg,#fffaf0,#f0e4c9)',
                    boxShadow: '0 5px 10px rgba(40,25,10,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  <Pips value={4} />
                </div>
              </div>

              <div className="text-center">
                <div
                  className="leading-[1.05]"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(26px, 7vw, 32px)',
                    color: '#2f2113',
                    textShadow: '0 1px 0 rgba(255,255,255,0.35)',
                  }}
                >
                  {t('home.title')}
                </div>
                <div
                  className="mt-1.5"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 500,
                    fontSize: '11px',
                    letterSpacing: '0.32em',
                    color: '#8a6a3f',
                  }}
                >
                  {t('home.subtitle')}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={onNewMatch}
                className="flex items-center gap-2 px-9 py-3.5 rounded-md cursor-pointer active:scale-[0.98] transition-transform"
                style={{
                  background: 'linear-gradient(160deg,#cba766,#a3773f)',
                  boxShadow:
                    '0 10px 22px rgba(60,38,10,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#2a1c0e',
                }}
              >
                {t('home.newMatch')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Pips({ value }: { value: number }) {
  const layouts: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[24, 24], [50, 50], [76, 76]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
  };
  const pts = layouts[value] || layouts[1];
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={8} fill="#3a2a18" />
      ))}
    </svg>
  );
}
