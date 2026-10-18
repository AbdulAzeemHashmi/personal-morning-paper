# Jimmy Morning Chronicle

A high-performance personal broadsheet application that synthesizes curated morning intelligence into an authentic daily newspaper experience. Built on the Next.js 16 App Router with an autonomous Multi-Agent Editorial Room, Supabase PostgreSQL persistence, and Google Gemini AI integration (text synthesis & Gemini API image generation).

News is scattered across dozens of websites, apps, and newsletters with no single intentional place to read it. Jimmy Morning Chronicle restores the ritual, focus, and tactile elegance of the morning newspaper: powered by multi-agent reasoning, Gemini AI image generation, Bayesian adaptive learning, and broadsheet-grade PDF generation.

---

## Key Features

### 1. Multi-Agent Editorial Room (5 Autonomous Agents)
- **Chief Editor Agent (Aura-1)**: Synthesizes global meta-themes and authors the tailored Morning Address using Gemini AI.
- **Curator & Reranker Agent (Nexus-4)**: Evaluates Bayesian reader feedback weights and allocates broadsheet layout.
- **Visual Art Director & Engraver Agent (DaVinci-5)**: Devises allegorical visual themes and generates authentic 19th-century newspaper editorial woodcuts via the Gemini API (Imagen 3 and Gemini Flash vector synthesis).
- **Perspective & Nuance Agent (Vantage-2)**: Deconstructs polarizing debates into a 3-way worldview dial.
- **Culture & Leisure Agent (Minerva-3)**: Generates the daily Coffee Break dilemma, validates user answers, and curates Word of the Morning etymologies.
- **Agents Room Inspector**: A live modal allowing readers to watch 5-agent collaborative assembly and inspect real-time execution logs.

### 2. Next.js App Router Architecture
- Full Next.js 16 App Router with Turbopack (`src/app/layout.tsx`, `src/app/page.tsx`).
- Server-side rendered broadsheet foundations with interactive client components.
- Server Route Handlers: `/api/agents/editorial`, `/api/generate-image`, `/api/profile`, `/api/signals`, `/api/signals/action`, `/api/ask-paper`, `/api/news/live`, `/api/health`.

### 3. Gemini AI Integration (Text & Image Generation)
- **Gemini Flash Text Synthesis**: Powered by `gemini-2.5-flash` / `gemini-3.8-flash` via `src/lib/gemini.ts` with multi-model cascading for zero-quota degradation.
- **Gemini API Image Generation**:
  - Synthesizes bespoke 19th-century broadsheet woodcut illustrations and engravings via Google Gemini API (`imagen-3.0-generate-002:predict` and `gemini-flash-image`).
  - Automatic fallback to Gemini vector SVG woodcut generation (`gemini-flash-vector-woodcut`) ensuring high-fidelity monochrome illustrations even on free-tier quotas.
  - Interactive on-demand re-engraving: readers can click **"Regenerate Art (Gemini)"** on the cover story to generate new visual metaphors in real time.
  - Dedicated REST endpoint `POST /api/generate-image` for server and client generation.
- **Chief Editor Morning Address**: AI-synthesized morning greeting calibrated to the reader's tone and morning window.
- **Semantic RAG Q&A via `/api/ask-paper`**: Natural language inquiries answered with citations from today's broadsheet corpus.

### 4. Supabase PostgreSQL Persistence
- Relational PostgreSQL 15 schema defined in `supabase/migrations/20261017_init.sql`.
- Multi-tenant tables for reader profiles, daily editions, articles, interaction signals, and dynamic category/keyword weights.
- Resilient client (`src/lib/supabase.ts`): syncs with Supabase cloud when credentials exist, with graceful zero-crash offline fallback.

### 5. The Digital Broadsheet Web Experience
- **Authentic Newspaper Aesthetics**: Classic serif typography (Cinzel, Playfair Display, Merriweather), drop caps, ornate double-rules, pull quotes, bylines, and WCAG AA/AAA compliant color tokens.
- **Front Page Anchor & Side Dispatches**: Prominently highlights the highest-relevance story of the morning alongside the Morning Intelligence Wire.
- **Editorial Woodcut Engravings**: Authentic Victorian illustration plates with Fig. 1 annotations and Gemini AI art direction.
- **Focus Reader Drawer**: Clean, distraction-free reading with font size scaling (A- / A+), single-story audio narration, and quote sharing.
- **Multi-Theme Support**:
  - Paper Broadsheet (classic cream newsprint)
  - Midnight Edition (sleek dark mode)
  - Sepia Archive (antique parchment)
- **Print-Grade CSS**: Optimized `@media print` rules for physical broadsheet printing (Ctrl+P).
- **Broadsheet Editorial Footer**: Multi-column colophon with section quick-jumps, Intelligence Console shortcuts, and smooth back-to-top navigation.

### 6. Interactive "Ask The Paper" Assistant
- An interactive semantic query drawer allowing readers to ask natural-language questions about today's articles.
- Answers are synthesized directly from today's broadsheet corpus with publisher citations powered by Gemini AI.

### 7. Publication-Grade Broadsheet PDF Generator
- Generates a downloadable daily newspaper PDF formatted like an authentic broadsheet.
- Features multi-column layout, editorial woodcuts, drop caps, date stamps, and editorial masthead.
- 1-click generation via client-side high-resolution rendering (jsPDF + html2canvas).

### 8. Adaptive Learning Engine
- **Feedback Loops**:
  - Skip Story: Instantly folds the article away and decreases that category/tag weight by -0.25.
  - Read Story: Increases affinity by +0.15.
  - Like / Star: Strongly reinforces topic with +0.35 boost.
  - Bookmark: Saves story to evening reading archive.
- **Learning Matrix Drawer**: Full transparency into learned category affinity weights, keyword scores, and interaction logs.
- **Simulate Next Morning**: Fast-forwards the clock by 1 day to demonstrate how skips and likes directly reorganize tomorrow's front page.

### 9. Room to Explore Innovations
- The Chief Editor Note: AI-crafted morning address synthesizing today's global themes into a cohesive narrative.
- Visual Art Director: Bespoke broadsheet woodcut engraving generation via Gemini API.
- The Nuance Lens: 3-way comparative perspective dial analyzing contentious topics through distinct worldviews.
- The Coffee Break: Daily intellectual riddle with an interactive answer checker and celebratory validation, Word of the Morning, and historical press trivia.
- Morning Audio Dispatch: Built-in speech synthesis narrator with playback speed controls (1x, 1.25x, 1.5x).
- Time Machine Archive: Browse and re-read historical daily papers.
- Real-Time Live Wire: Toggleable live ticker fetching breaking updates from Hacker News / public wire.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Components) |
| AI Engine | Google Gemini 2.5/3.8 Flash (`@google/genai`, Generative Language API) |
| Image Generation | Gemini API (Imagen 3 `imagen-3.0-generate-002` & Gemini Vector Engraver) |
| Database | Supabase PostgreSQL 15 (`@supabase/supabase-js`) |
| Styling | Vanilla CSS Design System with CSS variables and responsive broadsheet grid |
| Multi-Agent System | 5-Agent Autonomous Ensemble (Chief Editor, Curator, Art Director, Nuance Analyst, Puzzle Master) |
| PDF Engine | jsPDF & html2canvas |
| Audio Narration | Web Speech Synthesis API |
| Icons | lucide-react & canvas-confetti |
| Deployment | Vercel |

---

## Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/AbdulAzeemHashmi/personal-morning-paper.git
cd personal-morning-paper

# 2. Install dependencies
npm install

# 3. Configure environment variables (see section below)
# 4. Start Next.js development server
npm run dev

# 5. Open browser at http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini AI (Powers Text Synthesis, Q&A RAG, and Image Generation)
GEMINI_API_KEY=your_gemini_api_key

# Supabase PostgreSQL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Apply the database migration in your Supabase SQL editor from:
`supabase/migrations/20261017_init.sql`

---

## Live Deployment

- **Live App**: https://personal-morning-paper.vercel.app
- **Repository**: https://github.com/AbdulAzeemHashmi/personal-morning-paper

---

## Architecture Specification

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full architectural blueprints, multi-agent workflows, Gemini API image generation pipelines, Supabase PostgreSQL schema DDL, REST API route specifications, and design system documentation.
