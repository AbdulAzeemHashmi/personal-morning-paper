# System Architecture: Jimmy Morning Chronicle

## 1. System Overview

Jimmy Morning Chronicle is a full-stack digital broadsheet application built on the **Next.js 16 App Router**, powered by an autonomous **Multi-Agent Editorial Room** driven by **Google Gemini AI**, and backed by **Supabase PostgreSQL** for persistent multi-tenant storage.

It bridges the tactile elegance of a traditional 19th-century broadsheet with modern multi-agent reasoning, semantic querying, speech synthesis audio, and vector-grade PDF generation.

```mermaid
flowchart TD
    subgraph Data_Layer [1. Persistence & Knowledge Feeds]
        Supa[(Supabase PostgreSQL 15\nProfiles, Editions, Articles, Signals, Weights)]
        Wire[Real-Time Hacker News / RSS Wire API]
    end

    subgraph Gemini_AI [2. Gemini AI Engine]
        GeminiFlash[gemini-2.5-flash\nChief Editor Address + Ask Paper RAG]
    end

    subgraph Multi_Agent_Room [3. Autonomous Multi-Agent Editorial Room]
        Orchestrator[Newsroom Orchestrator : Central Dispatch]
        Aura[Chief Editor Agent Aura-1 : Synthesis & Macro-Themes]
        Nexus[Curator & Reranker Nexus-4 : Bayesian Reranker]
        Vantage[Nuance & Perspective Vantage-2 : 3-Way Worldview Framing]
        Minerva[Culture & Leisure Minerva-3 : Daily Dilemma & Etymology]
    end

    subgraph NextJS_API [4. Next.js App Router & Server Endpoints]
        EditorialAPI[/api/agents/editorial : Run Agents Pipeline]
        ProfileAPI[/api/profile : Supabase Sync]
        SignalsAPI[/api/signals : Bayesian Weight Updates]
        AskPaperAPI[/api/ask-paper : Semantic Q&A]
        LiveWireAPI[/api/news/live : Wire Dispatches]
        HealthAPI[/api/health : Server Health Check]
    end

    subgraph Reading_Surfaces [5. Broadsheet Reading Surfaces]
        BroadsheetWeb[Next.js Interactive Broadsheet Webpage]
        AgentsUI[Agents Room Live Trajectory Viewer]
        AskPaperUI[Ask The Paper Semantic Assistant]
        PrintEngine[Print-Grade Broadsheet PDF Generator]
        AudioDispatch[Morning Audio Dispatch Narration]
        ArchiveUI[Historical Editions Archive]
    end

    Data_Layer <--> NextJS_API
    Gemini_AI <--> NextJS_API
    NextJS_API <--> Multi_Agent_Room
    Multi_Agent_Room --> Reading_Surfaces
    Reading_Surfaces -.->|Feedback: Skip -0.25 / Like +0.35| NextJS_API
```

---

## 2. Multi-Agent Editorial Room Architecture

Rather than relying on a single monolithic prompt, four specialized autonomous agents collaborate on an editorial blackboard to assemble each morning edition:

### A. Chief Editor Agent (Aura-1)
- **Role**: Editorial Voice & Macro Synthesis.
- **Responsibilities**:
  - Reviews candidate headlines across the globe.
  - Identifies the overarching civilizational or technological narrative of the day.
  - Formulates the **Chief Editor Morning Address**, customized to the reader's name, time budget, and editorial disposition (analytical, executive, curious, contrarian).
  - Powered by `gemini-2.5-flash` via `src/lib/gemini.ts`.

### B. Curator & Reranker Agent (Nexus-4)
- **Role**: Quantitative Relevance & Broadsheet Layout Allocator.
- **Responsibilities**:
  - Evaluates candidate articles against reader baseline beats and learned weights.
  - Computes the dynamic relevance score using Bayesian feedback multipliers:
    `S(Ai) = (B_cat x W_cat) + sum(M_k x W_k) - P_skip + R_novelty`
  - Selects the **Front Page Anchor / Lead Story**, curates secondary side dispatches, and organizes thematic columns.

### C. Perspective & Nuance Agent (Vantage-2)
- **Role**: Investigative Balance & Bias Deconstruction.
- **Responsibilities**:
  - Scrutinizes polarizing or complex stories.
  - Generates a **3-Way Perspective Dial** breaking down the story through distinct lenses (e.g. Technological Capability, Capital & Economic Velocity, and Systemic Vulnerability).

### D. Culture & Leisure Agent (Minerva-3)
- **Role**: Intellectual Wellness & Morning Reflection.
- **Responsibilities**:
  - Generates the daily **Coffee Break Dilemma** and validates interactive guesses.
  - Selects the **Word of the Morning** with phonetic and etymological roots.
  - Curates historical press trivia dating back to Fleet Street in 1702.

---

## 3. Gemini AI Integration

- **Client**: `src/lib/gemini.ts` using `@google/genai` with `gemini-2.5-flash`.
- **Chief Editor Address**: `src/agents/ChiefEditorAgent.ts` constructs a context-rich prompt with global themes, reader profile, and editorial tone. The Gemini response is injected into the broadsheet Morning Address component.
- **Ask Paper RAG**: `src/app/api/ask-paper/route.ts` builds a corpus from today's article summaries and lead paragraphs, then passes the reader's question to Gemini with a citation-grounded system prompt.
- **Environment variable**: `GEMINI_API_KEY` (server-side only, never exposed to client).

---

## 4. Database Architecture: Supabase PostgreSQL

All data structures are defined in PostgreSQL 15+ (`supabase/migrations/20261017_init.sql`):

### Tables:
1. **`reader_profiles`**:
   - `id` (UUID PRIMARY KEY).
   - `user_id` (TEXT UNIQUE): Reader identity.
   - `name`, `location`, `newspaper_name`, `motto`: Masthead styling.
   - `reading_time`: `5min`, `15min`, or `30min`.
   - `tone`: `analytical`, `executive`, `curious`, or `provocative`.
   - `topics` (JSONB): Primary editorial beats.
   - `keywords` (JSONB): Micro-topics and tags.
   - `theme`: `broadsheet`, `midnight`, or `sepia`.
   - `onboarding_completed`: Boolean flag.

2. **`articles`**:
   - `id` (TEXT PRIMARY KEY): Unique story identifier.
   - `title`, `subhead`, `author`, `outlet`, `outlet_url`, `published_at`, `category`: Metadata.
   - `tags` (JSONB), `reading_minutes`, `lead_paragraph`, `full_body` (JSONB), `pull_quote`: Story content.
   - `nuance_perspectives` (JSONB): Multi-viewpoint breakdown.

3. **`editions`**:
   - `edition_id` (TEXT PRIMARY KEY): Date-stamped edition identifier.
   - `volume`, `issue`, `weather` (JSONB), `morning_quote` (JSONB), `chief_editor_note` (JSONB), `coffee_break` (JSONB).

4. **`interaction_signals`**:
   - `id` (BIGSERIAL PRIMARY KEY).
   - `user_id`, `article_id`, `title`, `category`, `action` (`skip`, `read`, `like`, `bookmark`), `created_at`.

5. **`category_weights` & `keyword_weights`**:
   - `user_id`, `category` / `keyword` (PRIMARY KEY).
   - `weight` (NUMERIC): Dynamic affinity multiplier (0.20 to 3.50).

---

## 5. Next.js Server Route Handlers

| Route | Method | Description |
|---|---|---|
| `/api/agents/editorial` | POST | Triggers the Newsroom Orchestrator pipeline, returns assembled broadsheet and live agent logs |
| `/api/profile` | GET / POST | Reads and persists reader configuration to Supabase PostgreSQL |
| `/api/signals` | GET / POST | Retrieves affinity matrix and logs reader interactions |
| `/api/signals/action` | POST | Records individual skip / read / like / bookmark actions |
| `/api/ask-paper` | POST | Semantic Q&A answering inquiries with citations from today's articles via Gemini AI |
| `/api/news/live` | GET | Fetches real-time wire dispatches from Hacker News API |
| `/api/health` | GET | Server and Supabase connectivity health check |

---

## 6. Design System & UI Architecture

### Color Token System (`src/index.css`)
All colors are defined as CSS custom properties on `:root` for each theme:
- **Broadsheet** (default): Warm cream paper tones with ink-dark text.
- **Midnight**: Obsidian background with high-contrast amber accents.
- **Sepia**: Antique parchment with cognac borders.

WCAG AA/AAA compliance is enforced across all three themes on text-muted, text-secondary, and text-primary tokens.

### Grid Layout Principles
- **Front Page**: 2:1 grid (`grid-template-columns: 2fr 1fr`) with the Morning Intelligence Wire card balancing the side column height against the lead story.
- **Single-Child Section Constraint**: `.section-grid-modern:has(> :only-child)` caps isolated section cards at 580px to prevent full-width banner stretching.
- **Responsive Breakpoints**: 1024px collapses the 2:1 grid to single-column; 768px collapses footer and navigation grids.

### Sticky Navigation
- `.modern-top-bar` uses `position: sticky; top: 12px; z-index: 80; backdrop-filter: blur(20px)` for persistent access to PDF export, theme controls, and reader preferences while scrolling.

### Print Media (`@media print`)
- Hides all interactive controls, search bars, and floating chips.
- Formats articles into clean, border-defined newsprint using article card classes with `page-break-inside: avoid`.

---

## 7. Distinctive Features

1. **Multi-Agent Newsroom Inspector**: Live modal displaying agent reasoning and step-by-step assembly logs.
2. **Ask The Paper**: Gemini-powered natural language assistant answering questions using today's broadsheet knowledge base.
3. **Interactive Coffee Break**: Puzzle with real-time answer input, automated grading, celebratory confetti, and solution reveal.
4. **Typographic & Audio Controls**: Font size scaling (A- / A+), full-paper and per-story speech synthesis narration, and quote sharing.
5. **Print-Grade PDF Engine**: 1-click authentic broadsheet PDF export.
6. **Morning Intelligence Wire**: Persistent side column supplement with live market and frontier tech updates.
7. **Broadsheet Editorial Footer**: Multi-column colophon with section navigation, console shortcuts, and back-to-top button.

---

## 8. Deployment

- **Platform**: Vercel (automatic CI/CD from `main` branch).
- **Live URL**: https://personal-morning-paper.vercel.app
- **Required Environment Variables on Vercel**:
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

---

## 9. 4-Stage Pipeline Reference

The application processes each morning edition through four sequential stages:

| Stage | Name | Inputs | Outputs |
|---|---|---|---|
| 1 | Knowledge Feeds | Global Wire & RSS, Multi-beat Outlets, Perspective Metadata | Raw candidate articles |
| 2 | Editorial Engine | Candidate articles + Reader profile + Learned weights | Ranked, curated broadsheet edition |
| 3 | Broadsheet UX | Curated edition data | Interactive webpage, Morning Audio Dispatch, High-Res PDF |
| 4 | Feedback Loop | Reader actions (skip, read, like, bookmark) | Updated Bayesian weight matrix |

> Continuous Reinforcement: Reader signals immediately update the local Bayesian weight matrix, recalibrating the next morning's lead story and column priorities.

---

## 10. Product Walkthrough Guide

Recommended demonstration flow for a 5-minute product walkthrough:

| Timestamp | Topic | What to Cover |
|---|---|---|
| 0:00 - 1:00 | Problem & Onboarding | Explain information scatter problem; walk through the Onboarding printing press setup modal (name, topics, tone, reading time) |
| 1:00 - 2:30 | Digital Broadsheet Experience | Show Masthead, Lead story with byline badges, Morning Audio Dispatch, multi-column section layout, and theme switcher |
| 2:30 - 3:30 | Adaptive Learning Demo | Skip an article (show -0.25 weight penalty), Like a story (+0.35 boost), open the Learning Matrix Drawer to visualize weight shifts, run Simulate Next Morning |
| 3:30 - 4:15 | Room to Explore Features | Chief Editor AI Morning Address, Nuance Lens 3-way dial, Coffee Break dilemma, Historical Editions Archive |
| 4:15 - 5:00 | PDF & Architecture | Trigger 1-click Broadsheet PDF generation; open About modal to show tech stack; point to ARCHITECTURE.md on GitHub |
