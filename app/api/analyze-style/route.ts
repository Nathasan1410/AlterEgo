// Style Analysis API - Extract user's writing DNA
import { NextRequest, NextResponse } from 'next/server';
import { analyzeUserStyle, generateStylePrompt } from '@/lib/style-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { posts } = body;

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of past posts' },
        { status: 400 }
      );
    }

    console.log('[Style Analysis] Analyzing', posts.length, 'posts');

    // Analyze the user's writing style
    const styleProfile = await analyzeUserStyle(posts);
    
    // Generate the style injection prompt
    const stylePrompt = generateStylePrompt(styleProfile);

    console.log('[Style Analysis] Profile extracted:', styleProfile.tone);

    return NextResponse.json({
      success: true,
      profile: styleProfile,
      stylePrompt: stylePrompt,
    });

  } catch (error) {
    console.error('Style analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze style' },
      { status: 500 }
    );
  }
}
