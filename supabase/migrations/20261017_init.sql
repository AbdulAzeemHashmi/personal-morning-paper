-- Supabase PostgreSQL Schema Migration for The Personal Morning Paper
-- Database: PostgreSQL 15+

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Reader Profiles Table
CREATE TABLE IF NOT EXISTS public.reader_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL DEFAULT 'default_reader',
    name TEXT NOT NULL DEFAULT 'Abdul Azeem',
    location TEXT NOT NULL DEFAULT 'San Francisco, CA',
    newspaper_name TEXT NOT NULL DEFAULT 'The Azeem Morning Chronicle',
    motto TEXT NOT NULL DEFAULT 'Veritas, Gravitas et Lux: An Intelligent Daily Broadsheet',
    reading_time TEXT NOT NULL DEFAULT '15min' CHECK (reading_time IN ('5min', '15min', '30min')),
    tone TEXT NOT NULL DEFAULT 'analytical' CHECK (tone IN ('analytical', 'executive', 'curious', 'provocative')),
    topics JSONB NOT NULL DEFAULT '["Technology & AI", "Markets & Finance", "Science & Cosmos", "Culture & Ideas"]'::jsonb,
    keywords JSONB NOT NULL DEFAULT '["Agentic AI", "Semiconductors", "Macroeconomics"]'::jsonb,
    theme TEXT NOT NULL DEFAULT 'broadsheet' CHECK (theme IN ('broadsheet', 'midnight', 'sepia')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Articles Corpus Table
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subhead TEXT NOT NULL,
    author TEXT NOT NULL,
    outlet TEXT NOT NULL,
    outlet_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    category TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    reading_minutes INT NOT NULL DEFAULT 3,
    lead_paragraph TEXT NOT NULL,
    full_body JSONB NOT NULL DEFAULT '[]'::jsonb,
    pull_quote TEXT,
    nuance_perspectives JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Daily Editions Table
CREATE TABLE IF NOT EXISTS public.editions (
    edition_id TEXT PRIMARY KEY, -- e.g. edition-2026-10-17
    date_str TEXT NOT NULL,
    short_date DATE NOT NULL DEFAULT CURRENT_DATE,
    volume INT NOT NULL DEFAULT 1,
    issue INT NOT NULL DEFAULT 42,
    weather JSONB NOT NULL DEFAULT '{"temp": "64°F", "condition": "Crisp Morning Fog", "city": "San Francisco"}'::jsonb,
    morning_quote JSONB NOT NULL DEFAULT '{"quote": "Knowledge is of two kinds: we know a subject ourselves, or we know where we can find information upon it.", "author": "Samuel Johnson"}'::jsonb,
    chief_editor_note JSONB NOT NULL,
    lead_article_id TEXT REFERENCES public.articles(id),
    coffee_break JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Reader Interaction Feedback Signals Table
CREATE TABLE IF NOT EXISTS public.interaction_signals (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default_reader',
    article_id TEXT REFERENCES public.articles(id),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('skip', 'read', 'like', 'bookmark')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Dynamic Category & Keyword Affinity Weights Table
CREATE TABLE IF NOT EXISTS public.category_weights (
    user_id TEXT NOT NULL DEFAULT 'default_reader',
    category TEXT NOT NULL,
    weight NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, category)
);

CREATE TABLE IF NOT EXISTS public.keyword_weights (
    user_id TEXT NOT NULL DEFAULT 'default_reader',
    keyword TEXT NOT NULL,
    weight NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, keyword)
);

-- 7. Indexes for High-Velocity Queries
CREATE INDEX IF NOT EXISTS idx_signals_user_action ON public.interaction_signals(user_id, action);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_editions_date ON public.editions(short_date DESC);

-- 8. Row Level Security (RLS) Enablement
ALTER TABLE public.reader_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_weights ENABLE ROW LEVEL SECURITY;

-- 9. Permissive Public Policies for Morning Paper Reader
CREATE POLICY "Public profiles are readable by anon" ON public.reader_profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles are updatable by anon" ON public.reader_profiles FOR ALL USING (true);
CREATE POLICY "Articles are readable by anon" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Editions are readable by anon" ON public.editions FOR SELECT USING (true);
CREATE POLICY "Interaction signals are insertable by anon" ON public.interaction_signals FOR ALL USING (true);
CREATE POLICY "Weights are readable and updatable by anon" ON public.category_weights FOR ALL USING (true);
CREATE POLICY "Keyword weights are readable and updatable by anon" ON public.keyword_weights FOR ALL USING (true);
