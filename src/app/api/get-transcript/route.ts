"use server";
import { NextResponse } from "next/server";
import { YoutubeTranscript, TranscriptResponse } from "youtube-transcript";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "No video ID provided." },
      { status: 400 }
    );
  }

  try {
    const data = await YoutubeTranscript.fetchTranscript(id);
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No transcript found for this video." },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: data as TranscriptResponse[],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to fetch transcript. The video may not have captions available or the video ID is incorrect.",
      },
      { status: 500 }
    );
  }
}
