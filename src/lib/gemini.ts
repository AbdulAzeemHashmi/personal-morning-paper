/**
 * Google Gemini AI Client Service
 * Powers autonomous agent synthesis, Chief Editor morning addresses,
 * nuance perspective dials, and semantic Q&A.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const isGeminiConfigured = (): boolean => Boolean(GEMINI_API_KEY);

interface GeminiGenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Text content generation with automatic model cascading
 * (falls back to alternative flash models if 429 quota is encountered).
 */
export async function generateWithGemini(
  prompt: string,
  systemInstruction?: string,
  options: GeminiGenerateOptions = {}
): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] GEMINI_API_KEY is missing, using fallback heuristics');
    return null;
  }

  const modelCandidates = options.model
    ? [options.model]
    : ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];

  for (const model of modelCandidates) {
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const payload: any = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxOutputTokens ?? 1024
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 429) {
        console.warn(`[Gemini] Model ${model} reached quota limit (429), cascading to next model...`);
        continue;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.warn(`[Gemini] Model ${model} returned ${response.status}:`, errData);
        continue;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text?.trim();

      if (text) {
        return text;
      }
    } catch (error) {
      console.error(`[Gemini] Request failed for model ${model}:`, error);
    }
  }

  return null;
}

/**
 * Ask The Paper: Generates a grounded, citation-rich answer to a reader's question
 * using today's articles as the knowledge base.
 */
export async function askGeminiPaper(
  query: string,
  articlesContext: { title: string; outlet: string; category: string; summary: string }[]
): Promise<{ answer: string; sources: { title: string; outlet: string; category: string }[] }> {
  const contextString = articlesContext
    .map((a, i) => `[Source ${i + 1}] "${a.title}" (${a.outlet} | ${a.category}):\n${a.summary}`)
    .join('\n\n');

  const systemPrompt = `You are the Chief Research Librarian of "Jimmy Morning Chronicle", an elite intellectual broadsheet.
Answer the reader's question using ONLY the provided articles.
Provide an insightful, elegant, and factually grounded response with explicit attribution to the source outlets.
Keep the response to 2-3 concise paragraphs. If the question cannot be answered from the articles, gracefully synthesize what the paper does cover and suggest related queries.`;

  const userPrompt = `Articles in Today's Edition:
${contextString}

Reader Inquiry: "${query}"

Provide your synthesized editorial response with citations:`;

  const responseText = await generateWithGemini(userPrompt, systemPrompt, { temperature: 0.4 });

  if (responseText) {
    const matchedSources = articlesContext
      .filter(a => responseText.toLowerCase().includes(a.outlet.toLowerCase()) || responseText.toLowerCase().includes(a.title.slice(0, 20).toLowerCase()))
      .slice(0, 3)
      .map(s => ({ title: s.title, outlet: s.outlet, category: s.category }));

    return {
      answer: responseText,
      sources: matchedSources.length > 0 ? matchedSources : articlesContext.slice(0, 2)
    };
  }

  // Graceful heuristic fallback
  return {
    answer: `Regarding "${query}": According to today's dispatches in ${articlesContext[0]?.outlet || 'our lead report'}, key developments highlight structural shifts across ${articlesContext.map(a => a.category).slice(0, 2).join(' and ')}.`,
    sources: articlesContext.slice(0, 2)
  };
}
