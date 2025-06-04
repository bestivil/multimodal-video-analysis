import { useQuery } from "@tanstack/react-query";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type ChatMessage = {
  sender: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  response: string;
  sections: {
    startTimestamp: number;
    endTimestamp: number;
    summary: string;
    title: string;
  }[];
};

type useChatProps = {
  prompt: string;
  url: string;
  transcript: string | undefined;
  breakdown: string | undefined;
  history: ChatMessage[];
  videoEndTime: number;
};

export const useChat = ({
  prompt,
  url,
  transcript,
  breakdown,
  history,
  videoEndTime,
}: useChatProps) => {
  const apiKey = process.env.GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a helpful assistant. The following YouTube video has URL: ${url} and transcript: ${transcript}, and breakdown: ${breakdown}. Use this information to answer the user's questions. Only respond with JSON with the structure: {response: string, sections: {startTimestamp: number, endTimestamp: number, summary: string, title: string}[]} where response is the main response to the user's question and sections is an array of sections of the video that are relevant to the user's question. The video ends at ${videoEndTime} seconds.`,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["chat", url, transcript],
    queryFn: async () => {
      if (!url || !transcript || !breakdown) {
        throw new Error("Missing URL, transcript, or breakdown");
      }

      const contents = [
        ...history.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      const response = await model.generateContent({ contents });
      const rawText = await response.response
        .text()
        .replace(/^```json\s*/, "")
        .replace(/```[\s\n]*$/g, "")
        .trim();

      const json = JSON.parse(rawText);
      return json;
    },
    enabled: !!url && !!transcript && !!breakdown && !!history,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data as ChatResponse | undefined,
    loading: isLoading,
    error,
    refetch,
  };
};
