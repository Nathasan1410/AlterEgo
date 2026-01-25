// Research API - Tavily Web Search
import { NextRequest, NextResponse } from 'next/server';
import { searchTopic, getTrendingNews, getPostContext } from '@/lib/tavily-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type = 'search', industry } = body;

    if (!query && !industry) {
      return NextResponse.json(
        { error: 'Please provide a query or industry' },
        { status: 400 }
      );
    }

    console.log('[Research] Type:', type, 'Query:', query || industry);

    let result;

    switch (type) {
      case 'trending':
        result = await getTrendingNews(industry || query);
        break;
      case 'context':
        const context = await getPostContext(query);
        result = { context, query };
        break;
      case 'search':
      default:
        result = await searchTopic(query, 5);
        break;
    }

    console.log('[Research] Found', result.results?.length || 0, 'results');

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch research' },
      { status: 500 }
    );
  }
}
