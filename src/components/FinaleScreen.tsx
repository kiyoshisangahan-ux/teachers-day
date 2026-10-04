import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGift } from '../context/GiftContext';
import { audioManager } from '../services/audioService';
import { 
  ArrowLeft, 
  RotateCcw, 
  Printer, 
  Heart, 
  Award, 
  Share2, 
  Check 
} from 'lucide-react';

export const FinaleScreen: React.FC = () => {
  const { giftContent, goToPrevScreen, setCurrentScreen } = useGift();
  const [sealStamped, setSealStamped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleStampSeal = () => {
    audioManager.playWaxSealSound();
    setSealStamped(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Top Bar with 'Previous' Button */}
      <div className="flex items-center justify-between mb-8 text-xs font-medium text-stone-500 no-print">
        <button
          onClick={goToPrevScreen}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200/90 bg-white/90 backdrop-blur-xs hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer group shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Previous: Best Teacher Ever</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Keepsake</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 no-print">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-medium">
          The Emotional Finale
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-medium mt-2 mb-3">
          A Son's Final Tribute
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Of all the honors that an educator can receive, none compares to the boundless love and gratitude of her family.
        </p>
      </div>

      {/* Framed Gold-Leaf Certificate Presentation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#FDFBF7] rounded-3xl border-4 border-amber-800/30 p-8 sm:p-14 md:p-16 shadow-warm-float text-center overflow-hidden"
      >
        {/* Ornate inner gold double border */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-amber-700/30 rounded-2xl" />
        <div className="pointer-events-none absolute inset-4 sm:inset-6 border border-amber-700/20 rounded-xl" />

        {/* Certificate Watermark Corner Florals */}
        <div className="pointer-events-none absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg" />
        <div className="pointer-events-none absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg" />
        <div className="pointer-events-none absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg" />
        <div className="pointer-events-none absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg" />

        <div className="relative z-10 max-w-xl mx-auto">
          
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 border border-amber-300">
            <Award className="w-6 h-6" />
          </div>

          <p className="text-[11px] sm:text-xs font-serif uppercase tracking-[0.25em] text-amber-900 font-semibold mb-2">
            The Highest Distinction of Love & Education
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-medium tracking-tight mb-6">
            Lifetime Teacher of the Heart
          </h2>

          <div className="w-24 h-px bg-amber-800/40 mx-auto mb-6" />

          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
            Conferred With Eternal Admiration Upon
          </p>

          <p className="font-serif text-3xl sm:text-4xl text-amber-950 font-bold mb-6">
            {giftContent.motherName}
          </p>

          <p className="text-sm sm:text-base text-stone-700 font-serif leading-relaxed mb-8 max-w-lg mx-auto">
            "For endless hours spent turning confusion into confidence, for illuminating countless young futures with patience, and above all—for being the warmest, wisest, and most beloved teacher a son could ever pray for."
          </p>

          {/* Interactive Golden Wax Seal */}
          <div className="my-8 flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStampSeal}
              className={`w-20 h-20 rounded-full cursor-pointer flex items-center justify-center shadow-lg transition-all duration-500 ${
                sealStamped 
                  ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 ring-4 ring-amber-300/60 scale-105' 
                  : 'bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 ring-2 ring-amber-500/40'
              }`}
            >
              <div className="w-16 h-16 rounded-full border border-amber-300/40 flex flex-col items-center justify-center text-center">
                <Heart className={`w-5 h-5 text-amber-200 ${sealStamped ? 'scale-110 fill-amber-200' : ''}`} />
                <span className="text-[9px] font-mono tracking-widest text-amber-200 uppercase mt-0.5">
                  {sealStamped ? 'SEALED' : 'TAP SEAL'}
                </span>
              </div>
            </motion.div>
            
            <p className="text-[11px] text-stone-400 font-serif italic mt-2">
              {sealStamped ? 'Officially consecrated with eternal love.' : 'Tap seal to stamp this certificate forever.'}
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-8 border-t border-stone-200/80 flex items-center justify-between text-left">
            <div>
              <p className="text-[11px] text-stone-400 uppercase tracking-widest">Date Conferred</p>
              <p className="font-mono text-xs text-stone-700 mt-1">Teachers' Day · Forever</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-stone-400 uppercase tracking-widest">Signed With Pride</p>
              <p className="font-script text-2xl sm:text-3xl text-amber-900 mt-1">
                {giftContent.sonName}
              </p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Bottom controls */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
        <button
          onClick={() => setCurrentScreen('hero')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-all shadow-warm-subtle hover:shadow-warm-elevated cursor-pointer group"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
          <span>Replay Journey from Beginning</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save Keepsake Plaque</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
        </button>
      </div>

      {/* Final son's toast quote */}
      <div className="mt-14 text-center max-w-lg mx-auto no-print">
        <p className="font-serif italic text-base text-stone-600 leading-relaxed">
          "Happy Teachers' Day, Teacher Vevian Joy. Thank you for giving the world your best, and giving me your all."
        </p>
        <p className="font-script text-2xl sm:text-3xl text-amber-900 mt-2">
          Your son, Jop
        </p>
      </div>

    </div>
  );
};
