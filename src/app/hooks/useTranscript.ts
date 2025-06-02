import { useQuery } from "@tanstack/react-query";

export const useTranscript = (URL: string) => {
  const videoId = extractVideoId(URL);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const response = await fetch(`/api/get-transcript?videoId=${videoId}`);
      const result = await response.json();
      return result.transcript || "";
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data ?? "",
    loading: isLoading,
    error,
    refetch,
  };
};

function extractVideoId(url: string) {
  if (!url) return "";
  const parts = url.split("=");
  return parts[1] || "";
}
