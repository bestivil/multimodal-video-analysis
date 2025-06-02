import { exec } from "child_process";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(400).json({
      success: false,
      error: "No video ID provided.",
    });
  }

  const pythonScriptPath = path.join(process.cwd(), "backend", "transcript.py");

  execAsync(`python3 ${pythonScriptPath} ${videoId}`).then(
    ({ stdout, stderr }) => {
      if (stderr) {
        console.error("Error executing Python script:", stderr);
        return res.status(500).json({
          success: false,
          error: stderr,
        });
      }

      if (stderr) {
        console.error("Python script stderr:", stderr);
        return res.status(500).json({
          success: false,
          error: stderr,
        });
      }

      try {
        const transcript = JSON.parse(stdout);
        res.status(200).json({
          success: true,
          transcript,
        });
      } catch (parseError) {
        console.error("Error parsing Python script output:", parseError);
        res.status(500).json({
          success: false,
          error: "Failed to parse Python script output.",
        });
      }
    }
  );
}
