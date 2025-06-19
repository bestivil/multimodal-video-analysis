import { useQuery } from "@tanstack/react-query";
import localforage from "localforage";
import { BACKEND_URL, TranscriptResponse } from "../constants";

export const useTranscript = ({
  URL,
  setKeys,
}: {
  URL: string;
  setKeys: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["transcript", URL],
    queryFn: async () => {
      const record = await localforage.getItem<{
        transcript: TranscriptResponse[];
      }>(URL);

      if (record && record.transcript.length > 0) {
        return record.transcript as TranscriptResponse[];
      }

      const response = await fetch(
        `${BACKEND_URL}/get_transcript?video_url=${URL}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch transcript");
      }

      if (result.detail && result.detail.includes("YouTube is blocking")) {
        throw new Error(
          "Internal Server error - issue Google is blocking requests from Cloud servers. Please try again later - https://shorturl.at/3pZSO"
        );
      }

      await localforage.setItem(URL, { transcript: result.transcript });
      setKeys((prevKeys) => [...prevKeys, URL]);
      return result.transcript as TranscriptResponse[];
    },
    enabled: !!URL,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    loading: isFetching,
    error,
    refetch,
  };
};
