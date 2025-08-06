import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function GET(request: NextRequest) {
  try {
    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const request_url = request.nextUrl.pathname;
    const previous_response_id = request_url.split("/")[4]

    const client = new OpenAI({
      apiKey,
    });

    const response = await client.responses.inputItems.list(previous_response_id);

    return NextResponse.json({
      data: response.data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
