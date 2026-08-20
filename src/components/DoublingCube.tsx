import React from 'react';
import { motion } from 'motion/react';
import { DoublingCubeState, Player } from '../types/backgammon';

interface DoublingCubeProps {
  cube: DoublingCubeState;
  activePlayer: Player;
  canDouble: boolean;
  onOfferDouble: () => void;
  size?: number;
}

export const DoublingCube: React.FC<DoublingCubeProps> = ({
  cube,
  activePlayer,
  canDouble,
  onOfferDouble,
  size = 38,
}) => {
  // Display clean multiplier level (e.g. "1x", "2x", "4x", "8x", "16x", "32x", "64x")
  const displayVal = `${cube.value}x`;
  const isMyCube = cube.owner === 'neutral' || cube.owner === activePlayer;
  const isClickable = canDouble && isMyCube;

  return (
    <motion.div
      id="doubling-cube"
      whileHover={isClickable ? { scale: 1.08, y: -1 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      onClick={isClickable ? onOfferDouble : undefined}
      className={`relative rounded-md select-none flex flex-col items-center justify-center transition-all ${
        isClickable
          ? 'cursor-pointer ring-2 ring-[#e5c07b] shadow-[0_0_15px_rgba(229,192,123,0.6)] animate-pulse'
          : 'cursor-default opacity-90'
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(135deg, #3d2b1f 0%, #201610 50%, #140e0a 100%)',
        border: '1.5px solid #8b6b47',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.7)',
      }}
      title={
        isClickable
          ? `Katlama Teklif Et (${cube.value * 2}x yapmak için tıkla)`
          : `Katlama Zarı: ${displayVal} (Sahip: ${cube.owner === 'neutral' ? 'Ortak' : cube.owner})`
      }
    >
      {/* Corner metallic inlays */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-[#e5c07b] opacity-70 rounded-full" />
      <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#e5c07b] opacity-70 rounded-full" />
      <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-[#e5c07b] opacity-70 rounded-full" />
      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-[#e5c07b] opacity-70 rounded-full" />

      {/* Multiplier in refined Serif */}
      <span
        className="font-serif font-bold text-[#f3e5ab] tracking-tight leading-none drop-shadow"
        style={{
          fontSize: displayVal.length > 2 ? '13px' : '15px',
        }}
      >
        {displayVal}
      </span>

      {/* Owner indicator tag if owned */}
      {cube.owner !== 'neutral' && (
        <span className="text-[7px] uppercase tracking-wider font-mono font-bold text-[#e5c07b]/90 -mt-0.5">
          {cube.owner === 'white' ? 'W' : 'B'}
        </span>
      )}
    </motion.div>
  );
};

