import { useQuery } from "@tanstack/react-query";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TranscriptItem } from "@/pages/transcript";

export type Breakdown = {
  startTime: number;
  endTime: number;
  title: string;
  summary: string;
};

export const useBreakdown = ({
  URL,
  transcript,
}: {
  URL: string;
  transcript: TranscriptItem[] | undefined;
}) => {
  const apiKey = process.env.GEMINI_API_KEY as string;

  const mergedTranscript = transcript
    ? transcript.map((item) => `${item.text}`).join(" \n\n")
    : " ";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an expert at summarizing 
      and breaking down YouTube videos. Given a YouTube video URL, provide a sectioned breakdown of the video's content. 
      Each section should have a title and a concise summary.
      ONLY return the breakdown in JSON format with with an array of sections, each with a startTime, endTime, and summary, in the format [{startTime: number, endTime: number, title: string, summary: string}]. DO NOT include any other text in your response.`,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["breakdown", URL, transcript],
    queryFn: async () => {
      if (!URL || !transcript) {
        return {
          data: undefined,
          loading: true,
          error: new Error("No URL or transcript provided"),
        };
      }

      const body = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Please provide a sectioned breakdown of the following YouTube video ${URL} using the transcript: ${mergedTranscript}. `,
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
      return json;
    },
    enabled: !!URL && !!transcript,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data as Breakdown[] | undefined,
    loading: isLoading,
    error,
    refetch,
  };
};
