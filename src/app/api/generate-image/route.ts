import { NextResponse } from 'next/server';
import { generateImageWithGemini, isGeminiConfigured } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt, title, category, aspectRatio } = body;

    const effectivePrompt = prompt || title || 'The Morning Broadsheet Editorial';
    const result = await generateImageWithGemini(effectivePrompt, {
      articleTitle: title || 'Lead Story',
      category: category || 'Editorial',
      aspectRatio: aspectRatio || '16:9'
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      prompt: result.prompt,
      caption: result.caption,
      model: result.model,
      provider: result.provider,
      geminiConfigured: isGeminiConfigured()
    });
  } catch (error: any) {
    console.error('[API generate-image] Error generating image:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Image generation failed'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Gemini Image Generation API',
    geminiConfigured: isGeminiConfigured(),
    supportedProviders: ['gemini-imagen', 'gemini-flash-svg', 'curated-woodcut'],
    aspectRatios: ['16:9', '1:1', '4:3']
  });
}
