import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGift } from '../context/GiftContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download 
} from 'lucide-react';

export const MemoryScreen: React.FC = () => {
  const { 
    giftContent, 
    goToPrevScreen, 
    goToNextScreen, 
    activeLightboxItem, 
    openLightbox, 
    closeLightbox 
  } = useGift();

  // Lightbox view state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const PHOTO_DESCRIPTIONS: Record<string, string> = {
    'Messenger_creation_E3E48042-981A-499B-8750-1A5DE95878BD.jpeg': 'Mom holding toddler Jop',
    'FB_IMG_1791114835727.jpg': 'Graduation with Mom (Green dress & toga)',
    'FB_IMG_1791114947081.jpg': 'Teacher Vevian Joy at laptop desk',
    'FB_IMG_1791115994697.jpg': 'Family pizza meal at Shakey\'s',
    'FB_IMG_1791115960077.jpg': 'Family lunch at Penong\'s',
    'Screenshot_20261004_194041_com.facebook.katana_edit_349349190482107.jpg': 'Family formal portrait',
    'FB_IMG_1791114992884.jpg': 'In the hills with cowboy boots & hat',
    'FB_IMG_1791114846980.jpg': '43rd Graduation ceremony',
    'Messenger_creation_33D8BA9E-F0FC-4F5A-AF19-37B8AA2E9294.jpeg': 'River memory with Father & young Jop',
    'FB_IMG_1791114131805.jpg': 'Dancing on sunny white sand beach',
    'FB_IMG_1791114118238.jpg': 'Waving at the turquoise ocean',
  };

  const currentIndex = activeLightboxItem 
    ? giftContent.memories.findIndex(m => m.id === activeLightboxItem.id) 
    : -1;

  // Reset zoom & rotation when lightbox opens/changes
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
  }, [activeLightboxItem]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      openLightbox(giftContent.memories[currentIndex - 1]);
    } else {
      openLightbox(giftContent.memories[giftContent.memories.length - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < giftContent.memories.length - 1) {
      openLightbox(giftContent.memories[currentIndex + 1]);
    } else {
      openLightbox(giftContent.memories[0]);
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2.2 : 1));
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeLightboxItem) return;
    const a = document.createElement('a');
    a.href = activeLightboxItem.image;
    a.download = `teacher-vevian-joy-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeLightboxItem) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxItem, currentIndex]);

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen">
      
      {/* Top Bar with 'Previous' Button */}
      <div className="flex items-center justify-between mb-8 text-xs font-medium text-stone-500">
        <button
          onClick={goToPrevScreen}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200/90 bg-white/90 backdrop-blur-xs hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer group shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Previous: A Son's Letter</span>
        </button>
      </div>

      {/* Clean Header - Pure Tribute */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 font-medium tracking-tight mb-2">
          Moments in Time
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-serif italic">
          Photographs of Teacher Vevian Joy Sangahan
        </p>
      </div>

      {/* Pure Photos Grid - Locked, Permanent & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {giftContent.memories.map((item, idx) => {
          const desc = PHOTO_DESCRIPTIONS[item.image] || `Photo ${idx + 1}`;

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => openLightbox(item)}
              className="group relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 shadow-warm-elevated hover:shadow-warm-float transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.image}
                alt={desc}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Hover Action Toolbar on photo */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900/85 backdrop-blur-xs text-white text-xs rounded-full shadow-md font-medium">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>View Full Size</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Lightbox Viewer with Image Tools */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          >
            {/* Top Toolbar in Lightbox */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute top-4 inset-x-4 max-w-4xl mx-auto flex items-center justify-between text-white z-50 px-2"
            >
              {/* Photo counter */}
              <span className="text-xs text-stone-300 font-mono">
                {currentIndex + 1} / {giftContent.memories.length}
              </span>

              {/* Image Controls Toolbar (Zoom, Rotate, Download, Close) */}
              <div className="flex items-center gap-2">
                {/* Rotate 90 deg */}
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Rotate photo 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Zoom toggle */}
                <button
                  onClick={handleZoomToggle}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={`Zoom ${zoomLevel > 1 ? 'Out' : 'In'}`}
                >
                  {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Download photo"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-full bg-white/15 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer z-50 hidden sm:block"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer z-50 hidden sm:block"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Image Container */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-4xl max-h-[82vh] w-full flex flex-col items-center justify-center overflow-hidden select-none"
            >
              <motion.img
                key={activeLightboxItem.id}
                src={activeLightboxItem.image}
                alt="Teacher Vevian Joy Sangahan Memory"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.25s ease-out'
                }}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Forward 'Next' Button */}
      <div className="mt-14 flex justify-end max-w-5xl mx-auto">
        <button
          onClick={goToNextScreen}
          className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-serif tracking-wide transition-all shadow-warm-subtle hover:shadow-warm-elevated cursor-pointer group"
        >
          <span>Next: Best Teacher Ever</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>

    </div>
  );
};
