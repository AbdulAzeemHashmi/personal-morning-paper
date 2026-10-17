import { NextResponse } from 'next/server';
import { NewsroomOrchestrator } from '@/agents/NewsroomOrchestrator';
import { DEFAULT_PROFILE, DEFAULT_SIGNALS } from '@/utils/learningEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body.profile || DEFAULT_PROFILE;
    const signals = body.signals || DEFAULT_SIGNALS;
    const dateOffsetDays = body.dateOffsetDays || 0;

    const result = await NewsroomOrchestrator.assembleEdition(
      profile,
      signals,
      dateOffsetDays
    );

    return NextResponse.json({
      success: true,
      edition: result.edition,
      agentLogs: result.logs
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
