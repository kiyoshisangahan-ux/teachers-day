import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GiftProvider, useGift } from './context/GiftContext';
import { Navigation } from './components/Navigation';
import { HeroScreen } from './components/HeroScreen';
import { LetterScreen } from './components/LetterScreen';
import { MemoryScreen } from './components/MemoryScreen';
import { AppreciationScreen } from './components/AppreciationScreen';
import { FinaleScreen } from './components/FinaleScreen';

const GiftAppContent: React.FC = () => {
  const { currentScreen, giftContent } = useGift();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'hero':
        return <HeroScreen key="hero" />;
      case 'letter':
        return <LetterScreen key="letter" />;
      case 'memories':
        return <MemoryScreen key="memories" />;
      case 'appreciation':
        return <AppreciationScreen key="appreciation" />;
      case 'finale':
        return <FinaleScreen key="finale" />;
      default:
        return <HeroScreen key="hero-fallback" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-900">
      <Navigation />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Tasteful editorial footer */}
      <footer className="border-t border-stone-200/80 py-8 text-center text-xs text-stone-400 no-print">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif">
            A Teachers' Day tribute for {giftContent.motherName}
          </p>
          <p className="font-mono text-[11px] text-stone-400">
            Crafted with infinite love by {giftContent.sonName}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GiftProvider>
      <GiftAppContent />
    </GiftProvider>
  );
}
