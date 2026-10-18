import { Article, ReaderProfile, LearningSignals, PaperEdition } from '../types';
import { AgentLog, EditorialWorkflowState } from './types';
import { CuratorAgent } from './CuratorAgent';
import { ChiefEditorAgent } from './ChiefEditorAgent';
import { NuanceAgent } from './NuanceAgent';
import { PuzzleAgent } from './PuzzleAgent';
import { ArtDirectorAgent } from './ArtDirectorAgent';
import { INITIAL_ARTICLES } from '../data/newsFeed';

export class NewsroomOrchestrator {
  public static async assembleEdition(
    profile: ReaderProfile,
    signals: LearningSignals,
    dateOffsetDays: number = 0,
    articles: Article[] = INITIAL_ARTICLES
  ): Promise<{ edition: PaperEdition; logs: AgentLog[] }> {
    const logs: AgentLog[] = [];

    logs.push({
      agent: 'Newsroom Orchestrator (Central Dispatch)',
      role: 'newsroom_anchor',
      message: `Initiating multi-agent press run for ${profile.name} (Volume ${1 + Math.floor(dateOffsetDays / 30)}, Issue ${42 + dateOffsetDays}).`,
      timestamp: Date.now()
    });

    // 1. Curator Agent Reranks
    const { leadArticle, sideArticles, sections } = await CuratorAgent.execute(
      profile,
      signals,
      articles,
      logs
    );

    // 2. Parallel Agent Execution (including Gemini Image Art Director)
    const [chiefEditorNote, nuancePerspective, coffeeBreak, artResult] = await Promise.all([
      ChiefEditorAgent.execute(profile, leadArticle, sideArticles, logs),
      NuanceAgent.execute(leadArticle, logs),
      PuzzleAgent.execute(leadArticle.category, logs),
      ArtDirectorAgent.execute(leadArticle, profile, logs)
    ]);

    // Attach nuance perspective and generated artwork to lead article
    leadArticle.nuancePerspective = nuancePerspective;
    if (artResult?.imageUrl) {
      leadArticle.imageUrl = artResult.imageUrl;
    }

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dateOffsetDays);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = targetDate.toLocaleDateString('en-US', options);
    const shortDate = targetDate.toISOString().split('T')[0];

    const volume = 1 + Math.floor(dateOffsetDays / 30);
    const issue = 42 + dateOffsetDays;

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
      frontPageSideArticles: sideArticles,
      sections,
      coffeeBreak
    };

    logs.push({
      agent: 'Newsroom Orchestrator (Central Dispatch)',
      role: 'newsroom_anchor',
      message: `Press run successfully assembled. Broadside ready for web and PDF dissemination.`,
      timestamp: Date.now()
    });

    return { edition, logs };
  }
}
