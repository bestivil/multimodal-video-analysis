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
  const mergedTranscript = transcript
    ? transcript.map((item) => `${item.text}`).join(" \n\n")
    : " ";


  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["breakdown", URL, transcript],
    queryFn: async () => {
      if (mergedTranscript.trim().length === 0) {
        return {
          data: undefined,
          loading: false,
          error: null,
        };
      }
      const response = await fetch(`/api/get-breakdown?URL=${URL}`, {
        method: "POST",
        body: JSON.stringify({ transcript: mergedTranscript }),
      });

      const result = await response.json();
      return result;
    },
    enabled: !!URL && !!transcript,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.data as Breakdown[] | undefined,
    loading: isLoading,
    error,
    refetch,
  };
};
