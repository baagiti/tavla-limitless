import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameMode } from '../types/backgammon';
import { Crown, Bot, User, Dices } from 'lucide-react';

interface DiceProps {
  dice: number[];
  rolledDice: [number, number] | null;
  activePlayer: Player;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  isOpeningRoll?: boolean;
  openingDice?: { white: number | null; black: number | null };
  openingRoller?: Player | null;
  onOpeningRoll?: (player?: Player) => void;
  gameMode?: GameMode;
  userColor?: Player;
}

const PIP_LAYOUTS: { [key: number]: number[] } = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const SingleDie: React.FC<{
  value: number;
  isUsed?: boolean;
  playerColor?: Player;
  isOpening?: boolean;
  isWinner?: boolean;
  isTie?: boolean;
}> = ({
  value,
  isUsed = false,
  playerColor = 'white',
  isOpening = false,
  isWinner = false,
  isTie = false,
}) => {
  const pips = PIP_LAYOUTS[value] || [];
  const isWhite = playerColor === 'white';

  return (
    <motion.div
      initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
      animate={{
        scale: isWinner ? 1.08 : 1,
        rotate: 0,
        opacity: isUsed ? 0.35 : 1,
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg select-none flex items-center justify-center transition-all ${
        isWinner
          ? 'ring-2 ring-[#e5c07b] shadow-[0_0_20px_rgba(229,192,123,0.6)]'
          : isTie
          ? 'ring-1 ring-amber-500/50'
          : isUsed
          ? 'scale-90 opacity-40'
          : 'shadow-[0_8px_16px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.4)]'
      }`}
      style={{
        background: isWhite
          ? 'radial-gradient(circle at 35% 30%, #ffffff 0%, #faf6ee 60%, #ded3bf 100%)'
          : 'radial-gradient(circle at 35% 30%, #382c23 0%, #211914 60%, #0d0a08 100%)',
        border: isWinner
          ? '2px solid #e5c07b'
          : isWhite
          ? '1.5px solid #d4c7b2'
          : '1.5px solid #4a382b',
        boxShadow: isWinner
          ? '0 0 25px rgba(229,192,123,0.7), 0 10px 20px rgba(0,0,0,0.6)'
          : '0 8px 18px rgba(0,0,0,0.6), inset 0 1px 1.5px rgba(255,255,255,0.4)',
      }}
    >
      {/* Pip grid */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 pointer-events-none">
        {Array.from({ length: 9 }).map((_, idx) => {
          const hasPip = pips.includes(idx);
          if (!hasPip) return <div key={idx} />;

          return (
            <div key={idx} className="flex items-center justify-center">
              <div
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                style={{
                  background: isWhite
                    ? 'radial-gradient(circle at 40% 40%, #2b1f16 0%, #120b08 100%)'
                    : 'radial-gradient(circle at 40% 40%, #ffffff 0%, #e5c07b 100%)',
                  boxShadow: isWhite
                    ? 'inset 0 1px 1.5px rgba(0,0,0,0.8), 0 0.5px 1px rgba(255,255,255,0.8)'
                    : 'inset 0 1px 1px rgba(0,0,0,0.5), 0 0 3px rgba(229,192,123,0.7)',
                }}
              />
            </div>
          );
        })}
      </div>

      {isOpening && (
        <div className="absolute -bottom-5 text-[10px] uppercase font-mono tracking-widest text-[#c2a278] font-semibold">
          {playerColor}
        </div>
      )}

      {isWinner && (
        <div className="absolute -top-3.5 bg-gradient-to-r from-[#e5c07b] to-[#c2a278] text-[#140e0a] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 uppercase tracking-wider">
          <Crown className="w-2.5 h-2.5" />
          <span>Winner</span>
        </div>
      )}

      {isTie && (
        <div className="absolute -top-3 bg-[#2d1e15] border border-[#c2a278]/50 text-[#c2a278] text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow uppercase tracking-wider">
          Tie
        </div>
      )}
    </motion.div>
  );
};

export const Dice: React.FC<DiceProps> = ({
  dice,
  rolledDice,
  activePlayer,
  isRolling,
  canRoll,
  onRoll,
  isOpeningRoll = false,
  openingDice,
  openingRoller = 'white',
  onOpeningRoll,
  gameMode = 'ai',
  userColor = 'white',
}) => {
  const isDoubles = rolledDice && rolledDice[0] === rolledDice[1];

  // ----------------------------------------------------
  // Interactive Sequential Opening Roll Screen
  // ----------------------------------------------------
  if (isOpeningRoll && openingDice) {
    const isBothRolled = openingDice.white !== null && openingDice.black !== null;
    const isTie = isBothRolled && openingDice.white === openingDice.black;
    const whiteWon = isBothRolled && (openingDice.white ?? 0) > (openingDice.black ?? 0);
    const blackWon = isBothRolled && (openingDice.black ?? 0) > (openingDice.white ?? 0);

    const isWhiteTurnToRoll = (openingDice.white === null && openingRoller === 'white') || isTie;
    const isBlackTurnToRoll = (openingDice.black === null && openingRoller === 'black') || (isTie && gameMode === 'local');

    const isWhiteHuman = gameMode === 'local' || userColor === 'white';
    const isBlackHuman = gameMode === 'local' || userColor === 'black';

    const handleOpeningClick = (color?: Player) => {
      const targetColor = color || openingRoller || (gameMode === 'ai' ? userColor : 'white');
      if (onOpeningRoll) {
        onOpeningRoll(targetColor);
      } else {
        onRoll();
      }
    };

    return (
      <div
        id="opening-dice-stage"
        className="flex flex-col items-center bg-[#140e0a]/95 backdrop-blur-md border border-[#e5c07b]/40 rounded-lg p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.9)] max-w-sm sm:max-w-md w-full mx-auto"
      >
        {/* Header title */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e5c07b] mb-3">
          <Dices className="w-3.5 h-3.5" />
          <span>Açılış Zarı / Opening Roll</span>
        </div>

        {/* Dice Slot Container */}
        <div className="flex items-center justify-around w-full gap-3 sm:gap-6 py-2">
          {/* WHITE DIE SLOT */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase font-mono tracking-wider text-[#e0d5c1]/80">
              {isWhiteHuman ? <User className="w-3 h-3 text-[#c2a278]" /> : <Bot className="w-3 h-3 text-[#c2a278]" />}
              <span>{isWhiteHuman ? (gameMode === 'local' ? 'White' : 'You') : 'AI (White)'}</span>
            </div>

            {openingDice.white !== null ? (
              <div
                onClick={isTie && isWhiteHuman && !isRolling ? () => handleOpeningClick('white') : undefined}
                className={isTie && isWhiteHuman ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
                title={isTie ? 'Tekrar atmak için tıkla' : undefined}
              >
                <SingleDie
                  value={openingDice.white}
                  playerColor="white"
                  isWinner={whiteWon}
                  isTie={isTie}
                />
              </div>
            ) : isRolling && openingRoller === 'white' ? (
              <motion.div
                animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#f9f3e5] border border-[#d1c9b8] shadow-xl flex items-center justify-center text-[#1a130f] font-serif text-xl font-bold"
              >
                🎲
              </motion.div>
            ) : isWhiteTurnToRoll ? (
              isWhiteHuman ? (
                <motion.button
                  id="btn-roll-white-opening"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleOpeningClick('white')}
                  disabled={isRolling}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-dashed border-[#e5c07b] bg-[#2d1e15] hover:bg-[#e5c07b] hover:text-[#140e0a] text-[#e5c07b] flex flex-col items-center justify-center transition-all shadow-lg animate-pulse cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-tight mt-0.5">Zar At</span>
                </motion.button>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-[#4a3528] bg-[#1a130f] flex flex-col items-center justify-center text-[#c2a278]/60 text-[9px] uppercase font-mono animate-pulse">
                  <span>AI</span>
                  <span>Rolling...</span>
                </div>
              )
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-dashed border-[#4a3528]/50 bg-[#140e0a]/50 flex items-center justify-center text-[#e0d5c1]/30 text-[9px] font-mono">
                Bekliyor
              </div>
            )}
          </div>

          {/* VS / Result Divider */}
          <div className="flex flex-col items-center justify-center px-1">
            <span className="text-[10px] font-mono font-bold text-[#c2a278]/60 uppercase">VS</span>
            {isTie && (
              <span className="text-[8px] uppercase tracking-wider text-amber-400 font-bold mt-1 text-center animate-pulse">
                Berabere!
              </span>
            )}
          </div>

          {/* BLACK DIE SLOT */}
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase font-mono tracking-wider text-[#e0d5c1]/80">
              {isBlackHuman ? <User className="w-3 h-3 text-[#c2a278]" /> : <Bot className="w-3 h-3 text-[#c2a278]" />}
              <span>{isBlackHuman ? (gameMode === 'local' ? 'Black' : 'You') : 'AI (Black)'}</span>
            </div>

            {openingDice.black !== null ? (
              <div
                onClick={isTie && isBlackHuman && !isRolling ? () => handleOpeningClick('black') : undefined}
                className={isTie && isBlackHuman ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
                title={isTie ? 'Tekrar atmak için tıkla' : undefined}
              >
                <SingleDie
                  value={openingDice.black}
                  playerColor="black"
                  isWinner={blackWon}
                  isTie={isTie}
                />
              </div>
            ) : isRolling && openingRoller === 'black' ? (
              <motion.div
                animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#1c1c1c] border border-[#3d2b1f] shadow-xl flex items-center justify-center text-[#f9f3e5] font-serif text-xl font-bold"
              >
                🎲
              </motion.div>
            ) : isBlackTurnToRoll ? (
              isBlackHuman ? (
                <motion.button
                  id="btn-roll-black-opening"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleOpeningClick('black')}
                  disabled={isRolling}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-dashed border-[#e5c07b] bg-[#2d1e15] hover:bg-[#e5c07b] hover:text-[#140e0a] text-[#e5c07b] flex flex-col items-center justify-center transition-all shadow-lg animate-pulse cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-tight mt-0.5">Zar At</span>
                </motion.button>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-[#4a3528] bg-[#1a130f] flex flex-col items-center justify-center text-[#c2a278]/60 text-[9px] uppercase font-mono animate-pulse">
                  <span>AI</span>
                  <span>Rolling...</span>
                </div>
              )
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border border-dashed border-[#4a3528]/50 bg-[#140e0a]/50 flex items-center justify-center text-[#e0d5c1]/30 text-[9px] font-mono">
                Bekliyor
              </div>
            )}
          </div>
        </div>

        {/* Tie Action Re-roll Button */}
        {isTie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 mb-1 w-full flex justify-center"
          >
            <motion.button
              id="btn-reroll-tie"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpeningClick()}
              disabled={isRolling}
              className="px-6 py-2 rounded-full border border-[#e5c07b] bg-gradient-to-r from-[#8b6b47] via-[#e5c07b] to-[#8b6b47] text-[#140e0a] text-xs font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(229,192,123,0.6)] flex items-center gap-2 cursor-pointer hover:brightness-110"
            >
              <Dices className="w-4 h-4 text-[#140e0a]" />
              <span>Tekrar Zar At</span>
            </motion.button>
          </motion.div>
        )}

        {/* Status Prompt Footer */}
        <div className="text-[10px] text-[#c2a278]/90 font-medium text-center mt-2 px-2.5 py-1 bg-[#1a130f] border border-[#2d1e15] rounded w-full">
          {isBothRolled ? (
            isTie ? (
              <span className="text-amber-300 font-semibold">
                Zarlar eşit geldi ({openingDice.white} - {openingDice.black})! Yeniden belirlemek için tekrar zar atın.
              </span>
            ) : (
              <span>
                <strong className="text-[#f9f3e5]">
                  {whiteWon ? 'BEYAZ' : 'SİYAH'}
                </strong>{' '}
                büyük attı ve oyuna ilk hamleyle başlıyor!
              </span>
            )
          ) : openingRoller === 'white' ? (
            isWhiteHuman ? 'Sıra sende: Açılış zarını atmak için tıkla' : 'Beyaz oyuncu (AI) zar atıyor...'
          ) : (
            isBlackHuman ? 'Sıra sende: Açılış zarını atmak için tıkla' : 'Siyah oyuncu (AI) zar atıyor...'
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Regular Turn Dice Display
  // ----------------------------------------------------
  let displayItems: { value: number; isUsed: boolean }[] = [];

  if (rolledDice) {
    if (isDoubles) {
      const val = rolledDice[0];
      const usedCount = 4 - dice.length;
      for (let i = 0; i < 4; i++) {
        displayItems.push({
          value: val,
          isUsed: i < usedCount,
        });
      }
    } else {
      const d1Used = !dice.includes(rolledDice[0]);
      let d2Used = !dice.includes(rolledDice[1]);

      if (rolledDice[0] === rolledDice[1]) {
        d2Used = dice.length < 2;
      }

      displayItems = [
        { value: rolledDice[0], isUsed: d1Used },
        { value: rolledDice[1], isUsed: d2Used },
      ];
    }
  }

  return (
    <div id="dice-container" className="flex items-center justify-center gap-3 sm:gap-4 py-1">
      <AnimatePresence mode="popLayout">
        {isRolling ? (
          <motion.div
            key="rolling"
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="flex gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-[#f9f3e5] border border-[#d1c9b8] shadow-xl flex items-center justify-center text-[#1a130f] font-serif text-2xl font-bold">
              •
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#f9f3e5] border border-[#d1c9b8] shadow-xl flex items-center justify-center text-[#1a130f] font-serif text-2xl font-bold">
              ••
            </div>
          </motion.div>
        ) : displayItems.length > 0 ? (
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {displayItems.map((item, idx) => (
              <SingleDie
                key={idx}
                value={item.value}
                isUsed={item.isUsed}
                playerColor={activePlayer}
              />
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      {/* Roll Action Button */}
      {canRoll && !isRolling && (
        <motion.button
          id="btn-roll-dice"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRoll}
          className="py-3 px-6 rounded-sm border border-[#c2a278] bg-[#140e0a]/95 text-[#c2a278] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#c2a278] hover:text-[#140e0a] transition-colors shadow-2xl cursor-pointer"
        >
          Roll Dice
        </motion.button>
      )}
    </div>
  );
};

