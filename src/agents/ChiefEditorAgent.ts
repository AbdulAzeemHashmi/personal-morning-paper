import { ChiefEditorNote, ReaderProfile, Article } from '../types';
import { AgentLog } from './types';

export class ChiefEditorAgent {
  public static async execute(
    profile: ReaderProfile,
    leadStory: Article,
    sideStories: Article[],
    logs: AgentLog[]
  ): Promise<ChiefEditorNote> {
    logs.push({
      agent: 'Chief Editor Agent (Aura-1)',
      role: 'chief_editor',
      message: `Analyzing macro-trends across "${leadStory.title}" and ${sideStories.length} side dispatches for reader ${profile.name}.`,
      timestamp: Date.now()
    });

    const keyTheme = leadStory.category === 'Technology & AI'
      ? 'Autonomous intelligence frontiers colliding with human cognitive restoration'
      : leadStory.category === 'Markets & Finance'
      ? 'Clean technology deflation disrupting traditional monetary orthodoxy'
      : 'Structural civilizational shifts in science, energy, and knowledge work';

    const toneAdverb = profile.tone === 'analytical'
      ? 'empirical rigor and systemic clarity'
      : profile.tone === 'executive'
      ? 'high-signal impact on capital, labor, and strategy'
      : profile.tone === 'curious'
      ? 'philosophical depth and cosmological wonder'
      : 'unvarnished contrarian analysis';

    let narrative = `Good morning, ${profile.name}. Today's edition is calibrated for your ${profile.readingTime} morning ritual with ${toneAdverb}. Across the globe, today's dispatches show that the boundary between human intent and machine execution is dissolving, while the physical foundations of energy and computing undergo historic restructuring. Your paper has been handcrafted by our multi-agent editorial desk to provide perspective before the noise of the day begins.`;

    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      try {
        const { generateWithGemini } = await import('../lib/gemini');
        const aiPrompt = `Write a short, elegant, high-impact 3-sentence Chief Editor Morning Address for a prestigious broadsheet named "Jimmy Morning Chronicle".
Reader Name: ${profile.name}
Tone: ${profile.tone} (${toneAdverb})
Reading window: ${profile.readingTime}
Front-page Lead Story: "${leadStory.title}" (${leadStory.outlet})
Side dispatches: ${sideStories.map(s => `"${s.title}"`).join(', ')}

Guidelines:
- Begin with "Good morning, ${profile.name}."
- Synthesize the overarching civilizational or technological narrative of today's headlines.
- Dignified, intellectual broadsheet tone.
- Maximum 75 words.`;

        const aiNarrative = await generateWithGemini(aiPrompt);
        if (aiNarrative) {
          narrative = aiNarrative;
          logs.push({
            agent: 'Chief Editor Agent (Aura-1)',
            role: 'chief_editor',
            message: `Synthesized bespoke morning address via Gemini 2.5 Flash for ${profile.name}.`,
            timestamp: Date.now()
          });
        }
      } catch {
        // Gracefully keep baseline narrative
      }
    }

    logs.push({
      agent: 'Chief Editor Agent (Aura-1)',
      role: 'chief_editor',
      message: `Formulated morning address: "${keyTheme}". Approved for broadsheet publication.`,
      timestamp: Date.now()
    });

    return {
      headline: `The Morning Dispatch for ${profile.name}: Deliberate Focus in an Accelerated World`,
      narrative,
      keyTheme,
      signoff: 'From the Editor Desk: Veritas, Gravitas et Lux.'
    };
  }
}
