# System Architecture: The Personal Morning Paper

## 1. System Overview

The Personal Morning Paper is a full-stack publication system built on the **Next.js App Router**, powered by an autonomous **Multi-Agent Editorial Room** and backed by **Supabase PostgreSQL** for persistent multi-tenant storage.

It bridges the tactile elegance of a traditional 19th-century broadsheet with modern multi-agent reasoning, semantic querying, speech synthesis audio, and vector-grade PDF generation.

```mermaid
flowchart TD
    subgraph Data_Layer [1. Persistence & Knowledge Feeds]
        Supa[(Supabase PostgreSQL 15\nProfiles, Editions, Articles, Signals, Weights)]
        Wire[Real-Time Hacker News / RSS Wire API]
    end

    subgraph Multi_Agent_Room [2. Autonomous Multi-Agent Editorial Room]
        Orchestrator[Newsroom Orchestrator : Central Dispatch]
        Aura[Chief Editor Agent Aura-1 : Synthesis & Macro-Themes]
        Nexus[Curator & Reranker Nexus-4 : Bayesian Reranker]
        Vantage[Nuance & Perspective Vantage-2 : 3-Way Worldview Framing]
        Minerva[Culture & Leisure Minerva-3 : Daily Dilemma & Etymology]
    end

    subgraph NextJS_API [3. Next.js App Router & Server Endpoints]
        EditorialAPI[/api/agents/editorial : Run Agents Pipeline]
        ProfileAPI[/api/profile : Supabase Sync]
        SignalsAPI[/api/signals : Bayesian Weight Updates]
        AskPaperAPI[/api/ask-paper : Semantic Q&A]
        LiveWireAPI[/api/news/live : Wire Dispatches]
    end

    subgraph Reading_Surfaces [4. Broadsheet Reading Surfaces]
        BroadsheetWeb[Next.js Interactive Broadsheet Webpage]
        AgentsUI[Agents Room Live Trajectory Viewer]
        AskPaperUI[Ask The Paper Semantic Assistant]
        PrintEngine[Print-Grade Broadsheet PDF Generator]
        AudioDispatch[Morning Audio Dispatch Narration]
        ArchiveUI[Historical Editions Archive]
    end

    Data_Layer <--> NextJS_API
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

### B. Curator & Reranker Agent (Nexus-4)
- **Role**: Quantitative Relevance & Broadsheet Layout Allocator.
- **Responsibilities**:
  - Evaluates candidate articles against reader baseline beats and learned weights.
  - Computes the dynamic relevance score $S(A_i)$ using Bayesian feedback multipliers:
    $$S(A_i) = \left( B_{cat} \times W_{cat} \right) + \sum_{k \in Tags} \left( M_k \times W_k \right) - P_{skip} + R_{novelty}$$
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

## 3. Database Architecture: Supabase PostgreSQL

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
   - `weight` (NUMERIC): Dynamic affinity multiplier ($0.20$ to $3.50$).

---

## 4. Next.js Server Route Handlers

- `POST /api/agents/editorial`: Triggers the Newsroom Orchestrator pipeline, returns assembled broadsheet and live agent logs.
- `GET / POST /api/profile`: Reads and persists reader configuration to Supabase PostgreSQL.
- `GET / POST /api/signals`: Retrieves affinity matrix and logs reader interactions.
- `POST /api/ask-paper`: Semantic Q&A answering inquiries with citations from today's articles.
- `GET /api/news/live`: Fetches real-time wire dispatches from Hacker News API.

---

## 5. Distinctive Features

1. **Multi-Agent Newsroom Inspector**: Live modal displaying agent reasoning and step-by-step assembly logs.
2. **Ask The Paper**: Natural language assistant answering questions using today's broadsheet knowledge base.
3. **Interactive Coffee Break**: Puzzle with real-time answer input, automated grading, celebratory confetti, and solution reveal.
4. **Typographic & Audio Controls**: Font size scaling (A- / A+), full-paper and per-story speech synthesis narration, and quote sharing.
5. **Print-Grade PDF Engine**: 1-click authentic broadsheet PDF export.
