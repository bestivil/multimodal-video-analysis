import { useQuery } from "@tanstack/react-query";
import { TranscriptResponse } from "youtube-transcript";

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
  transcript: TranscriptResponse[] | undefined;
}) => {
  const mergedTranscript = transcript
    ? transcript.map((item) => `${item.text}`).join(" \n\n")
    : " ";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["breakdown", URL, mergedTranscript],
    queryFn: async () => {
      const response = await fetch(`/api/get-breakdown?URL=${URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
