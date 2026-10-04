import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScreenId, GiftContent, MemoryItem } from '../types';
import { initialGiftContent } from '../data/defaultContent';
import { audioManager } from '../services/audioService';
import { savePermanentPhoto, getPermanentPhotos, savePhotoToServer, fetchServerPhotos } from '../services/imageStorage';

interface GiftContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  goToNextScreen: () => void;
  goToPrevScreen: () => void;
  giftContent: GiftContent;
  updateGiftContent: (updater: (prev: GiftContent) => GiftContent) => void;
  resetToDefault: () => void;
  isAudioPlaying: boolean;
  toggleAudio: () => void;
  currentVolume: number;
  setVolume: (vol: number) => void;
  isPersonalizeOpen: boolean;
  setIsPersonalizeOpen: (open: boolean) => void;
  hasUnwrapped: boolean;
  setHasUnwrapped: (val: boolean) => void;
  activeLightboxItem: MemoryItem | null;
  openLightbox: (item: MemoryItem) => void;
  closeLightbox: () => void;
  toggleCouponRedemption: (id: string) => void;
  addCustomMemory: (memory: Omit<MemoryItem, 'id'>) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (id: string, updated: Partial<MemoryItem>) => void;
}

const GiftContext = createContext<GiftContextType | null>(null);

const STORAGE_KEY = 'teachers_day_gift_data_vevian_v8';

const SCREEN_SEQUENCE: ScreenId[] = ['hero', 'letter', 'memories', 'appreciation', 'finale'];

export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenId>('hero');
  const [hasUnwrapped, setHasUnwrapped] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [currentVolume, setCurrentVolumeState] = useState<number>(0.6);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState<boolean>(false);
  const [activeLightboxItem, setActiveLightboxItem] = useState<MemoryItem | null>(null);

  const [giftContent, setGiftContent] = useState<GiftContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return initialGiftContent;
  });

  // Hydrate permanent photos: from Server first (for all devices), then local IndexedDB
  useEffect(() => {
    async function loadAllPhotos() {
      // 1. Fetch shared server photos (works on anyone's device)
      const serverPhotos = await fetchServerPhotos();
      
      // 2. Fetch local indexedDB photos
      const localPhotos = await getPermanentPhotos();

      // If local has photos not yet on the server, upload them to the server so anyone can see them!
      for (const [id, base64] of Object.entries(localPhotos)) {
        if (!serverPhotos[id] && base64.startsWith('data:')) {
          savePhotoToServer(id, base64).then((serverUrl) => {
            if (serverUrl) {
              setGiftContent(prev => ({
                ...prev,
                memories: prev.memories.map(m => m.id === id ? { ...m, image: serverUrl } : m)
              }));
            }
          });
        }
      }

      const mergedPhotos = { ...localPhotos, ...serverPhotos };

      if (Object.keys(mergedPhotos).length > 0) {
        setGiftContent((prev) => {
          let hasChanges = false;
          const memories = prev.memories.map((m) => {
            const permanentData = mergedPhotos[m.id] || mergedPhotos[m.image];
            if (permanentData && permanentData !== m.image) {
              hasChanges = true;
              return { ...m, image: permanentData };
            }
            return m;
          });
          return hasChanges ? { ...prev, memories } : prev;
        });
      }
    }

    loadAllPhotos();
  }, []);

  // Save changes to Server, IndexedDB and localStorage
  useEffect(() => {
    // 1. Save data: photos to IndexedDB and Server permanently
    giftContent.memories.forEach((m) => {
      if (m.image && m.image.startsWith('data:')) {
        savePermanentPhoto(m.id, m.image);
        savePhotoToServer(m.id, m.image).then((serverUrl) => {
          if (serverUrl) {
            setGiftContent(prev => ({
              ...prev,
              memories: prev.memories.map(item => item.id === m.id ? { ...item, image: serverUrl } : item)
            }));
          }
        });
      }
    });

    // 2. Save state to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(giftContent));
    } catch {
      // If quota exceeded, save lightweight version (IndexedDB + Server have full images)
      try {
        const lightweight = {
          ...giftContent,
          memories: giftContent.memories.map((m) => ({
            ...m,
            image: m.image.startsWith('data:') ? `[idb:${m.id}]` : m.image,
          })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
      } catch {
        // Safe fallback
      }
    }
  }, [giftContent]);

  const setCurrentScreen = (screen: ScreenId) => {
    audioManager.playSoftClick();
    setCurrentScreenState(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextScreen = () => {
    const currentIndex = SCREEN_SEQUENCE.indexOf(currentScreen);
    if (currentIndex < SCREEN_SEQUENCE.length - 1) {
      setCurrentScreen(SCREEN_SEQUENCE[currentIndex + 1]);
    } else {
      setCurrentScreen('hero');
    }
  };

  const goToPrevScreen = () => {
    const currentIndex = SCREEN_SEQUENCE.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(SCREEN_SEQUENCE[currentIndex - 1]);
    }
  };

  const updateGiftContent = (updater: (prev: GiftContent) => GiftContent) => {
    setGiftContent(updater);
  };

  const resetToDefault = () => {
    setGiftContent(initialGiftContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioManager.stopAmbientSoundscape();
      setIsAudioPlaying(false);
    } else {
      audioManager.startAmbientSoundscape('piano');
      setIsAudioPlaying(true);
    }
  };

  const setVolume = (vol: number) => {
    setCurrentVolumeState(vol);
    audioManager.setVolume(vol);
  };

  const openLightbox = (item: MemoryItem) => {
    audioManager.playSoftClick();
    setActiveLightboxItem(item);
  };

  const closeLightbox = () => {
    setActiveLightboxItem(null);
  };

  const toggleCouponRedemption = (id: string) => {
    audioManager.playSoftClick();
    setGiftContent(prev => ({
      ...prev,
      coupons: prev.coupons.map(c => 
        c.id === id ? { ...c, redeemed: !c.redeemed } : c
      )
    }));
  };

  const addCustomMemory = (newMemory: Omit<MemoryItem, 'id'>) => {
    const item: MemoryItem = {
      ...newMemory,
      id: `custom-${Date.now()}`
    };
    setGiftContent(prev => ({
      ...prev,
      memories: [item, ...prev.memories]
    }));
  };

  const deleteMemory = (id: string) => {
    audioManager.playSoftClick();
    setGiftContent(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== id)
    }));
  };

  const updateMemory = (id: string, updated: Partial<MemoryItem>) => {
    setGiftContent(prev => ({
      ...prev,
      memories: prev.memories.map(m => m.id === id ? { ...m, ...updated } : m)
    }));
  };

  return (
    <GiftContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        goToNextScreen,
        goToPrevScreen,
        giftContent,
        updateGiftContent,
        resetToDefault,
        isAudioPlaying,
        toggleAudio,
        currentVolume,
        setVolume,
        isPersonalizeOpen,
        setIsPersonalizeOpen,
        hasUnwrapped,
        setHasUnwrapped,
        activeLightboxItem,
        openLightbox,
        closeLightbox,
        toggleCouponRedemption,
        addCustomMemory,
        deleteMemory,
        updateMemory
      }}
    >
      {children}
    </GiftContext.Provider>
  );
};

export const useGift = () => {
  const context = useContext(GiftContext);
  if (!context) {
    throw new Error('useGift must be used within a GiftProvider');
  }
  return context;
};
