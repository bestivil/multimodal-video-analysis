import { NextApiRequest, NextApiResponse } from "next";
import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: "No video ID provided.",
    });
  }

  const data = await YoutubeTranscript.fetchTranscript(
    Array.isArray(videoId) ? videoId[0] : videoId
  );

  return res.status(200).json({
    success: true,
    data,
  });
}
