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

  const data = await YoutubeTranscript.fetchTranscript(videoId as string);

  return res.status(200).json({
    success: true,
    data,
  });
}
