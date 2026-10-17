import { NextResponse } from 'next/server';
import { fetchRemoteProfile, saveRemoteProfile, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_PROFILE } from '@/utils/learningEngine';

export async function GET() {
  const remote = await fetchRemoteProfile();
  return NextResponse.json({
    profile: remote || DEFAULT_PROFILE,
    source: isSupabaseConfigured() ? 'supabase_postgresql' : 'local_storage_fallback'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const savedRemote = await saveRemoteProfile(body);
    return NextResponse.json({
      success: true,
      profile: body,
      persistedToSupabase: savedRemote
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
