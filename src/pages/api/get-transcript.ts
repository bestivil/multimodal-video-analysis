import { NextApiRequest, NextApiResponse } from "next";
import { TranscriptResponse, YoutubeTranscript } from "youtube-transcript";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      error: "No video ID provided.",
    });
  }

  try {
    await YoutubeTranscript.fetchTranscript(
      Array.isArray(id) ? id[0] : id
    ).then((data) => {
      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No transcript found for this video.",
        });
      }

      return res.status(200).json({
        success: true,
        data: data as TranscriptResponse[],
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:
        "Failed to fetch transcript. The video may not have captions available or the video ID is incorrect.",
    });
  }
}
