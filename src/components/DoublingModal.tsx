import React from 'react';
import { motion } from 'motion/react';
import { DoublingCubeState, Player } from '../types/backgammon';
import { Check, X, Zap } from 'lucide-react';

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
  if (!isOpen) return null;

  const nextValue = cube.value === 1 ? 2 : cube.value * 2;
  const offeredBy = cube.offeredBy || 'opponent';
  const answeringPlayer = activePlayer;

  return (
    <div
      id="doubling-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl p-6 text-[#e0d5c1] text-center"
      >
        {/* Cube Badge */}
        <div className="w-16 h-16 mx-auto rounded-sm bg-[#2d1e15] border border-[#4a3528] flex items-center justify-center text-[#c2a278] font-serif text-2xl font-light shadow-inner mb-4">
          {nextValue}
        </div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c2a278] opacity-80 mb-1">
          Double Proposed
        </p>

        <h3 className="text-xl font-light text-[#f9f3e5] capitalize tracking-tight">
          {offeredBy} Doubles to {nextValue}x
        </h3>

        <p className="text-xs text-[#e0d5c1]/60 mt-2 mb-6">
          The stakes will increase from{' '}
          <span className="font-mono text-[#c2a278]">{cube.value}x</span> to{' '}
          <span className="font-mono text-[#c2a278]">{nextValue}x</span>.
          Does <span className="capitalize text-[#f9f3e5] font-semibold">{answeringPlayer}</span> accept?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Accept */}
          <button
            type="button"
            onClick={onAccept}
            className="py-3 px-4 border border-[#c2a278] bg-[#c2a278] text-[#140e0a] text-xs uppercase tracking-[0.15em] font-semibold rounded-sm hover:bg-[#d6b78d] transition-colors cursor-pointer"
          >
            Accept ({nextValue}x)
          </button>

          {/* Drop */}
          <button
            type="button"
            onClick={onDrop}
            className="py-3 px-4 border border-[#2d1e15] bg-[#1a130f] hover:border-rose-800 hover:text-rose-300 text-[#e0d5c1]/70 text-xs uppercase tracking-[0.15em] font-semibold rounded-sm transition-colors cursor-pointer"
          >
            Drop ({cube.value}p)
          </button>
        </div>

        {/* Optional Beaver */}
        {onBeaver && nextValue * 2 <= 64 && (
          <button
            type="button"
            onClick={onBeaver}
            className="w-full mt-3 py-2.5 border border-[#4a3528] bg-[#1a130f] text-[#c2a278] text-[11px] uppercase tracking-wider font-semibold rounded-sm hover:border-[#c2a278] transition-colors cursor-pointer"
          >
            Beaver! (Re-double to {nextValue * 2}x)
          </button>
        )}
      </motion.div>
    </div>
  );
};
