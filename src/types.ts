export type ReadingTimePreference = '5min' | '15min' | '30min';
export type TonePreference = 'analytical' | 'executive' | 'curious' | 'provocative';

export interface ReaderProfile {
  name: string;
  location: string;
  newspaperName: string;
  motto: string;
  readingTime: ReadingTimePreference;
  tone: TonePreference;
  topics: string[];
  customKeywords: string[];
  onboardingCompleted: boolean;
  theme: 'broadsheet' | 'midnight' | 'sepia';
}

export interface LearningInteraction {
  articleId: string;
  title: string;
  category: string;
  action: 'skip' | 'read' | 'like' | 'bookmark';
  timestamp: number;
}

export interface LearningSignals {
  categoryWeights: Record<string, number>;
  keywordWeights: Record<string, number>;
  skipsCount: number;
  readsCount: number;
  likesCount: number;
  bookmarksCount: number;
  recentInteractions: LearningInteraction[];
}

export interface NuancePerspective {
  label1: string;
  view1: string;
  label2: string;
  view2: string;
  label3: string;
  view3: string;
}

export interface Article {
  id: string;
  title: string;
  subhead: string;
  author: string;
  outlet: string;
  outletUrl: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  leadParagraph: string;
  fullBody: string[];
  pullQuote?: string;
  imageUrl?: string;
  relevanceScore?: number;
  isLeadStory?: boolean;
  isSkipped?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  nuancePerspective?: NuancePerspective;
}

export interface CoffeeBreakItem {
  riddle: string;
  clue: string;
  answer: string;
  factOfTheDay: string;
  wordOfDay: {
    word: string;
    definition: string;
    origin: string;
  };
}

export interface ChiefEditorNote {
  headline: string;
  narrative: string;
  keyTheme: string;
  signoff: string;
}

export interface PaperEdition {
  editionId: string;
  dateStr: string; // e.g. "Saturday, October 17, 2026"
  shortDate: string; // "2026-10-17"
  volume: number;
  issue: number;
  weather: {
    temp: string;
    condition: string;
    city: string;
  };
  morningQuote: {
    quote: string;
    author: string;
  };
  chiefEditorNote: ChiefEditorNote;
  leadArticle: Article;
  frontPageSideArticles: Article[];
  sections: {
    category: string;
    articles: Article[];
  }[];
  coffeeBreak: CoffeeBreakItem;
}
