import React, { useState } from 'react';
import { useGift } from '../context/GiftContext';
import { X, RotateCcw, Check, Sparkles, Sliders } from 'lucide-react';

export const PersonalizeModal: React.FC = () => {
  const { 
    isPersonalizeOpen, 
    setIsPersonalizeOpen, 
    giftContent, 
    updateGiftContent, 
    resetToDefault 
  } = useGift();

  const [motherName, setMotherName] = useState(giftContent.motherName);
  const [sonName, setSonName] = useState(giftContent.sonName);
  const [heroTitle, setHeroTitle] = useState(giftContent.heroTitle);
  const [letterSalutation, setLetterSalutation] = useState(giftContent.letterSalutation);
  const [letterClosing, setLetterClosing] = useState(giftContent.letterClosing);

  if (!isPersonalizeOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGiftContent(prev => ({
      ...prev,
      motherName,
      sonName,
      heroTitle,
      letterSalutation,
      letterClosing
    }));
    setIsPersonalizeOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all personalized text to original defaults?')) {
      resetToDefault();
      setIsPersonalizeOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Personalize Gift Details
            </h2>
          </div>
          <button
            onClick={() => setIsPersonalizeOpen(false)}
            className="text-stone-400 hover:text-stone-800 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Teacher's Name or Title
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Teacher Vevian Joy Sangahan..."
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
            <span className="text-[11px] text-stone-400">Used in headings, seals, and certificates.</span>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Son's Name or Signature
            </label>
            <input
              type="text"
              value={sonName}
              onChange={(e) => setSonName(e.target.value)}
              placeholder="Your Son, Jop..."
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
            <span className="text-[11px] text-stone-400">Signed at the base of the letter and certificate.</span>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Hero Screen Title
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Letter Salutation
            </label>
            <input
              type="text"
              value={letterSalutation}
              onChange={(e) => setLetterSalutation(e.target.value)}
              placeholder="Dearest Mom,"
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Letter Closing
            </label>
            <input
              type="text"
              value={letterClosing}
              onChange={(e) => setLetterClosing(e.target.value)}
              placeholder="With all my love and infinite respect,"
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-stone-500 hover:text-rose-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPersonalizeOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
