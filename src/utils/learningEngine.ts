import { Article, ReaderProfile, LearningSignals, PaperEdition, NuancePerspective } from '../types';
import { INITIAL_ARTICLES, MOCK_CHIEF_EDITOR_NOTE, MOCK_COFFEE_BREAK } from '../data/newsFeed';
import { generateBroadsheetWoodcutSvg, svgToDataUrl } from '../lib/broadsheetArt';

const STORAGE_KEYS = {
  PROFILE: 'pmp_reader_profile',
  SIGNALS: 'pmp_learning_signals',
  EDITIONS: 'pmp_editions_history',
  CURRENT_EDITION: 'pmp_current_edition',
  ACTIVE_DATE: 'pmp_active_date'
};

export const DEFAULT_PROFILE: ReaderProfile = {
  name: 'Abdul Azeem',
  location: 'San Francisco, CA',
  newspaperName: 'Jimmy Morning Chronicle',
  motto: 'Veritas, Gravitas et Lux: An Intelligent Daily Broadsheet',
  readingTime: '15min',
  tone: 'analytical',
  topics: ['Technology & AI', 'Markets & Finance', 'Science & Cosmos', 'Culture & Ideas'],
  customKeywords: ['Agentic AI', 'Semiconductors', 'Macroeconomics'],
  onboardingCompleted: false,
  theme: 'broadsheet'
};

export const DEFAULT_SIGNALS: LearningSignals = {
  categoryWeights: {
    'Technology & AI': 1.3,
    'Markets & Finance': 1.1,
    'Science & Cosmos': 1.0,
    'Culture & Ideas': 0.9,
    'World & Geopolitics': 0.8,
    'Climate & Energy': 0.8,
    'Health & Longevity': 0.8
  },
  keywordWeights: {
    'Agentic AI': 1.5,
    'Semiconductors': 1.3,
    'Macroeconomics': 1.2
  },
  skipsCount: 0,
  readsCount: 0,
  likesCount: 0,
  bookmarksCount: 0,
  recentInteractions: []
};

// Storage Helpers
export function loadReaderProfile(): ReaderProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.newspaperName === 'The Azeem Morning Chronicle') {
        parsed.newspaperName = 'Jimmy Morning Chronicle';
        saveReaderProfile(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load profile from storage, using default', e);
  }
  return DEFAULT_PROFILE;
}

export function saveReaderProfile(profile: ReaderProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadLearningSignals(): LearningSignals {
  if (typeof window === 'undefined') return DEFAULT_SIGNALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SIGNALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load signals from storage', e);
  }
  return DEFAULT_SIGNALS;
}

export function saveLearningSignals(signals: LearningSignals): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SIGNALS, JSON.stringify(signals));
  } catch (e) {
    console.error('Failed to save signals', e);
  }
}

// Learning Signal Updates
export function registerSkip(articleId: string, category: string, title: string, tags: string[] = []): { profile: ReaderProfile; signals: LearningSignals; edition: PaperEdition } {
  const profile = loadReaderProfile();
  const signals = loadLearningSignals();

  // Negative adjustment to category
  const currentWeight = signals.categoryWeights[category] ?? 1.0;
  signals.categoryWeights[category] = Math.max(0.2, Number((currentWeight - 0.25).toFixed(2)));

  // Negative adjustment to keywords
  tags.forEach(t => {
    const kw = signals.keywordWeights[t] ?? 1.0;
    signals.keywordWeights[t] = Math.max(0.3, Number((kw - 0.2).toFixed(2)));
  });

  signals.skipsCount += 1;
  signals.recentInteractions.unshift({
    articleId,
    title,
    category,
    action: 'skip',
    timestamp: Date.now()
  });
  if (signals.recentInteractions.length > 30) {
    signals.recentInteractions.pop();
  }

  saveLearningSignals(signals);

  // Rerank and save edition
  const currentEdition = loadCurrentEdition();
  let updatedEdition = markArticleState(currentEdition, articleId, { isSkipped: true });

  // If lead article was skipped, promote the highest unskipped side story to cover position
  if (updatedEdition.leadArticle.id === articleId) {
    const candidateSide = updatedEdition.frontPageSideArticles.find(a => !a.isSkipped);
    if (candidateSide) {
      updatedEdition.frontPageSideArticles = updatedEdition.frontPageSideArticles.filter(a => a.id !== candidateSide.id);
      updatedEdition.leadArticle = { ...candidateSide, isLeadStory: true };
    }
  }

  saveCurrentEdition(updatedEdition);

  return { profile, signals, edition: updatedEdition };
}

export function registerRead(articleId: string, category: string, title: string, tags: string[] = []): { signals: LearningSignals } {
  const signals = loadLearningSignals();

  // Positive reinforcement
  const currentWeight = signals.categoryWeights[category] ?? 1.0;
  signals.categoryWeights[category] = Math.min(3.0, Number((currentWeight + 0.15).toFixed(2)));

  tags.forEach(t => {
    const kw = signals.keywordWeights[t] ?? 1.0;
    signals.keywordWeights[t] = Math.min(3.0, Number((kw + 0.15).toFixed(2)));
  });

  signals.readsCount += 1;
  signals.recentInteractions.unshift({
    articleId,
    title,
    category,
    action: 'read',
    timestamp: Date.now()
  });
  if (signals.recentInteractions.length > 30) {
    signals.recentInteractions.pop();
  }

  saveLearningSignals(signals);
  return { signals };
}

export function registerLike(articleId: string, category: string, title: string, tags: string[] = []): { signals: LearningSignals; edition: PaperEdition } {
  const signals = loadLearningSignals();

  // Strong positive reinforcement
  const currentWeight = signals.categoryWeights[category] ?? 1.0;
  signals.categoryWeights[category] = Math.min(3.5, Number((currentWeight + 0.35).toFixed(2)));

  tags.forEach(t => {
    const kw = signals.keywordWeights[t] ?? 1.0;
    signals.keywordWeights[t] = Math.min(3.5, Number((kw + 0.25).toFixed(2)));
  });

  signals.likesCount += 1;
  signals.recentInteractions.unshift({
    articleId,
    title,
    category,
    action: 'like',
    timestamp: Date.now()
  });
  if (signals.recentInteractions.length > 30) {
    signals.recentInteractions.pop();
  }

  saveLearningSignals(signals);

  const currentEdition = loadCurrentEdition();
  const updatedEdition = markArticleState(currentEdition, articleId, { isLiked: true });
  saveCurrentEdition(updatedEdition);

  return { signals, edition: updatedEdition };
}

export function registerBookmark(articleId: string, category: string, title: string): { signals: LearningSignals; edition: PaperEdition } {
  const signals = loadLearningSignals();
  signals.bookmarksCount += 1;
  signals.recentInteractions.unshift({
    articleId,
    title,
    category,
    action: 'bookmark',
    timestamp: Date.now()
  });

  saveLearningSignals(signals);

  const currentEdition = loadCurrentEdition();
  const updatedEdition = markArticleState(currentEdition, articleId, { isBookmarked: true });
  saveCurrentEdition(updatedEdition);

  return { signals, edition: updatedEdition };
}

function markArticleState(edition: PaperEdition, articleId: string, updates: Partial<Article>): PaperEdition {
  const updateArticle = (a: Article) => (a.id === articleId ? { ...a, ...updates } : a);

  return {
    ...edition,
    leadArticle: updateArticle(edition.leadArticle),
    frontPageSideArticles: edition.frontPageSideArticles.map(updateArticle),
    sections: edition.sections.map(sec => ({
      ...sec,
      articles: sec.articles.map(updateArticle)
    }))
  };
}

// Compute relevance scores and compose edition
export function generatePersonalEdition(
  profile: ReaderProfile = loadReaderProfile(),
  signals: LearningSignals = loadLearningSignals(),
  dateOffsetDays: number = 0
): PaperEdition {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dateOffsetDays);

  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = targetDate.toLocaleDateString('en-US', options);
  const shortDate = targetDate.toISOString().split('T')[0];

  const volume = 1 + Math.floor(dateOffsetDays / 30);
  const issue = 42 + dateOffsetDays;

  // Score articles
  const scoredArticles = INITIAL_ARTICLES.map(art => {
    let score = 1.0;

    // Check if category in user profile
    const isChosenCategory = profile.topics.includes(art.category);
    score *= isChosenCategory ? 1.4 : 0.6;

    // Factor in learned category weight
    const catWeight = signals.categoryWeights[art.category] ?? 1.0;
    score *= catWeight;

    // Factor in keywords
    art.tags.forEach(tag => {
      if (profile.customKeywords.some(ck => ck.toLowerCase() === tag.toLowerCase())) {
        score += 0.8;
      }
      const kwWeight = signals.keywordWeights[tag];
      if (kwWeight) {
        score += (kwWeight - 1.0) * 0.5;
      }
    });

    // Check recent skips
    const skippedRecently = signals.recentInteractions.some(
      i => i.articleId === art.id && i.action === 'skip'
    );
    if (skippedRecently) {
      score -= 3.0; // severe penalty
    }

    return {
      ...art,
      relevanceScore: Number(score.toFixed(2))
    };
  });

  // Sort by score
  const sorted = [...scoredArticles].sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

  // Lead story is highest scored non-skipped article
  const leadArticle = sorted[0];
  leadArticle.isLeadStory = true;
  if (!leadArticle.imageUrl) {
    leadArticle.imageUrl = svgToDataUrl(generateBroadsheetWoodcutSvg({
      title: leadArticle.title,
      category: leadArticle.category
    }));
  }

  // Front page side articles (next 2-3 highest)
  const frontPageSideArticles = sorted.slice(1, 3);

  // Group remainder into sections
  const remaining = sorted.slice(3);
  const sectionMap: Record<string, Article[]> = {};

  remaining.forEach(art => {
    if (!sectionMap[art.category]) {
      sectionMap[art.category] = [];
    }
    sectionMap[art.category].push(art);
  });

  const sections = Object.entries(sectionMap).map(([category, articles]) => ({
    category,
    articles
  }));

  const weatherOptions = [
    { city: profile.location || 'San Francisco', temp: '64°F', condition: 'Crisp Morning Fog & Sunshine' },
    { city: profile.location || 'London', temp: '54°F', condition: 'Misty Dawn, Clearing by Noon' },
    { city: profile.location || 'New York', temp: '61°F', condition: 'Autumn Breeze & Clear Skies' }
  ];
  const weather = weatherOptions[Math.abs(dateOffsetDays) % weatherOptions.length];

  const quotes = [
    { quote: 'Knowledge is of two kinds: we know a subject ourselves, or we know where we can find information upon it.', author: 'Samuel Johnson' },
    { quote: 'To read without reflecting is like eating without digesting.', author: 'Edmund Burke' },
    { quote: 'The morning hour has gold in its mouth.', author: 'Latin Proverb (Aurora habet aurum in ore)' },
    { quote: 'Clarity affords focus; focus generates momentum.', author: 'Marcus Aurelius' }
  ];
  const morningQuote = quotes[Math.abs(dateOffsetDays) % quotes.length];

  // Tailored Chief Editor Note
  const chiefEditorNote = {
    ...MOCK_CHIEF_EDITOR_NOTE,
    headline: `The Morning Dispatch for ${profile.name}: Focus in an Accelerated Age`,
    narrative: `Good morning, ${profile.name}. Today's paper is calibrated for your ${profile.readingTime} reading window and an ${profile.tone} disposition. Our editorial engine prioritized ${profile.topics.slice(0, 3).join(', ')}, reflecting your recent interest patterns. As technological capabilities compound, your morning paper remains your bounded oasis of deliberate comprehension.`
  };

  const edition: PaperEdition = {
    editionId: `edition-${shortDate}`,
    dateStr,
    shortDate,
    volume,
    issue,
    weather,
    morningQuote,
    chiefEditorNote,
    leadArticle,
    frontPageSideArticles,
    sections,
    coffeeBreak: MOCK_COFFEE_BREAK
  };

  return edition;
}

export function loadCurrentEdition(): PaperEdition {
  if (typeof window === 'undefined') return generatePersonalEdition();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_EDITION);
    if (raw) {
      const parsed: PaperEdition = JSON.parse(raw);
      if (parsed.leadArticle && !parsed.leadArticle.imageUrl) {
        parsed.leadArticle.imageUrl = svgToDataUrl(generateBroadsheetWoodcutSvg({
          title: parsed.leadArticle.title,
          category: parsed.leadArticle.category
        }));
        saveCurrentEdition(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load current edition, generating fresh one', e);
  }
  const fresh = generatePersonalEdition();
  saveCurrentEdition(fresh);
  return fresh;
}

export function saveCurrentEdition(edition: PaperEdition): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_EDITION, JSON.stringify(edition));
    // Also save into historical editions list
    saveEditionToHistory(edition);
  } catch (e) {
    console.error('Failed to save current edition', e);
  }
}

export function loadEditionsHistory(): PaperEdition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EDITIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load edition history', e);
  }
  return [];
}

export function saveEditionToHistory(edition: PaperEdition): void {
  try {
    const history = loadEditionsHistory();
    const existingIndex = history.findIndex(e => e.editionId === edition.editionId);
    if (existingIndex >= 0) {
      history[existingIndex] = edition;
    } else {
      history.unshift(edition);
    }
    // Keep max 10 past editions
    if (history.length > 10) history.pop();
    localStorage.setItem(STORAGE_KEYS.EDITIONS, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save to history', e);
  }
}

// Generate previous archive editions for the user to explore past editions immediately
export function ensureInitialArchiveEditions(): void {
  const history = loadEditionsHistory();
  if (history.length === 0) {
    const profile = loadReaderProfile();
    const signals = loadLearningSignals();
    // Generate yesterday and 2 days ago
    const yesterday = generatePersonalEdition(profile, signals, -1);
    const dayBefore = generatePersonalEdition(profile, signals, -2);
    saveEditionToHistory(dayBefore);
    saveEditionToHistory(yesterday);
  }
}
