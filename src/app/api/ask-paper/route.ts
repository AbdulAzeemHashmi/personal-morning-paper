import { NextResponse } from 'next/server';
import { INITIAL_ARTICLES } from '@/data/newsFeed';
import { askGeminiPaper, isGeminiConfigured } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Build context corpus from today's articles
    const articlesContext = INITIAL_ARTICLES.map(art => ({
      title: art.title,
      outlet: art.outlet,
      category: art.category,
      summary: `${art.subhead}\nLead: ${art.leadParagraph}\nKey Points: ${art.fullBody.slice(0, 2).join(' ')}`
    }));

    if (isGeminiConfigured()) {
      const geminiResult = await askGeminiPaper(query, articlesContext);
      return NextResponse.json(geminiResult);
    }

    // Heuristic fallback if Gemini API is temporarily offline
    const terms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const scored = INITIAL_ARTICLES.map(art => {
      let matches = 0;
      const haystack = `${art.title} ${art.subhead} ${art.leadParagraph} ${art.fullBody.join(' ')}`.toLowerCase();
      terms.forEach(t => {
        if (haystack.includes(t)) matches += 1;
      });
      return { ...art, matches };
    }).filter(a => a.matches > 0).sort((a, b) => b.matches - a.matches);

    if (scored.length === 0) {
      return NextResponse.json({
        answer: `While today's dispatches do not directly cover "${query}", today's broadsheet explores frontiers in ${INITIAL_ARTICLES.map(a => a.category).slice(0, 3).join(', ')}. Ask about autonomous agents, clean energy deflation, deep focus rituals, or sovereign semiconductors.`,
        sources: []
      });
    }

    const topMatch = scored[0];
    const relevantParagraph = topMatch.fullBody[0] || topMatch.leadParagraph;
    const answer = `Regarding "${query}": According to ${topMatch.outlet}'s dispatch ("${topMatch.title}"), ${relevantParagraph} Furthermore, the reporting notes that: "${topMatch.subhead}".`;

    return NextResponse.json({
      answer,
      sources: scored.slice(0, 2).map(s => ({
        title: s.title,
        outlet: s.outlet,
        category: s.category
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
