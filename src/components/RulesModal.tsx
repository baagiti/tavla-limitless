import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, Target, ArrowRight, ShieldCheck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-serif text-[#c2a278]">Rules & Reference</h2>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
            Official Backgammon Guidelines
          </p>
        </div>

        <div className="space-y-4 text-xs text-[#e0d5c1]/80 leading-relaxed">
          {/* Objective */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              Objective
            </div>
            <p>
              Move all 15 of your checkers into your home board and bear them off the board
              before your opponent. The first player to bear off all 15 checkers wins.
            </p>
          </div>

          {/* Movement & Dice */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              Movement & Dice
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>White</strong> moves in reverse order from point 24 down to point 1 (into
                home board 1–6).
              </li>
              <li>
                <strong>Black</strong> moves from point 1 up to point 24 (into home board
                19–24).
              </li>
              <li>
                Rolling doubles (e.g. 5-5) grants <strong>4 moves</strong> of that value instead
                of 2.
              </li>
              <li>
                You must play all possible dice. If only one of two different dice can be played,
                you must play the higher one.
              </li>
            </ul>
          </div>

          {/* Hitting & The Bar */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              Blots, Hitting & The Bar
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                A single checker on a point is a <strong>Blot</strong>. If an opponent lands on
                it, it is hit and placed on the <strong>Bar</strong>.
              </li>
              <li>
                Checkers on the bar must re-enter into the opponent&apos;s home board before any other
                checkers can move.
              </li>
              <li>
                Points with 2 or more opponent checkers are <strong>blocked</strong> and cannot be
                landed on.
              </li>
            </ul>
          </div>

          {/* Scoring & Doubling Cube */}
          <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm">
            <div className="font-semibold text-xs text-[#c2a278] uppercase tracking-wider mb-1">
              Doubling Cube & Victory Types
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Single Win (1x):</strong> Opponent has borne off at least 1 checker.
              </li>
              <li>
                <strong>Gammon (2x):</strong> Opponent has borne off 0 checkers.
              </li>
              <li>
                <strong>Backgammon (3x):</strong> Opponent has borne off 0 checkers and has a checker on the bar or in the winner&apos;s home board.
              </li>
              <li>
                The <strong>Doubling Cube</strong> allows players to raise the game value to 2x, 4x, 8x, up to 64x before rolling.
              </li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-3 border border-[#c2a278] text-[#c2a278] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#c2a278] hover:text-[#140e0a] transition-colors rounded-sm cursor-pointer"
        >
          Close Reference
        </button>
      </motion.div>
    </div>
  );
};
