# Jimmy Morning Chronicle

A personal digital broadsheet that turns curated morning intelligence into a focused daily reading experience. It is built with Next.js, a four-agent editorial workflow, Supabase persistence, and Google Gemini for text synthesis and question answering.

## Features

- Personalized daily editions with adaptive learning from reads, skips, likes, and bookmarks.
- A four-agent editorial room: Chief Editor, Curator, Nuance Analyst, and Puzzle Master.
- Gemini-powered Morning Address and grounded "Ask The Paper" answers.
- Audio narration, PDF export, archive, live news wire, and responsive broadsheet themes.

## Image generation removed

The application does not generate, regenerate, or display AI-generated editorial artwork. In particular, it does not call the Gemini API, Imagen, or any other model for image generation. Gemini is used only for text features.

## Quickstart

```bash
git clone https://github.com/AbdulAzeemHashmi/personal-morning-paper.git
cd personal-morning-paper
npm install
npm run dev
```

Create `.env.local` when using the optional server-backed text features:

```env
# Gemini text synthesis and Ask The Paper only
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Apply `supabase/migrations/20261017_init.sql` in your Supabase SQL editor.

## Deployment

- Live app: https://personal-morning-paper.vercel.app
- Repository: https://github.com/AbdulAzeemHashmi/personal-morning-paper

Vercel deploys changes pushed to `main`.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the system design.
