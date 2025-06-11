"use server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("URL");
  const { transcript } = await request.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "No video URL provided." },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    systemInstruction: `You are an expert at summarizing 
      and breaking down YouTube videos. Given a YouTube video's transcript, provide a sectioned breakdown of the video's content. 
      Each section should have a title and a concise summary.
      ONLY return the breakdown in JSON format with an array of sections, each with a startTime, endTime, title, and summary, like [{startTime: number, endTime: number, title: string, summary: string}]. DO NOT include any other text in your response.`,
  });

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please provide a sectioned breakdown of a YouTube video that has the following transcript: ${transcript}, and the video URL is ${URL}.`,
          },
        ],
      },
    ],
  };

  const response = await model.generateContent(body);
  const rawText = await response.response.text();

  const cleaned = rawText
    .replace(/^```json\s*/, "")
    .replace(/```[\s\n]*$/g, "")
    .trim();

  let json;
  try {
    json = JSON.parse(cleaned);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to parse breakdown response." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: json });
}
