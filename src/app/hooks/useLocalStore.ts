import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import { TranscriptResponse } from "youtube-transcript";

export type LocalStore = {
  transcript: TranscriptResponse[];
};

export const useLocalStore = (URL: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["localStore", URL],
    queryFn: async () => {
      const data = await localforage.getItem(URL);
      return data;
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error, refetch };
};
