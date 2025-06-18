"use server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("URL");
  const { transcript, breakdown, history, videoEndTime } = await request.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "No video URL provided." },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    systemInstruction: `You are a helpful assistant. The following YouTube video has URL: ${id} and transcript: ${transcript}, and breakdown: ${breakdown}. Use this information to answer the user's questions. Only respond with JSON with the structure: {response: string, sections?: {startTimestamp: number, endTimestamp: number, summary: string, title: string}[]} where response is the main response to the user's question and sections is an array of sections of the video that are relevant to the user's question. The video ends at ${videoEndTime} seconds. ONLY add sections if relevant to the question, otherwise return just a response with the string containing the answer`,
  });

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please provide a sectioned breakdown of a YouTube video that has the following transcript: ${transcript}, and the video URL is ${id}.`,
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
      { success: false, error: "Failed to parse chat response." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: json });
}
