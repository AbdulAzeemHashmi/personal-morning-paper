import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ReaderProfile, LearningSignals, Article, PaperEdition } from '../types';
import { DEFAULT_PROFILE, DEFAULT_SIGNALS } from '../utils/learningEngine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client, using resilient fallback mode', err);
  }
}

export const isSupabaseConfigured = (): boolean => Boolean(supabaseInstance);

export async function fetchRemoteProfile(): Promise<ReaderProfile | null> {
  if (!supabaseInstance) return null;

  try {
    const { data, error } = await supabaseInstance
      .from('reader_profiles')
      .select('*')
      .eq('user_id', 'default_reader')
      .single();

    if (error || !data) return null;

    return {
      name: data.name,
      location: data.location,
      newspaperName: data.newspaper_name,
      motto: data.motto,
      readingTime: data.reading_time,
      tone: data.tone,
      topics: data.topics,
      customKeywords: data.keywords,
      theme: data.theme,
      onboardingCompleted: data.onboarding_completed
    };
  } catch {
    return null;
  }
}

export async function saveRemoteProfile(profile: ReaderProfile): Promise<boolean> {
  if (!supabaseInstance) return false;

  try {
    const { error } = await supabaseInstance
      .from('reader_profiles')
      .upsert({
        user_id: 'default_reader',
        name: profile.name,
        location: profile.location,
        newspaper_name: profile.newspaperName,
        motto: profile.motto,
        reading_time: profile.readingTime,
        tone: profile.tone,
        topics: profile.topics,
        keywords: profile.customKeywords,
        theme: profile.theme,
        onboarding_completed: profile.onboardingCompleted,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    return !error;
  } catch {
    return false;
  }
}

export async function recordRemoteSignal(
  articleId: string,
  title: string,
  category: string,
  action: 'skip' | 'read' | 'like' | 'bookmark'
): Promise<boolean> {
  if (!supabaseInstance) return false;

  try {
    const { error } = await supabaseInstance
      .from('interaction_signals')
      .insert({
        user_id: 'default_reader',
        article_id: articleId,
        title,
        category,
        action
      });

    return !error;
  } catch {
    return false;
  }
}

export async function fetchRemoteWeights(): Promise<{ categoryWeights: Record<string, number>; keywordWeights: Record<string, number> } | null> {
  if (!supabaseInstance) return null;

  try {
    const { data: catData } = await supabaseInstance
      .from('category_weights')
      .select('category, weight')
      .eq('user_id', 'default_reader');

    const { data: kwData } = await supabaseInstance
      .from('keyword_weights')
      .select('keyword, weight')
      .eq('user_id', 'default_reader');

    const categoryWeights: Record<string, number> = {};
    catData?.forEach(r => { categoryWeights[r.category] = Number(r.weight); });

    const keywordWeights: Record<string, number> = {};
    kwData?.forEach(r => { keywordWeights[r.keyword] = Number(r.weight); });

    return { categoryWeights, keywordWeights };
  } catch {
    return null;
  }
}
