import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import { TranscriptResponse } from "youtube-transcript";

export const useTranscript = ({ URL }: { URL: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const record = await localforage.getItem<{
        transcript: TranscriptResponse[];
      }>(URL);

      if (record && record.transcript.length > 0) {
        return record.transcript;
      }

      const response = await fetch(`/api/get-transcript?id=${URL}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transcript");
      }

      await localforage.setItem(URL, { transcript: result.data });
      return result.data as TranscriptResponse[];
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    loading: isLoading,
    error,
    refetch,
  };
};
