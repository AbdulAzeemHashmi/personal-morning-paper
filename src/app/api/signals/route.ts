import { NextResponse } from 'next/server';
import { recordRemoteSignal, fetchRemoteWeights } from '@/lib/supabase';
import { DEFAULT_SIGNALS } from '@/utils/learningEngine';

export async function GET() {
  const remoteWeights = await fetchRemoteWeights();
  return NextResponse.json({
    signals: remoteWeights
      ? { ...DEFAULT_SIGNALS, ...remoteWeights }
      : DEFAULT_SIGNALS
  });
}

export async function POST(req: Request) {
  try {
    const { articleId, title, category, action } = await req.json();
    const recorded = await recordRemoteSignal(articleId, title, category, action);
    return NextResponse.json({ success: true, recordedInSupabase: recorded });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
