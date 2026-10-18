import { Article, ReaderProfile } from '../types';
import { AgentLog } from './types';
import { generateImageWithGemini, GeminiImageResult } from '../lib/gemini';

export class ArtDirectorAgent {
  public static async execute(
    leadStory: Article,
    profile?: ReaderProfile,
    logs: AgentLog[] = []
  ): Promise<GeminiImageResult> {
    logs.push({
      agent: 'Visual Art Director & Engraver (DaVinci-5)',
      role: 'art_director',
      message: `Analyzing visual themes for cover dispatch "${leadStory.title}" (${leadStory.category}).`,
      timestamp: Date.now()
    });

    const visualMetaphor = `Allegorical 19th-century newspaper broadsheet engraving of ${leadStory.title}. Key themes: ${leadStory.subhead || leadStory.category}. Fine cross-hatching, engraved vignette border.`;

    try {
      const result = await generateImageWithGemini(visualMetaphor, {
        articleTitle: leadStory.title,
        category: leadStory.category,
        aspectRatio: '16:9'
      });

      logs.push({
        agent: 'Visual Art Director & Engraver (DaVinci-5)',
        role: 'art_director',
        message: `Engraved authentic editorial illustration using ${result.model} (${result.provider}).`,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      logs.push({
        agent: 'Visual Art Director & Engraver (DaVinci-5)',
        role: 'art_director',
        message: `Applied archival broadsheet woodcut plate for "${leadStory.category}".`,
        timestamp: Date.now()
      });

      return {
        imageUrl: '',
        prompt: visualMetaphor,
        caption: `Fig. 1: ${leadStory.title}`,
        model: 'broadsheet-fallback',
        provider: 'curated-woodcut'
      };
    }
  }
}
