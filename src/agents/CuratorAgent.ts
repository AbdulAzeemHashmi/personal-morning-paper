import { Article, ReaderProfile, LearningSignals } from '../types';
import { AgentLog } from './types';

export class CuratorAgent {
  public static async execute(
    profile: ReaderProfile,
    signals: LearningSignals,
    articles: Article[],
    logs: AgentLog[]
  ): Promise<{ leadArticle: Article; sideArticles: Article[]; sections: { category: string; articles: Article[] }[] }> {
    logs.push({
      agent: 'Curator & Reranker Agent (Nexus-4)',
      role: 'curator_reranker',
      message: `Evaluating ${articles.length} candidates using Bayesian weights (${signals.skipsCount} historical skips, ${signals.likesCount} likes).`,
      timestamp: Date.now()
    });

    const scored = articles.map(art => {
      let score = 1.0;

      // Base category affinity
      const isChosen = profile.topics.includes(art.category);
      score *= isChosen ? 1.4 : 0.6;

      // Learned weight
      const catWeight = signals.categoryWeights[art.category] ?? 1.0;
      score *= catWeight;

      // Keywords match
      art.tags.forEach(tag => {
        if (profile.customKeywords.some(k => k.toLowerCase() === tag.toLowerCase())) {
          score += 0.8;
        }
        const kwWeight = signals.keywordWeights[tag];
        if (kwWeight) score += (kwWeight - 1.0) * 0.5;
      });

      // Skip penalty
      const wasSkipped = signals.recentInteractions.some(i => i.articleId === art.id && i.action === 'skip');
      if (wasSkipped) score -= 3.0;

      return { ...art, relevanceScore: Number(score.toFixed(2)) };
    });

    // Sort descending
    const sorted = [...scored].sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

    const leadArticle = { ...sorted[0], isLeadStory: true };
    const sideArticles = sorted.slice(1, 3);
    const remaining = sorted.slice(3);

    const sectionMap: Record<string, Article[]> = {};
    remaining.forEach(art => {
      if (!sectionMap[art.category]) sectionMap[art.category] = [];
      sectionMap[art.category].push(art);
    });

    const sections = Object.entries(sectionMap).map(([category, arts]) => ({
      category,
      articles: arts
    }));

    logs.push({
      agent: 'Curator & Reranker Agent (Nexus-4)',
      role: 'curator_reranker',
      message: `Selected Front Page Anchor: "${leadArticle.title}" (Score: ${leadArticle.relevanceScore}). Allocated ${sections.length} thematic sections.`,
      timestamp: Date.now()
    });

    return { leadArticle, sideArticles, sections };
  }
}
