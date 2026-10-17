# The Personal Morning Paper

A handcrafted personal morning broadsheet tailored to your intellect, time, and curiosity. Built on the Next.js App Router, backed by Supabase PostgreSQL, and assembled daily by an autonomous Multi-Agent Editorial Room.

News is scattered across dozens of websites, apps, and newsletters with no single intentional place to read them. The Morning Chronicle brings back the ritual, focus, and tactile elegance of the morning newspaper: powered by multi-agent reasoning, database persistence, and vector-grade PDF generation.

---

## Key Features

### 1. Multi-Agent Editorial Room
- **Chief Editor Agent (Aura-1)**: Synthesizes global meta-themes and authors the tailored Morning Address.
- **Curator & Reranker Agent (Nexus-4)**: Evaluates Bayesian reader feedback weights and allocates broadsheet layout.
- **Perspective & Nuance Agent (Vantage-2)**: Deconstructs polarizing debates into a 3-way worldview dial.
- **Culture & Leisure Agent (Minerva-3)**: Generates the daily Coffee Break dilemma, validates user answers, and curates Word of the Morning etymologies.
- **Agents Room Inspector**: A live modal allowing readers to watch agent collaboration and inspect execution logs.

### 2. Next.js App Router & Server Architecture
- Full migration to modern Next.js App Router (`src/app/layout.tsx`, `src/app/page.tsx`).
- Server-side rendered broadsheet foundations with interactive client components.
- Next.js Server Route Handlers (`/api/agents/editorial`, `/api/profile`, `/api/signals`, `/api/ask-paper`, `/api/news/live`).

### 3. Supabase PostgreSQL Persistence
- Relational PostgreSQL 15 schema defined in `supabase/migrations/20261017_init.sql`.
- Multi-tenant tables for reader profiles, daily editions, articles, interaction signals, and dynamic category/keyword weights.
- Resilient client (`src/lib/supabase.ts`): syncs with Supabase cloud when credentials exist, with graceful zero-crash offline fallback.

### 4. The Digital Broadsheet Web Experience
- **Authentic Newspaper Aesthetics**: Classic serif typography (`Cinzel`, `Playfair Display`, `Merriweather`), drop caps, ornate double-rules, pull quotes, bylines, and weather stamps.
- **Front Page Anchor & Side Dispatches**: Prominently highlights the highest-relevance story of the morning.
- **Focus Reader Drawer**: Clean, distraction-free reading with font size scaling (A- / A+), single-story audio narration, and quote sharing.
- **Multi-Theme Support**:
  - Paper Broadsheet (Classic cream newsprint)
  - Midnight Edition (Sleek dark mode)
  - Sepia Archive (Antique parchment)

### 5. Interactive "Ask The Paper" Assistant
- An interactive semantic query drawer allowing readers to ask natural-language questions about today's articles.
- Answers are synthesized directly from today's broadsheet corpus with publisher citations.

### 6. Publication-Grade Broadsheet PDF Generator
- Generates a downloadable daily newspaper PDF formatted like an authentic broadsheet.
- Features multi-column layout, drop caps, date stamps, and editorial masthead.
- 1-click generation via client-side high-resolution rendering (`jsPDF` + `html2canvas`).

### 7. The Editorial Mind: Adaptive Learning Engine
- **Feedback Loops**:
  - Skip Story: Instantly folds the article away and decreases that category/tag weight by -0.25.
  - Read Story: Increases affinity by +0.15.
  - Like / Star: Strongly reinforces topic with +0.35 boost.
  - Bookmark: Saves story to evening reading archive.
- **Learning Matrix Drawer**: Full transparency into learned category affinity weights, keyword scores, and interaction logs.
- **Simulate Next Morning**: Fast-forwards the clock by 1 day to demonstrate how skips and likes directly reorganize tomorrow's front page.

### 8. Room to Explore Innovations
- The Chief Editor Note: AI-crafted morning address synthesizing today's global themes into a cohesive narrative.
- The Nuance Lens: 3-way comparative perspective dial analyzing contentious topics through distinct worldviews.
- The Coffee Break: Daily intellectual riddle with an interactive answer checker and celebratory validation, Word of the Morning, and historical press trivia.
- Morning Audio Dispatch: Built-in speech synthesis narrator with playback speed controls (1x, 1.25x, 1.5x).
- Time Machine Archive: Browse and re-read historical daily papers.
- Real-Time Live Wire: Toggleable live ticker fetching breaking updates from Hacker News / public wire.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Server Components & Route Handlers)
- **Database**: Supabase PostgreSQL 15 (`@supabase/supabase-js`)
- **Multi-Agent System**: Autonomous Editorial Ensemble (Chief Editor, Curator, Nuance Analyst, Puzzle Master)
- **Styling**: Vanilla CSS Design System with CSS variables and responsive broadsheet grid
- **PDF Engine**: `jsPDF` & `html2canvas`
- **Audio Narration**: Web Speech Synthesis API
- **Icons & Micro-Interactions**: `lucide-react` & `canvas-confetti`

---

## Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/AbdulAzeemHashmi/personal-morning-paper.git
cd personal-morning-paper

# 2. Install dependencies
npm install

# 3. Start Next.js development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Supabase Configuration (Optional)
To connect your own Supabase project, create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
And apply the database migration located at `supabase/migrations/20261017_init.sql`.

---

## Architecture Specification

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for full architectural blueprints, multi-agent workflows, Supabase PostgreSQL schema DDL, and REST API route specifications.

---

## Hackathon Submission Deliverables

- **Repository**: [https://github.com/AbdulAzeemHashmi/personal-morning-paper](https://github.com/AbdulAzeemHashmi/personal-morning-paper)
- **Architecture Diagram**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Submission Form**: [https://forms.gle/4i4Gf8vNv3Vu8ZLJ7](https://forms.gle/4i4Gf8vNv3Vu8ZLJ7)
