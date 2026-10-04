import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useGift } from '../context/GiftContext';
import { TeacherLesson } from '../types';
import { audioManager } from '../services/audioService';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Home, 
  Quote, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Star, 
  Heart, 
  Award, 
  Flame 
} from 'lucide-react';

export const AppreciationScreen: React.FC = () => {
  const { giftContent, goToPrevScreen, goToNextScreen } = useGift();
  const [activeLessonId, setActiveLessonId] = useState<string>(giftContent.lessons[0]?.id || 'les-1');
  const [celebrateCount, setCelebrateCount] = useState<number>(1);
  const [reflectedIds, setReflectedIds] = useState<string[]>(['les-1']);

  const activeLesson = giftContent.lessons.find(l => l.id === activeLessonId) || giftContent.lessons[0];

  const triggerConfetti = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    audioManager.playWaxSealSound();
    setCelebrateCount(prev => prev + 1);

    // Multi-stage celebratory confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#D97706', '#F59E0B', '#FBBF24', '#B45309', '#EF4444', '#EC4899']
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F59E0B', '#FBBF24', '#D97706']
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F59E0B', '#FBBF24', '#D97706']
      });
    }, 250);
  };

  const handleSelectLesson = (lesson: TeacherLesson) => {
    audioManager.playSoftClick();
    setActiveLessonId(lesson.id);
    if (!reflectedIds.includes(lesson.id)) {
      setReflectedIds(prev => [...prev, lesson.id]);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      
      {/* Background Animated Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
            className="absolute text-amber-300/40"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + (i * 17) % 80}%`,
            }}
          >
            <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
          </motion.div>
        ))}
      </div>

      {/* Top Bar with 'Previous' Button & Confetti Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 text-xs font-medium text-stone-500">
        <button
          onClick={goToPrevScreen}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200/90 bg-white/90 backdrop-blur-xs hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-serif tracking-wide transition-all cursor-pointer group shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Previous: Moments in Time</span>
        </button>

        {/* Celebrate Best Teacher Ever Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerConfetti}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-medium text-xs shadow-md cursor-pointer transition-all"
          title="Shoot confetti to celebrate Teacher Vevian Joy!"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
          <span>Celebrate Best Teacher Ever! 🎉</span>
          {celebrateCount > 1 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
              x{celebrateCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Hero Dedication Banner - "Best Teacher Ever" with Animations */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        
        {/* Animated Trophy Emblem */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center p-3 sm:p-4 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 text-amber-900 border border-amber-300 shadow-warm-elevated mb-4"
        >
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-800 drop-shadow-sm" />
        </motion.div>

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-1.5 mb-2"
        >
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-[11px] font-bold tracking-widest uppercase text-amber-900 shadow-2xs">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            Official Award · Best Teacher Ever
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          </span>
        </motion.div>

        {/* Grand Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-900 font-medium tracking-tight mt-1 mb-3"
        >
          Best Teacher Ever
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-serif"
        >
          To <strong className="text-stone-900 font-semibold">Teacher Vevian Joy Sangahan</strong>: Extraordinary and tireless in the schoolroom, and the greatest, most patient teacher of my life.
        </motion.p>

      </div>

      {/* Main interactive split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: List of Best Teacher Accolades */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              Five Reasons You're The Best
            </p>
            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {reflectedIds.length} / {giftContent.lessons.length} Explored
            </span>
          </div>

          {giftContent.lessons.map((lesson) => {
            const isSelected = lesson.id === activeLessonId;
            const isRead = reflectedIds.includes(lesson.id);

            return (
              <motion.button
                key={lesson.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLesson(lesson)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 border-amber-600 shadow-warm-elevated ring-2 ring-amber-400/40' 
                    : 'bg-white border-stone-200/80 hover:bg-stone-50/80 text-stone-600 shadow-2xs'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeLessonStrip"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 to-amber-700" 
                  />
                )}

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  <span className="font-mono text-xs font-bold">
                    {lesson.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-serif text-base sm:text-lg font-medium leading-snug ${
                    isSelected ? 'text-stone-900' : 'text-stone-700'
                  }`}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 truncate">
                    {lesson.subtitle}
                  </p>
                </div>

                {isRead && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-1"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${
                      isSelected ? 'text-amber-700' : 'text-stone-300'
                    }`} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right column: Detailed Animated Accolade Showcase */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FDFBF7] rounded-3xl border border-stone-200/90 shadow-warm-elevated p-6 sm:p-8 md:p-10 relative overflow-hidden"
            >
              {/* Decorative Corner Golden Shine */}
              <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl" />

              {/* Card Header with Best Teacher Stamp */}
              <div className="border-b border-stone-200/60 pb-5 mb-6 relative">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
                  <span className="flex items-center gap-1 text-amber-800 font-semibold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    Best Teacher Accolade #{activeLesson.number}
                  </span>
                  
                  {/* Localized Confetti Trigger */}
                  <button
                    onClick={triggerConfetti}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors text-[11px] font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Celebrate</span>
                  </button>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-tight">
                  {activeLesson.title}
                </h2>
                <p className="text-xs text-amber-900/70 mt-1 italic font-serif">
                  {activeLesson.subtitle}
                </p>
              </div>

              {/* Double Perspectives: In the School vs At Home with Me */}
              <div className="space-y-5">
                
                {/* School Perspective */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
                    <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span>As Teacher Vevian Joy In School</span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed font-serif pl-8">
                    {activeLesson.classroomContext}
                  </p>
                </motion.div>

                {/* Home Perspective */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/80 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wide mb-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-200/70 flex items-center justify-center text-amber-900">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span>As My First Teacher At Home</span>
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed font-serif pl-8 font-medium">
                    {activeLesson.motherhoodContext}
                  </p>
                </motion.div>

                {/* Son Jop's Reflection */}
                <div className="pt-2 pl-2">
                  <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                    <span>What You Taught Me</span>
                  </p>
                  <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-serif italic">
                    "{activeLesson.reflection}"
                  </p>
                </div>

                {/* Best Teacher Quote Ribbon */}
                <div className="pt-4 border-t border-stone-200/60 flex items-start gap-3 text-stone-700 text-xs sm:text-sm bg-white/60 p-4 rounded-xl">
                  <Quote className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <p className="font-serif italic text-amber-950 font-medium">
                    {activeLesson.quote}
                  </p>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Forward 'Next' Button */}
      <div className="mt-14 flex justify-end max-w-6xl mx-auto">
        <button
          onClick={goToNextScreen}
          className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-serif tracking-wide transition-all shadow-warm-subtle hover:shadow-warm-elevated cursor-pointer group"
        >
          <span>Next: Lifetime Tribute</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>

    </div>
  );
};
