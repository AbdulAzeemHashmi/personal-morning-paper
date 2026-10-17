import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    database: isSupabaseConfigured() ? 'Supabase PostgreSQL' : 'Local Fallback',
    supabaseConnected: isSupabaseConfigured(),
    timestamp: Date.now()
  });
}
