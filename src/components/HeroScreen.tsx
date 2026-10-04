import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGift } from '../context/GiftContext';
import { audioManager } from '../services/audioService';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

export const HeroScreen: React.FC = () => {
  const { giftContent, setCurrentScreen, setHasUnwrapped, toggleAudio, isAudioPlaying } = useGift();
  const [isOpening, setIsOpening] = useState(false);
  const [unfolded, setUnfolded] = useState(false);

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);
    audioManager.playWaxSealSound();
    
    // Auto-start ambient melody for emotional warmth
    if (!isAudioPlaying) {
      setTimeout(() => {
        toggleAudio();
      }, 700);
    }

    setTimeout(() => {
      setUnfolded(true);
    }, 900);

    setTimeout(() => {
      setHasUnwrapped(true);
      setCurrentScreen('letter');
    }, 2200);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F2EC] to-[#FAF8F5]">
      
      {/* Subtle background ambient glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        
        {/* Editorial introductory kicker */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-stone-500 mb-3"
        >
          {giftContent.heroKicker}
        </motion.p>

        {/* Large expressive serif title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-stone-900 tracking-tight leading-[1.18] text-balance mb-4"
        >
          {giftContent.heroTitle}
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-stone-600 font-light max-w-md mx-auto mb-8"
        >
          {giftContent.heroSubtitle}
        </motion.p>

        {/* Tactile Gift Envelope Object */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm sm:max-w-md my-4"
        >
          <div 
            onClick={handleOpenGift}
            className={`group relative bg-[#FDFBF7] rounded-2xl p-6 sm:p-8 cursor-pointer border border-stone-200/90 transition-all duration-500 ${
              isOpening 
                ? 'shadow-warm-float scale-[1.02]' 
                : 'shadow-warm-elevated hover:shadow-warm-float hover:-translate-y-1'
            }`}
          >
            {/* Satin ribbon styling across the envelope */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-amber-700/15 via-amber-600/25 to-amber-700/15 border-x border-amber-600/20 pointer-events-none" />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-amber-700/15 via-amber-600/25 to-amber-700/15 border-y border-amber-600/20 pointer-events-none" />

            {/* Inner envelope content preview */}
            <div className="relative z-10 py-6 flex flex-col items-center justify-center text-center">
              
              {/* Wax Seal with "V" for Teacher Vevian Joy */}
              <motion.div
                animate={isOpening ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.7 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 shadow-md flex items-center justify-center border-2 border-amber-500/40 mb-4 group-hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 rounded-full border border-amber-300/30 flex items-center justify-center">
                  <span className="font-serif text-lg font-bold text-amber-200 tracking-wider">
                    V
                  </span>
                </div>
              </motion.div>

              <p className="text-xs uppercase tracking-widest text-stone-500 font-medium mb-1">
                {isOpening ? 'Unfolding your gift...' : 'Tap seal to open'}
              </p>
              
              <h2 className="font-serif text-xl sm:text-2xl text-stone-800 font-normal">
                An Envelope for Teacher Vevian Joy
              </h2>

              <p className="text-xs text-stone-500 mt-2 italic font-serif">
                "Curated memories, words of deep love, and a son's tribute."
              </p>
            </div>

            {/* Unfolding letter card slide effect */}
            <AnimatePresence>
              {unfolded && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-2 -top-12 bg-white rounded-xl shadow-warm-float p-6 border border-amber-200/80 z-20"
                >
                  <p className="text-xs font-serif italic text-amber-800 tracking-wide uppercase mb-1">
                    Welcome, Teacher Vevian Joy
                  </p>
                  <p className="font-serif text-base sm:text-lg text-stone-900 leading-snug">
                    "Of all the lives you have touched and guided, nobody is prouder than your son, Jop."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Forward button on the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={() => {
              setHasUnwrapped(true);
              setCurrentScreen('letter');
            }}
            className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-serif tracking-wide transition-all shadow-warm-subtle hover:shadow-warm-elevated cursor-pointer group"
          >
            <span>Next: A Son's Letter</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};
