import { TranscriptItem } from "@/pages/transcript";
import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";

export const useTranscript = ({ URL }: { URL: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const record = await localforage.getItem<{
        transcript: TranscriptItem[];
      }>(URL);

      if (record && record.transcript.length > 0) {
        return record.transcript;
      }

      const response = await fetch(`/api/get-transcript?URL=${URL}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch transcript");
      }

      await localforage.setItem(URL, { transcript: result.data });
      return result.data;
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const loading = isLoading;

  return {
    data: loading ? undefined : data,
    loading,
    error,
    refetch,
  };
};
