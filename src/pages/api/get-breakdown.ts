"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { URL } = req.query;
  const { transcript } = req.body;

  if (!URL) {
    return res.status(400).json({
      success: false,
      error: "No video ID provided.",
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    systemInstruction: `You are an expert at summarizing 
      and breaking down YouTube videos. Given a YouTube video's transcript, provide a sectioned breakdown of the video's content. 
      Each section should have a title and a concise summary.
      ONLY return the breakdown in JSON format with with an array of sections, each with a startTime, endTime, and summary, in the format [{startTime: number, endTime: number, title: string, summary: string}]. DO NOT include any other text in your response.`,
  });

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please provide a sectioned breakdown of a YouTube video that has the following transcript: ${transcript}, and the video URL is ${URL}. `,
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
  const json = JSON.parse(cleaned);

  return res.status(200).json({
    success: true,
    data: json,
  });
}
