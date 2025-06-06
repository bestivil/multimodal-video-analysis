import { useQuery } from "@tanstack/react-query";

export const useTranscript = ({ URL }: { URL: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const response = await fetch(`/api/get-transcript?URL=${URL}`);
      const result = await response.json();
      return result.data;
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
