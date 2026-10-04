import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGift } from '../context/GiftContext';
import { ArrowLeft, ArrowRight, Edit3, Printer, Check, Heart } from 'lucide-react';

export const LetterScreen: React.FC = () => {
  const { giftContent, goToPrevScreen, goToNextScreen, updateGiftContent } = useGift();
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editedBody, setEditedBody] = useState(giftContent.letterBody.join('\n\n'));

  const handleSaveInline = () => {
    const paragraphs = editedBody
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    updateGiftContent(prev => ({
      ...prev,
      letterBody: paragraphs.length > 0 ? paragraphs : prev.letterBody
    }));
    setIsEditingInline(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Top Bar with 'Previous' Button */}
      <div className="flex items-center justify-between mb-8 text-xs font-medium text-stone-500">
        <button
          onClick={goToPrevScreen}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200/90 bg-white/90 backdrop-blur-xs hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer group shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Previous: Opening</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Keepsake</span>
          </button>
        </div>
      </div>

      {/* Parchment Paper Presentation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#FDFBF7] rounded-2xl shadow-warm-elevated border border-stone-200/80 p-8 sm:p-12 md:p-16 overflow-hidden"
      >
        {/* Subtle decorative inner hairline border */}
        <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-stone-300/40 rounded-xl" />
        
        {/* Subtle decorative fold line across the middle */}
        <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-stone-200/40" />

        {/* Header of the letter */}
        <div className="relative z-10 border-b border-stone-200/60 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-amber-800 font-medium">
              A Son's Reflection
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium mt-1">
              To Teacher Vevian Joy, My First Teacher
            </h1>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            October 2026 · Teachers' Day
          </span>
        </div>

        {/* Letter Content Area */}
        <div className="relative z-10 max-w-2xl mx-auto">
          
          {/* Handwritten accent salutation */}
          <div className="mb-6">
            <p className="font-script text-3xl sm:text-4xl text-amber-900 tracking-wide">
              {giftContent.letterSalutation}
            </p>
          </div>

          {/* Inline Editor or Rendered Prose */}
          {isEditingInline ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 italic">
                Edit your personal letter below. Paragraphs are separated by double newlines.
              </p>
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={14}
                className="w-full p-4 rounded-xl border border-stone-300 bg-white font-serif text-base text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-700/30"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditingInline(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInline}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Letter</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-stone-700 text-base sm:text-lg leading-[1.8] font-serif">
              {giftContent.letterBody.map((paragraph, idx) => (
                <p 
                  key={idx} 
                  className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:text-amber-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1" : ""}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Handwritten accent closing & signature */}
          <div className="mt-10 pt-6 border-t border-stone-200/50 flex flex-col items-end">
            <p className="font-serif italic text-sm text-stone-500">
              {giftContent.letterClosing}
            </p>
            <p className="font-script text-3xl sm:text-4xl text-amber-900 mt-2">
              {giftContent.sonName}
            </p>
          </div>

        </div>

        {/* Wax seal watermark in corner */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border-8 border-amber-900/5 flex items-center justify-center pointer-events-none">
          <Heart className="w-12 h-12 text-amber-900/10" />
        </div>

      </motion.div>

      {/* Bottom Forward 'Next' Button */}
      <div className="mt-12 flex justify-end">
        <button
          onClick={goToNextScreen}
          className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-serif tracking-wide transition-all shadow-warm-subtle hover:shadow-warm-elevated cursor-pointer group"
        >
          <span>Next: Moments in Time</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>

    </div>
  );
};
