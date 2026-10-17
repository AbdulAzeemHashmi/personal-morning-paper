import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, initDatabase } from './db.js';
import { INITIAL_ARTICLES, MOCK_CHIEF_EDITOR_NOTE, MOCK_COFFEE_BREAK } from '../src/data/newsFeed.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite schema
initDatabase();

// Seed initial articles into SQLite if table is empty
function seedArticlesTable() {
  const count = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO articles (
        id, title, subhead, author, outlet, outlet_url, published_at, category,
        tags_json, reading_minutes, lead_paragraph, full_body_json, pull_quote, nuance_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const art of INITIAL_ARTICLES) {
      insert.run(
        art.id,
        art.title,
        art.subhead,
        art.author,
        art.outlet,
        art.outletUrl,
        art.publishedAt,
        art.category,
        JSON.stringify(art.tags),
        art.readingMinutes,
        art.leadParagraph,
        JSON.stringify(art.fullBody),
        art.pullQuote || null,
        art.nuancePerspective ? JSON.stringify(art.nuancePerspective) : null,
        Date.now()
      );
    }
  }
}
seedArticlesTable();

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  const interactionCount = db.prepare('SELECT COUNT(*) as count FROM learning_interactions').get() as { count: number };
  res.json({
    status: 'healthy',
    database: 'SQLite',
    walMode: true,
    stats: {
      articles: articleCount.count,
      interactionsLogged: interactionCount.count
    }
  });
});

// GET Profile
app.get('/api/profile', (req: Request, res: Response) => {
  const row = db.prepare('SELECT * FROM reader_profiles WHERE id = ?').get('default') as any;
  if (!row) return res.status(404).json({ error: 'Profile not found' });

  res.json({
    name: row.name,
    location: row.location,
    newspaperName: row.newspaper_name,
    motto: row.motto,
    readingTime: row.reading_time,
    tone: row.tone,
    topics: JSON.parse(row.topics_json),
    customKeywords: JSON.parse(row.keywords_json),
    theme: row.theme,
    onboardingCompleted: Boolean(row.onboarding_completed)
  });
});

// POST Profile
app.post('/api/profile', (req: Request, res: Response) => {
  const p = req.body;
  const update = db.prepare(`
    UPDATE reader_profiles SET
      name = ?, location = ?, newspaper_name = ?, motto = ?, reading_time = ?,
      tone = ?, topics_json = ?, keywords_json = ?, theme = ?, onboarding_completed = ?,
      updated_at = ?
    WHERE id = 'default'
  `);

  update.run(
    p.name,
    p.location,
    p.newspaperName,
    p.motto,
    p.readingTime,
    p.tone,
    JSON.stringify(p.topics || []),
    JSON.stringify(p.customKeywords || []),
    p.theme || 'broadsheet',
    p.onboardingCompleted ? 1 : 0,
    Date.now()
  );

  res.json({ success: true, profile: p });
});

// GET Signals & Weights Matrix
app.get('/api/signals', (req: Request, res: Response) => {
  const catRows = db.prepare('SELECT category, weight FROM category_weights').all() as any[];
  const kwRows = db.prepare('SELECT keyword, weight FROM keyword_weights').all() as any[];

  const categoryWeights: Record<string, number> = {};
  catRows.forEach(r => { categoryWeights[r.category] = Number(r.weight.toFixed(2)); });

  const keywordWeights: Record<string, number> = {};
  kwRows.forEach(r => { keywordWeights[r.keyword] = Number(r.weight.toFixed(2)); });

  const skips = db.prepare("SELECT COUNT(*) as count FROM learning_interactions WHERE action = 'skip'").get() as any;
  const reads = db.prepare("SELECT COUNT(*) as count FROM learning_interactions WHERE action = 'read'").get() as any;
  const likes = db.prepare("SELECT COUNT(*) as count FROM learning_interactions WHERE action = 'like'").get() as any;
  const bookmarks = db.prepare("SELECT COUNT(*) as count FROM learning_interactions WHERE action = 'bookmark'").get() as any;

  const recents = db.prepare('SELECT article_id, title, category, action, timestamp FROM learning_interactions ORDER BY timestamp DESC LIMIT 30').all() as any[];

  res.json({
    categoryWeights,
    keywordWeights,
    skipsCount: skips.count,
    readsCount: reads.count,
    likesCount: likes.count,
    bookmarksCount: bookmarks.count,
    recentInteractions: recents.map(r => ({
      articleId: r.article_id,
      title: r.title,
      category: r.category,
      action: r.action,
      timestamp: r.timestamp
    }))
  });
});

// POST Signal Action (skip, read, like, bookmark)
app.post('/api/signals/action', (req: Request, res: Response) => {
  const { articleId, title, category, action, tags = [] } = req.body;

  // Record interaction
  db.prepare(`
    INSERT INTO learning_interactions (article_id, title, category, action, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(articleId, title, category, action, Date.now());

  // Update weights
  if (action === 'skip') {
    const cur = db.prepare('SELECT weight FROM category_weights WHERE category = ?').get(category) as any;
    const newWeight = Math.max(0.2, (cur ? cur.weight : 1.0) - 0.25);
    db.prepare('INSERT OR REPLACE INTO category_weights (category, weight) VALUES (?, ?)').run(category, newWeight);

    for (const tag of tags) {
      const kwRow = db.prepare('SELECT weight FROM keyword_weights WHERE keyword = ?').get(tag) as any;
      const kwNew = Math.max(0.3, (kwRow ? kwRow.weight : 1.0) - 0.20);
      db.prepare('INSERT OR REPLACE INTO keyword_weights (keyword, weight) VALUES (?, ?)').run(tag, kwNew);
    }
  } else if (action === 'like') {
    const cur = db.prepare('SELECT weight FROM category_weights WHERE category = ?').get(category) as any;
    const newWeight = Math.min(3.5, (cur ? cur.weight : 1.0) + 0.35);
    db.prepare('INSERT OR REPLACE INTO category_weights (category, weight) VALUES (?, ?)').run(category, newWeight);

    for (const tag of tags) {
      const kwRow = db.prepare('SELECT weight FROM keyword_weights WHERE keyword = ?').get(tag) as any;
      const kwNew = Math.min(3.5, (kwRow ? kwRow.weight : 1.0) + 0.25);
      db.prepare('INSERT OR REPLACE INTO keyword_weights (keyword, weight) VALUES (?, ?)').run(tag, kwNew);
    }
  } else if (action === 'read') {
    const cur = db.prepare('SELECT weight FROM category_weights WHERE category = ?').get(category) as any;
    const newWeight = Math.min(3.0, (cur ? cur.weight : 1.0) + 0.15);
    db.prepare('INSERT OR REPLACE INTO category_weights (category, weight) VALUES (?, ?)').run(category, newWeight);
  }

  res.json({ success: true, action, articleId });
});

// POST Ask The Paper: Interactive AI Q&A across today's stories
app.post('/api/ask-paper', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const allArticles = db.prepare('SELECT * FROM articles').all() as any[];

  // Find articles matching query terms
  const scored = allArticles.map(art => {
    let matches = 0;
    const text = `${art.title} ${art.subhead} ${art.lead_paragraph} ${art.full_body_json}`.toLowerCase();
    queryTerms.forEach(term => {
      if (text.includes(term)) matches += 1;
    });
    return { ...art, matches };
  }).filter(a => a.matches > 0).sort((a, b) => b.matches - a.matches);

  if (scored.length === 0) {
    return res.json({
      answer: `While today's dispatches do not directly cover "${query}", our morning edition covers related frontiers in ${allArticles.map(a => a.category).slice(0, 3).join(', ')}. Try asking about autonomous agents, clean energy deflation, deep focus neuroscience, or sovereign silicon supply chains.`,
      sources: []
    });
  }

  const topMatch = scored[0];
  const bodyParagraphs = JSON.parse(topMatch.full_body_json || '[]');
  const relevantParagraph = bodyParagraphs[0] || topMatch.lead_paragraph;

  const synthesizedAnswer = `Regarding "${query}": According to ${topMatch.outlet}'s dispatch ("${topMatch.title}"), ${relevantParagraph} Additionally, the analysis highlights that: "${topMatch.subhead}".`;

  res.json({
    answer: synthesizedAnswer,
    sources: scored.slice(0, 2).map(s => ({
      title: s.title,
      outlet: s.outlet,
      category: s.category
    }))
  });
});

// GET Live Wire Dispatches (Real-time RSS / Hacker News top stories)
app.get('/api/news/live', async (req: Request, res: Response) => {
  try {
    const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!hnRes.ok) throw new Error('Failed to fetch from live wire');
    const ids = (await hnRes.json() as number[]).slice(0, 5);

    const stories = await Promise.all(
      ids.map(async id => {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return itemRes.json();
      })
    );

    const wireDispatches = stories.filter(Boolean).map((s: any) => ({
      id: `live-${s.id}`,
      title: s.title,
      outlet: s.url ? new URL(s.url).hostname.replace('www.', '') : 'Hacker News Wire',
      outletUrl: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
      publishedAt: new Date(s.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: s.score
    }));

    res.json({ success: true, dispatches: wireDispatches });
  } catch (err: any) {
    res.json({
      success: false,
      dispatches: [
        { id: 'wire-1', title: 'Open Source Multi-Agent Swarms Reach Consensus on Complex Proofs', outlet: 'ArXiv & Tech Wire', outletUrl: 'https://news.ycombinator.com', publishedAt: '07:15 AM', score: 342 },
        { id: 'wire-2', title: 'Grid-Scale Sodium-Ion Storage Deployment Surpasses Lithium in Northern Europe', outlet: 'Energy Dispatch', outletUrl: 'https://news.ycombinator.com', publishedAt: '06:40 AM', score: 289 }
      ]
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Personal Morning Paper SQLite Backend] Running on http://localhost:${PORT}`);
});
