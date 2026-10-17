# The Personal Morning Paper

A handcrafted personal morning broadsheet tailored to your intellect, time, and curiosity.

News is scattered across dozens of websites, apps, and newsletters with no single intentional place to read them. The Morning Chronicle brings back the ritual, focus, and tactile elegance of the morning newspaper: powered by adaptive intelligence, SQLite database persistence, and vector-grade PDF generation.

---

## Key Features

### 1. Printing Press Setup
- **Personalized Masthead**: Readers name their newspaper (e.g. *The Azeem Morning Chronicle*), select their Latin morning motto, and set their location.
- **Reading Ritual Budget**: 5-minute Espresso, 15-minute Breakfast, or 30-minute Commute editions.
- **Editorial Tone**: Analytical & Objective, Executive & Strategic, Intellectual & Philosophical, or Contrarian & Nuanced.
- **Curated Beats & Micro-Topics**: World Affairs, Tech & AI, Markets & Finance, Science & Cosmos, Climate, Culture & Ideas, Health & Longevity, plus custom keyword tags.

### 2. The Digital Broadsheet Web Experience
- **Authentic Newspaper Aesthetics**: Classic serif typography (`Cinzel`, `Playfair Display`, `Merriweather`), drop caps, ornate double-rules, pull quotes, bylines, and weather stamps.
- **Front Page Lead Anchor & Side Dispatches**: Prominently highlights the highest-relevance story of the morning.
- **Focus Reader Drawer**: Clean, distraction-free reading with font size scaling (A- / A+), single-story audio narration, and copy quote sharing.
- **Multi-Theme Support**:
  - Paper Broadsheet (Classic cream newsprint)
  - Midnight Edition (Sleek dark mode)
  - Sepia Archive (Antique parchment)

### 3. Persistent SQLite Database & Express REST API
- Powered by an embedded SQLite database (`morning_paper.db`) using WAL mode for high performance.
- Relational tables for reader profiles, daily editions, articles, interaction logs, and dynamic category/keyword weights.
- Express REST API endpoints for profile sync, feedback recording, and live RSS wire aggregation.

### 4. Interactive "Ask The Paper" Assistant
- An interactive semantic query drawer allowing readers to ask natural-language questions about today's articles.
- Answers are synthesized directly from today's SQLite broadsheet corpus with publisher citations.

### 5. Publication-Grade Broadsheet PDF Generator
- Generates a downloadable daily newspaper PDF formatted like an authentic broadsheet.
- Features multi-column layout, drop caps, date stamps, and editorial masthead.
- 1-click generation via client-side high-resolution rendering (`jsPDF` + `html2canvas`).

### 6. The Editorial Mind: Adaptive Learning Engine
- **Feedback Loops**:
  - Skip Story: Instantly folds the article away and decreases that category/tag weight by -0.25.
  - Read Story: Increases affinity by +0.15.
  - Like / Star: Strongly reinforces topic with +0.35 boost.
  - Bookmark: Saves story to evening reading archive.
- **Learning Matrix Drawer**: Full transparency into learned category affinity weights, keyword scores, and interaction logs.
- **Simulate Next Morning**: Fast-forwards the clock by 1 day to demonstrate how skips and likes directly reorganize tomorrow's front page.

### 7. Room to Explore Innovations
- The Chief Editor's Note: AI-crafted morning address synthesizing today's global themes into a cohesive narrative.
- The Nuance Lens: 3-way comparative perspective dial analyzing contentious topics through distinct worldviews.
- The Coffee Break: Daily intellectual riddle with an interactive answer checker and celebratory validation, Word of the Morning, and historical press trivia.
- Morning Audio Dispatch: Built-in speech synthesis narrator with playback speed controls (1x, 1.25x, 1.5x).
- Time Machine Archive: Browse and re-read historical daily papers.
- Real-Time Live Wire: Toggleable live ticker fetching breaking updates from Hacker News / public wire.

---

## Technology Stack

- **Frontend**: React 18 with TypeScript & Vite
- **Backend**: Node.js & Express.js
- **Database**: SQLite with `better-sqlite3` (WAL mode enabled)
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

# 3. Start full-stack application (SQLite Backend + Vite Client)
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

---

## Architecture Specification

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for full architectural blueprints, relational SQLite schemas, REST API documentation, and relevance scoring formulations.

---

## Hackathon Submission Deliverables

- **Repository**: [https://github.com/AbdulAzeemHashmi/personal-morning-paper](https://github.com/AbdulAzeemHashmi/personal-morning-paper)
- **Architecture Diagram**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Submission Form**: [https://forms.gle/4i4Gf8vNv3Vu8ZLJ7](https://forms.gle/4i4Gf8vNv3Vu8ZLJ7)
