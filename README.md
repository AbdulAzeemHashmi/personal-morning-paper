<div align="center">

<!-- Animated header banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1f2937,100:9ca3af&height=200&section=header&text=Jimmy%20Morning%20Chronicle&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=A%20Personal%20Digital%20Broadsheet&descAlignY=58&descSize=18" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=6B7280&center=true&vCenter=true&width=720&lines=Your+Morning+News%2C+Made+for+You;Four+Agents+Run+the+Editorial+Room;Ask+The+Paper+Anything;Read%2C+Listen%2C+or+Export+to+PDF" alt="Typing SVG" />

<br/>

![Live Demo](https://img.shields.io/badge/Live_Demo-Open_App-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

<img src="https://skillicons.dev/icons?i=nextjs,supabase,vercel,nodejs,github" alt="Tools used"/>

<br/>

[Live App](https://personal-morning-paper.vercel.app) &nbsp;|&nbsp; [Repository](https://github.com/AbdulAzeemHashmi/personal-morning-paper) &nbsp;|&nbsp; [Architecture](./ARCHITECTURE.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [The Editorial Room](#the-editorial-room)
- [Tech Stack](#tech-stack)
- [Image Generation Removed](#image-generation-removed)
- [Quickstart](#quickstart)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment](#deployment)

---

## Overview

**Jimmy Morning Chronicle** is a personal digital newspaper. It takes curated morning news and turns it into a calm, focused daily reading experience, laid out like a classic broadsheet.

The app is built with Next.js and uses a four agent editorial workflow to put each edition together. Supabase stores your data, and Google Gemini writes text summaries and answers your questions about the news.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="420">
</div>

---

## Features

| Feature | What it does |
|---|---|
| **Personalized daily editions** | Each edition adapts to you by learning from what you read, skip, like, and bookmark |
| **Four agent editorial room** | A Chief Editor, a Curator, a Nuance Analyst, and a Puzzle Master build the paper |
| **Morning Address** | A short opening message written by Gemini |
| **Ask The Paper** | Ask a question and get an answer based on the paper's own content |
| **Audio narration** | Listen to the paper instead of reading it |
| **PDF export** | Save an edition as a PDF file |
| **Archive** | Go back and read past editions |
| **Live news wire** | See the latest headlines as they come in |
| **Responsive broadsheet themes** | The layout works on phones, tablets, and desktops |

---

## How It Works

<div align="center">

```mermaid
flowchart LR
    A[Curated Morning News] --> ED
    subgraph ED[Four Agent Editorial Room]
        direction TB
        B1[Chief Editor]
        B2[Curator]
        B3[Nuance Analyst]
        B4[Puzzle Master]
    end
    ED --> C[Daily Edition]
    C --> D[Reader Actions]
    D -->|Reads, skips, likes, bookmarks| E[Adaptive Learning]
    E --> ED
    C --> F[Gemini Text Features]
    F --> G[Morning Address and Ask The Paper]
```

</div>

Your reading habits feed back into the next edition, so the paper gets more useful the more you use it.

---

## The Editorial Room

Four agents work together like a real newsroom to build each edition.

- **Chief Editor**
- **Curator**
- **Nuance Analyst**
- **Puzzle Master**

For the full design of the workflow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Tech Stack

| Technology | Used For |
|---|---|
| **Next.js** | The web app and its pages |
| **Supabase** | Saving data and learning from reader actions |
| **Google Gemini** | Morning Address and Ask The Paper, text only |
| **Vercel** | Hosting and automatic deployment |

---

## Image Generation Removed

This app does not create, redraw, or show any AI generated artwork.

- It does not call the Gemini API, Imagen, or any other model to make images.
- Gemini is used only for text features.

---

## Quickstart

```bash
git clone https://github.com/AbdulAzeemHashmi/personal-morning-paper.git
cd personal-morning-paper
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file if you want to use the optional text features that need a server.

```env
# Gemini text features and Ask The Paper only
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Powers the Morning Address and Ask The Paper. Used for text only |
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The public key for your Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | The private server key for your Supabase project. Never share it |

---

## Database Setup

Open the SQL editor in your Supabase project and run the file below.

```
supabase/migrations/20261017_init.sql
```

---

## Deployment

- **Live app:** [personal-morning-paper.vercel.app](https://personal-morning-paper.vercel.app)
- **Repository:** [github.com/AbdulAzeemHashmi/personal-morning-paper](https://github.com/AbdulAzeemHashmi/personal-morning-paper)

Vercel deploys every change that is pushed to the `main` branch.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:9ca3af,100:1f2937&height=100&section=footer" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=14&pause=1500&color=6B7280&center=true&vCenter=true&width=520&lines=Jimmy+Morning+Chronicle;Read+the+news+your+way" alt="Footer typing text"/>

</div>