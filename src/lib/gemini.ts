/**
 * Google Gemini AI Client Service
 * Powers autonomous agent synthesis, Chief Editor morning addresses,
 * nuance perspective dials, semantic Q&A, and Gemini API Image Generation.
 */

import { generateBroadsheetWoodcutSvg, svgToDataUrl } from './broadsheetArt';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const isGeminiConfigured = (): boolean => Boolean(GEMINI_API_KEY);

interface GeminiGenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiImageResult {
  imageUrl: string;
  prompt: string;
  caption: string;
  model: string;
  provider: 'gemini-imagen' | 'gemini-flash-svg' | 'curated-woodcut';
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
 * Gemini API Image Generation Service
 * Synthesizes vintage 19th-century newspaper editorial woodcut engravings
 * and broadsheet illustrations using Google Gemini Imagen 3 and Gemini Flash vector synthesis.
 */
export async function generateImageWithGemini(
  prompt: string,
  options: {
    articleTitle?: string;
    category?: string;
    aspectRatio?: '16:9' | '1:1' | '4:3';
  } = {}
): Promise<GeminiImageResult> {
  const articleTitle = options.articleTitle || 'Lead Story';
  const category = options.category || 'General';
  const caption = `Fig. 1: ${articleTitle} (Editorial Illustration)`;

  // Full Victorian broadsheet prompt tuning
  const broadsheetPrompt = `An authentic 19th-century Victorian newspaper broadsheet woodcut engraving editorial illustration. Detailed black ink cross-hatching, fine line etching on aged newsprint, decorative editorial border frame. Allegorical depiction of: ${prompt}. Monochrome aesthetic, highly detailed line art, traditional newspaper engraving style.`;

  // 1. Attempt Gemini Imagen 3 API (predict endpoint)
  if (GEMINI_API_KEY) {
    try {
      const imagenUrl = `${GEMINI_BASE_URL}/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
      const imagenPayload = {
        instances: [{ prompt: broadsheetPrompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: options.aspectRatio || '16:9',
          outputMimeType: 'image/jpeg'
        }
      };

      const imagenRes = await fetch(imagenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imagenPayload)
      });

      if (imagenRes.ok) {
        const data = await imagenRes.json();
        const b64 = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          return {
            imageUrl: `data:image/jpeg;base64,${b64}`,
            prompt: broadsheetPrompt,
            caption,
            model: 'imagen-3.0-generate-002',
            provider: 'gemini-imagen'
          };
        }
      }
    } catch (e) {
      console.warn('[Gemini Image] Imagen 3 predict attempt failed or unavailable, checking alternatives:', e);
    }

    // 2. Attempt Gemini Flash Image multimodal generation
    for (const imageModel of ['gemini-2.5-flash-image', 'gemini-3.1-flash-image']) {
      try {
        const flashImgUrl = `${GEMINI_BASE_URL}/${imageModel}:generateContent?key=${GEMINI_API_KEY}`;
        const flashRes = await fetch(flashImgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: broadsheetPrompt }] }]
          })
        });

        if (flashRes.ok) {
          const flashData = await flashRes.json();
          const parts = flashData.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/jpeg';
              return {
                imageUrl: `data:${mime};base64,${part.inlineData.data}`,
                prompt: broadsheetPrompt,
                caption,
                model: imageModel,
                provider: 'gemini-imagen'
              };
            }
          }
        }
      } catch (e) {
        console.warn(`[Gemini Image] Model ${imageModel} generation attempt skipped:`, e);
      }
    }

    // 3. Bespoke Gemini Flash Vector Woodcut Synthesis
    // Prompts Gemini Flash to construct an intricate, scalable SVG editorial woodcut
    try {
      const svgPrompt = `You are an elite 19th-century Victorian newspaper woodcut engraver.
Generate a valid, beautiful, standalone SVG editorial engraving for a newspaper front page.
Article Title: "${articleTitle}"
Category: "${category}"
Subject: "${prompt}"

Style Requirements:
- Authentic monochrome Victorian newspaper woodcut etching with fine cross-hatching, engraved borders, and classical scrollwork.
- Return ONLY the raw <svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">...</svg> markup.
- Do NOT include markdown code blocks, do not include any explanations.`;

      const aiSvg = await generateWithGemini(svgPrompt, undefined, { temperature: 0.3, maxOutputTokens: 2500 });
      if (aiSvg && aiSvg.includes('<svg') && aiSvg.includes('</svg>')) {
        const cleanSvg = aiSvg.substring(aiSvg.indexOf('<svg'), aiSvg.lastIndexOf('</svg>') + 6);
        return {
          imageUrl: svgToDataUrl(cleanSvg),
          prompt: broadsheetPrompt,
          caption,
          model: 'gemini-flash-vector-woodcut',
          provider: 'gemini-flash-svg'
        };
      }
    } catch (e) {
      console.warn('[Gemini Image] Gemini Flash SVG synthesis fallback encountered error:', e);
    }
  }

  // 4. Deterministic Broadsheet Woodcut Fallback
  // Guarantees an authentic 19th-century broadsheet engraving even without an API key
  const fallbackSvg = generateBroadsheetWoodcutSvg({
    title: articleTitle,
    category,
    theme: prompt
  });

  return {
    imageUrl: svgToDataUrl(fallbackSvg),
    prompt: broadsheetPrompt,
    caption,
    model: 'broadsheet-woodcut-engraver',
    provider: 'curated-woodcut'
  };
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
