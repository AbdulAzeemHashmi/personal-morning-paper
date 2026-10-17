# 🗞️ The Personal Morning Paper

> **A handcrafted personal morning broadsheet tailored to your intellect, time, and curiosity.**  
> *"News is scattered. People jump from site to site, click link after link, and still can't name three things they learned. The Morning Chronicle brings back the ritual, intentionality, and tactile elegance of the morning paper."*

---

## ✨ Features

### 1. 🖨️ Printing Press Onboarding
- **Personalized Masthead**: Readers name their newspaper (e.g., *The Azeem Morning Chronicle*), select their Latin morning motto, and set their city/weather location.
- **Reading Ritual Budget**: 5-minute Espresso, 15-minute Breakfast, or 30-minute Commute editions.
- **Editorial Tone**: Analytical & Objective, Executive & Strategic, Intellectual & Philosophical, or Contrarian & Nuanced.
- **Curated Beats & Micro-Topics**: World Affairs, Tech & AI, Markets & Finance, Science & Cosmos, Climate, Culture & Ideas, Health & Longevity, plus custom keyword tags.

### 2. 📰 The Digital Broadsheet Web Experience
- **Authentic Newspaper Aesthetics**: Classic serif typography (`Cinzel`, `Playfair Display`, `Merriweather`), drop caps, ornate double-rules, pull quotes, bylines, and weather stamps.
- **Front Page Lead Anchor & Side Dispatches**: Prominently highlights the highest-relevance story of the morning.
- **Focus Reader Drawer**: Clean, distraction-free reading with estimated read times and outbound links to original publisher articles.
- **Multi-Theme Support**:
  - 📜 **Paper Broadsheet** (Classic cream newsprint)
  - 🌙 **Midnight Edition** (Sleek dark mode)
  - ☕ **Sepia Archive** (Antique parchment)

### 3. 📄 Publication-Grade Broadsheet PDF Generator
- Generates a downloadable daily newspaper PDF formatted like an authentic broadsheet.
- Features multi-column layout, drop caps, date stamps, and editorial masthead.
- 1-click generation via client-side high-resolution rendering (`jsPDF` + `html2canvas`).

### 4. 🧠 The Editorial Mind: Adaptive Learning Engine
- **Feedback Loops**:
  - ❌ **Skip Story**: Instantly folds the article away and decreases that category/tag weight by $-0.25$.
  - 📖 **Read Story**: Increases affinity by $+0.15$.
  - 👍 **Like / Star**: Strongly reinforces topic with $+0.35$ boost.
  - 🔖 **Bookmark**: Saves story to evening reading archive.
- **Learning Matrix Drawer**: Full transparency into learned category affinity weights, keyword scores, and interaction logs.
- **"Simulate Next Morning"**: Fast-forwards the clock by 1 day to demonstrate how skips and likes directly reorganize tomorrow's front page.

### 5. 🔭 Room to Explore Innovations
- ✍️ **The Chief Editor's Note**: AI-crafted morning address synthesizing today's global themes into a cohesive narrative.
- ⚖️ **The Nuance Lens**: 3-way comparative perspective dial analyzing contentious topics through distinct worldviews.
- ☕ **The Coffee Break**: Daily intellectual riddle (with revealable solution), Word of the Morning, and historical press trivia.
- 🎙️ **Morning Audio Dispatch**: Built-in speech synthesis narrator with playback speed controls (1x, 1.25x, 1.5x).
- 🏛️ **Time Machine Archive**: Browse and re-read historical daily papers.
- 📐 **In-App Architecture Viewer**: Interactive system design diagrams and submission checklist.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Vanilla CSS Design System with CSS variables and responsive broadsheet grid
- **PDF Engine**: `jsPDF` & `html2canvas`
- **Audio Narration**: Web Speech Synthesis API
- **Icons & Micro-Interactions**: `lucide-react` & `canvas-confetti`

---

## 🚀 Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/AbdulAzeemHashmi/personal-morning-paper.git
cd personal-morning-paper

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

---

## 📐 Architecture Specification

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for full architectural blueprints, data flow diagrams, and mathematical formulation of the relevance scoring engine.

---

## 📋 Hackathon Submission Deliverables

- **Repository**: [https://github.com/AbdulAzeemHashmi/personal-morning-paper](https://github.com/AbdulAzeemHashmi/personal-morning-paper)
- **Architecture Diagram**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Submission Form**: [https://forms.gle/4i4Gf8vNv3Vu8ZLJ7](https://forms.gle/4i4Gf8vNv3Vu8ZLJ7)
