"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { URL: videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: "No video ID provided.",
    });
  }

  try {
    const results = await YoutubeTranscript.fetchTranscript(videoId as string);

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No transcript found for this video.",
      });
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return res.status(500).json({
      success: false,
      error:
        "Failed to fetch transcript. The video may not have captions available.",
    });
  }
}
