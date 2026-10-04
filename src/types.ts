export type ScreenId = 
  | 'hero'
  | 'letter'
  | 'memories'
  | 'appreciation'
  | 'finale';

export interface MemoryItem {
  id: string;
  title: string;
  dateStr: string;
  image: string;
  caption: string;
  category: 'classroom' | 'family' | 'milestone' | 'reflection';
  quote?: string;
}

export interface TeacherLesson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  classroomContext: string;
  motherhoodContext: string;
  reflection: string;
  quote: string;
}

export interface SurpriseCoupon {
  id: string;
  title: string;
  description: string;
  category: 'pampering' | 'cooking' | 'quiet' | 'adventure';
  redeemed: boolean;
  code: string;
}

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverImage: string;
  description: string;
}

export interface GiftContent {
  motherName: string;
  sonName: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  letterSalutation: string;
  letterBody: string[];
  letterClosing: string;
  memories: MemoryItem[];
  lessons: TeacherLesson[];
  coupons: SurpriseCoupon[];
  playlist: TrackInfo[];
  soundscapes: {
    id: string;
    label: string;
    sublabel: string;
    icon: string;
    frequency: number;
  }[];
}
