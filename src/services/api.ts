import { ReaderProfile, LearningSignals, Article } from '../types';

const API_BASE = 'http://localhost:3001/api';

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiFetchProfile(): Promise<ReaderProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/profile`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.debug('SQLite server not reachable, using local fallback');
  }
  return null;
}

export async function apiSaveProfile(profile: ReaderProfile): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiFetchSignals(): Promise<LearningSignals | null> {
  try {
    const res = await fetch(`${API_BASE}/signals`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    console.debug('SQLite server not reachable, using local fallback');
  }
  return null;
}

export async function apiSendSignalAction(
  articleId: string,
  title: string,
  category: string,
  action: 'skip' | 'read' | 'like' | 'bookmark',
  tags: string[] = []
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/signals/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, title, category, action, tags }),
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface AskPaperResponse {
  answer: string;
  sources: { title: string; outlet: string; category: string }[];
}

export async function apiAskThePaper(query: string): Promise<AskPaperResponse> {
  try {
    const res = await fetch(`${API_BASE}/ask-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.debug('Ask paper fallback');
  }

  // Graceful client fallback synthesis
  return {
    answer: `From today's broadsheet: In response to "${query}", our leading tech dispatch explores autonomous agents rewriting cognitive work, while our market dispatches analyze clean energy deflation impacting global interest rates.`,
    sources: [
      { title: 'The Great Convergence: Autonomous Agents Rewrite Knowledge Work', outlet: 'MIT Tech Review', category: 'Technology & AI' }
    ]
  };
}

export interface LiveWireDispatch {
  id: string;
  title: string;
  outlet: string;
  outletUrl: string;
  publishedAt: string;
  score?: number;
}

export async function apiFetchLiveWire(): Promise<LiveWireDispatch[]> {
  try {
    const res = await fetch(`${API_BASE}/news/live`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return data.dispatches || [];
    }
  } catch (e) {
    console.debug('Live wire fallback');
  }

  return [
    { id: 'wire-1', title: 'Open Source Multi-Agent Swarms Reach Consensus on Complex Proofs', outlet: 'ArXiv & Tech Wire', outletUrl: 'https://news.ycombinator.com', publishedAt: '07:15 AM', score: 342 },
    { id: 'wire-2', title: 'Grid-Scale Sodium-Ion Storage Deployment Surpasses Lithium in Northern Europe', outlet: 'Energy Dispatch', outletUrl: 'https://news.ycombinator.com', publishedAt: '06:40 AM', score: 289 }
  ];
}
