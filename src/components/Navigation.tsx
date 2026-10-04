import React from 'react';
import { useGift } from '../context/GiftContext';
import { Volume2, VolumeX, Sliders } from 'lucide-react';

/**
 * Replaces the old navigation bar with discreet floating utility controls
 * (music and personalize) so the screen remains clean and focused.
 */
export const Navigation: React.FC = () => {
  const { 
    isAudioPlaying, 
    toggleAudio, 
    setIsPersonalizeOpen,
    hasUnwrapped,
    currentScreen
  } = useGift();

  if (currentScreen === 'hero' && !hasUnwrapped) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 no-print">
      {/* Discreet Ambient Music Pill */}
      <button
        onClick={toggleAudio}
        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer shadow-sm backdrop-blur-md ${
          isAudioPlaying
            ? 'bg-amber-100/90 border-amber-300 text-amber-900 shadow-amber-900/5'
            : 'bg-white/85 border-stone-200/90 text-stone-600 hover:bg-white hover:text-stone-900'
        }`}
        title={isAudioPlaying ? 'Mute soothing melody' : 'Play peaceful piano melody'}
        aria-label="Toggle ambient piano"
      >
        {isAudioPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span className="hidden sm:inline font-serif text-[11px]">Music Playing</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline font-serif text-[11px]">Play Music</span>
          </>
        )}
      </button>
    </div>
  );
};
