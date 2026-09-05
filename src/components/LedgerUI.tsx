import React from 'react';

// Shared tokens for the "kahvehane" (coffeehouse) parchment/brass world used
// by HomeScreen, SettingsModal, and MatchStartModal — kept in one place so
// the three screens read as one table, not three separate re-skins.
export const INK = '#2f2113';
export const INK_MUTED = '#8a7a5f';
export const BRASS = '#a3773f';
export const RULE = 'rgba(58,42,24,0.14)';

export const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

export const ledgerCardStyle: React.CSSProperties = {
  background: 'radial-gradient(140% 100% at 18% 0%, #f5eddb 0%, #e8dbb9 40%, #d4c093 78%, #c0a878 100%)',
  boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 3px rgba(184,147,90,0.4)',
};

export function LedgerToggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="w-10 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer shrink-0"
      style={{ background: checked ? BRASS : 'rgba(58,42,24,0.18)' }}
    >
      <div
        className="w-4 h-4 rounded-full transition-transform"
        style={{
          background: '#fdfaf0',
          transform: checked ? 'translateX(1.25rem)' : 'translateX(0)',
        }}
      />
    </button>
  );
}

// A pill button for segmented choices (opponent, difficulty, color, mode) on
// the parchment ground — brass fill when selected, a quiet outline otherwise.
export function LedgerPill({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 px-2 rounded-md text-[11px] font-semibold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${className}`}
      style={
        selected
          ? { background: `linear-gradient(160deg,#cba766,#a3773f)`, color: '#2a1c0e', boxShadow: '0 2px 6px rgba(60,38,10,0.25)' }
          : { background: 'rgba(58,42,24,0.06)', color: INK_MUTED, border: `1px solid ${RULE}` }
      }
    >
      {children}
    </button>
  );
}
