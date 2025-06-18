import { useQuery } from "@tanstack/react-query";

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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["chat", url, transcript, breakdown, history, videoEndTime],
    queryFn: async () => {
      if (!url || !transcript || !breakdown) {
        throw new Error("Missing URL, transcript, or breakdown");
      }

      const res = await fetch(
        `/api/get-chat?URL=${encodeURIComponent(url)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            transcript,
            breakdown,
            history,
            videoEndTime,
          }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to get chat response");
      }

      return result.data;
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
