import { Article, ReaderProfile } from '../types';
import { AgentLog } from './types';
import { generateImageWithGemini, GeminiImageResult } from '../lib/gemini';
import { generateBroadsheetWoodcutSvg, svgToDataUrl } from '../lib/broadsheetArt';

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
    const caption = `Fig. 1: ${leadStory.title}`;

    // 1. If running in browser, call the server API endpoint which has the Gemini API Key
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: leadStory.title,
            category: leadStory.category,
            prompt: visualMetaphor
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            logs.push({
              agent: 'Visual Art Director & Engraver (DaVinci-5)',
              role: 'art_director',
              message: `Engraved authentic editorial illustration using ${data.model} (${data.provider}).`,
              timestamp: Date.now()
            });

            return {
              imageUrl: data.imageUrl,
              prompt: visualMetaphor,
              caption: data.caption || caption,
              model: data.model || 'gemini-api',
              provider: data.provider || 'gemini-imagen'
            };
          }
        }
      } catch (clientErr) {
        console.warn('[ArtDirectorAgent] Client API call fallback to vector woodcut:', clientErr);
      }
    }

    // 2. Server-side or direct invocation
    try {
      const result = await generateImageWithGemini(visualMetaphor, {
        articleTitle: leadStory.title,
        category: leadStory.category,
        aspectRatio: '16:9'
      });

      if (result && result.imageUrl) {
        logs.push({
          agent: 'Visual Art Director & Engraver (DaVinci-5)',
          role: 'art_director',
          message: `Engraved authentic editorial illustration using ${result.model} (${result.provider}).`,
          timestamp: Date.now()
        });

        return result;
      }
    } catch (error) {
      console.warn('[ArtDirectorAgent] Error during generation, applying archival plate:', error);
    }

    // 3. Guaranteed Broadside Plate Fallback (NEVER returns empty string)
    const fallbackSvg = generateBroadsheetWoodcutSvg({
      title: leadStory.title,
      category: leadStory.category,
      theme: visualMetaphor
    });

    logs.push({
      agent: 'Visual Art Director & Engraver (DaVinci-5)',
      role: 'art_director',
      message: `Applied archival broadsheet woodcut plate for "${leadStory.category}".`,
      timestamp: Date.now()
    });

    return {
      imageUrl: svgToDataUrl(fallbackSvg),
      prompt: visualMetaphor,
      caption,
      model: 'broadsheet-woodcut-engraver',
      provider: 'curated-woodcut'
    };
  }
}
