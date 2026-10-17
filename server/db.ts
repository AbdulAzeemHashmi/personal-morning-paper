import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path in project root
const dbPath = path.resolve(__dirname, '..', 'morning_paper.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS reader_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      newspaper_name TEXT NOT NULL,
      motto TEXT NOT NULL,
      reading_time TEXT NOT NULL,
      tone TEXT NOT NULL,
      topics_json TEXT NOT NULL,
      keywords_json TEXT NOT NULL,
      theme TEXT NOT NULL,
      onboarding_completed INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subhead TEXT NOT NULL,
      author TEXT NOT NULL,
      outlet TEXT NOT NULL,
      outlet_url TEXT NOT NULL,
      published_at TEXT NOT NULL,
      category TEXT NOT NULL,
      tags_json TEXT NOT NULL,
      reading_minutes INTEGER NOT NULL,
      lead_paragraph TEXT NOT NULL,
      full_body_json TEXT NOT NULL,
      pull_quote TEXT,
      nuance_json TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS editions (
      edition_id TEXT PRIMARY KEY,
      date_str TEXT NOT NULL,
      short_date TEXT NOT NULL,
      volume INTEGER NOT NULL,
      issue INTEGER NOT NULL,
      weather_json TEXT NOT NULL,
      morning_quote_json TEXT NOT NULL,
      chief_editor_note_json TEXT NOT NULL,
      lead_article_id TEXT NOT NULL,
      coffee_break_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS edition_articles (
      edition_id TEXT NOT NULL,
      article_id TEXT NOT NULL,
      section_type TEXT NOT NULL, -- 'lead', 'side', 'section'
      relevance_score REAL NOT NULL,
      is_skipped INTEGER DEFAULT 0,
      is_liked INTEGER DEFAULT 0,
      is_bookmarked INTEGER DEFAULT 0,
      PRIMARY KEY (edition_id, article_id)
    );

    CREATE TABLE IF NOT EXISTS learning_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      action TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS category_weights (
      category TEXT PRIMARY KEY,
      weight REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS keyword_weights (
      keyword TEXT PRIMARY KEY,
      weight REAL NOT NULL
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if profile exists
  const profileCount = db.prepare('SELECT COUNT(*) as count FROM reader_profiles').get() as { count: number };
  if (profileCount.count === 0) {
    const insertProfile = db.prepare(`
      INSERT INTO reader_profiles (
        id, name, location, newspaper_name, motto, reading_time, tone,
        topics_json, keywords_json, theme, onboarding_completed, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProfile.run(
      'default',
      'Abdul Azeem',
      'San Francisco, CA',
      'Jimmy Morning Chronicle',
      'Veritas, Gravitas et Lux: An Intelligent Daily Broadsheet',
      '15min',
      'analytical',
      JSON.stringify(['Technology & AI', 'Markets & Finance', 'Science & Cosmos', 'Culture & Ideas']),
      JSON.stringify(['Agentic AI', 'Semiconductors', 'Macroeconomics']),
      'broadsheet',
      1,
      Date.now()
    );
  }

  // Seed baseline weights
  const weightCount = db.prepare('SELECT COUNT(*) as count FROM category_weights').get() as { count: number };
  if (weightCount.count === 0) {
    const insertCatWeight = db.prepare('INSERT INTO category_weights (category, weight) VALUES (?, ?)');
    const defaultCats: Record<string, number> = {
      'Technology & AI': 1.3,
      'Markets & Finance': 1.1,
      'Science & Cosmos': 1.0,
      'Culture & Ideas': 0.9,
      'World & Geopolitics': 0.8,
      'Climate & Energy': 0.8,
      'Health & Longevity': 0.8
    };
    for (const [cat, w] of Object.entries(defaultCats)) {
      insertCatWeight.run(cat, w);
    }

    const insertKwWeight = db.prepare('INSERT INTO keyword_weights (keyword, weight) VALUES (?, ?)');
    const defaultKws: Record<string, number> = {
      'Agentic AI': 1.5,
      'Semiconductors': 1.3,
      'Macroeconomics': 1.2
    };
    for (const [kw, w] of Object.entries(defaultKws)) {
      insertKwWeight.run(kw, w);
    }
  }
}
