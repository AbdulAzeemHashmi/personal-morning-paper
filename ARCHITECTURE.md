# System Architecture: The Personal Morning Paper

## 1. System Overview

The Personal Morning Paper is a full-stack publication system that transforms scattered, overwhelming web news into a finite, elegant daily broadsheet tailored to each reader's schedule, cognitive style, and passions.

It features an Express REST backend backed by an embedded SQLite database (WAL mode) for persistent relational storage, coupled with a React broadsheet interface, speech synthesis audio narration, and vector-grade PDF generation.

```mermaid
flowchart TD
    subgraph Data_Layer [1. Persistent SQLite Database & Feeds]
        DB[(SQLite DB: morning_paper.db\nProfiles, Editions, Articles, Signals, Weights)]
        HN[Hacker News / Public RSS Wire]
    end

    subgraph Backend_API [2. Express REST Service : Port 3001]
        ProfileAPI[/api/profile]
        SignalsAPI[/api/signals/action]
        AskPaperAPI[/api/ask-paper : Semantic Q&A]
        LiveWireAPI[/api/news/live : Wire Dispatches]
    end

    subgraph Learning_Engine [3. Adaptive Weighting Model]
        Bayesian[Dynamic Weighting Model: Category & Tag Affinity]
        Reranker[Relevance Scoring & Composer Engine]
        EditorSynthesis[AI Chief Editor Synthesis: Morning Address]
    end

    subgraph Frontend_Surfaces [4. Broadsheet Reading Surfaces]
        BroadsheetWeb[Interactive Broadsheet Webpage]
        AskPaperUI[Ask The Paper Interactive Drawer]
        SearchFilterUI[Real-Time Keyword & Beat Search]
        AudioDispatch[Morning Audio Dispatch Narration]
        PrintEngine[Print-Grade Broadsheet PDF Engine]
        ArchiveEngine[Historical Editions Archive]
    end

    Data_Layer <--> Backend_API
    Backend_API <--> Learning_Engine
    Learning_Engine --> Frontend_Surfaces
    Frontend_Surfaces -.->|Skips: -0.25 / Likes: +0.35| Backend_API
```

---

## 2. Relational Database Schema (SQLite)

The SQLite database (`morning_paper.db`) uses Write-Ahead Logging (WAL) mode for fast concurrent operations.

### Tables:
1. **`reader_profiles`**:
   - `id` (TEXT PRIMARY KEY): Reader identifier (`default`).
   - `name`, `location`, `newspaper_name`, `motto`: Custom masthead identity.
   - `reading_time`: `5min`, `15min`, or `30min`.
   - `tone`: `analytical`, `executive`, `curious`, or `provocative`.
   - `topics_json`: JSON array of chosen beats.
   - `keywords_json`: JSON array of custom reader keywords.
   - `theme`: `broadsheet`, `midnight`, or `sepia`.
   - `onboarding_completed`: Boolean flag.
   - `updated_at`: Epoch timestamp.

2. **`articles`**:
   - `id` (TEXT PRIMARY KEY): Unique story identifier.
   - `title`, `subhead`, `author`, `outlet`, `outlet_url`, `published_at`, `category`: Metadata.
   - `tags_json`: Array of topic tags.
   - `reading_minutes`: Estimated reading time.
   - `lead_paragraph`, `full_body_json`, `pull_quote`: Story contents.
   - `nuance_json`: Multi-perspective viewpoints.

3. **`editions`**:
   - `edition_id` (TEXT PRIMARY KEY): `edition-YYYY-MM-DD`.
   - `date_str`, `short_date`, `volume`, `issue`: Publication stamps.
   - `weather_json`, `morning_quote_json`, `chief_editor_note_json`, `coffee_break_json`: Daily fixtures.
   - `lead_article_id`: Foreign key reference to the lead anchor story.

4. **`learning_interactions`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT).
   - `article_id`, `title`, `category`, `action` (`skip`, `read`, `like`, `bookmark`), `timestamp`.

5. **`category_weights` & `keyword_weights`**:
   - `category` / `keyword` (TEXT PRIMARY KEY).
   - `weight` (REAL): Dynamically updated multiplier reflecting reader preference.

---

## 3. REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | SQLite database connectivity check and table metrics |
| `GET` | `/api/profile` | Retrieve reader identity and preference settings |
| `POST` | `/api/profile` | Update reader masthead, reading budget, and beats |
| `GET` | `/api/signals` | Fetch category weights, keyword scores, and interaction logs |
| `POST` | `/api/signals/action` | Submit feedback (skip, like, read, bookmark) to update weights |
| `POST` | `/api/ask-paper` | Semantic natural language Q&A across today's articles |
| `GET` | `/api/news/live` | Retrieve live breaking news wire dispatches |

---

## 4. Relevance Scoring & Adaptive Feedback Formula

Every candidate article $A_i$ receives a dynamic score $S(A_i)$ at press time:

$$S(A_i) = \left( B_{cat} \times W_{cat} \right) + \sum_{k \in Tags} \left( M_k \times W_k \right) - P_{skip} + R_{novelty}$$

Where:
- $B_{cat}$: Base affinity from user's configured beats (1.4 if chosen, 0.6 if unchosen).
- $W_{cat}$: Learned category weight from SQLite (ranges from $0.20$ to $3.50$).
- $M_k$: Keyword match multiplier ($+0.80$ for user-defined tags).
- $W_k$: Learned keyword affinity weight from SQLite.
- $P_{skip}$: Severe skip penalty ($-3.00$ if skipped recently, preventing unwanted repetition).
- $R_{novelty}$: Time-decay factor ensuring fresh morning perspectives.

---

## 5. Distinctive Features

1. **Ask The Paper**: Real-time semantic assistant answering reader inquiries using today's SQLite broadsheet corpus.
2. **Interactive Coffee Break**: Puzzle with real-time answer checking, validation feedback, and word of the day.
3. **Single-Story & Full-Paper Audio**: Speech synthesis narration for the complete dispatch or individual stories.
4. **Font Scaling**: Dynamic typographic zoom (A- / A+) for enhanced reading comfort.
5. **Real-Time Live Wire**: Toggleable ticker fetching breaking global dispatches alongside the curated edition.
