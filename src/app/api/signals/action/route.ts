import { NextResponse } from 'next/server';
import { recordRemoteSignal } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { articleId, title, category, action } = await req.json();
    const recorded = await recordRemoteSignal(articleId, title, category, action);
    return NextResponse.json({ success: true, recordedInSupabase: recorded });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
