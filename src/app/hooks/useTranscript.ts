import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";

export const useTranscript = ({ URL }: { URL: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const record = (await localforage.getItem<any>(URL)) || {};
      if (record.transcript && record.transcript.length > 0) {
        return record.transcript;
      }

      const response = await fetch(`/api/get-transcript?URL=${URL}`);
      const result = await response.json();
      return result.data;
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const loading = isLoading || (Array.isArray(data) && data.length === 0);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
