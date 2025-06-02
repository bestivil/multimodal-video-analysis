"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import EmbedVideo from "@/pages/embed-video";
import { Tabs } from "@/pages/tabs";
import { VideoURLInput } from "@/pages/url-input";

const queryClient = new QueryClient();

export default function Home() {
  const [submittedURL, setSubmittedURL] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setSeekTimestamp(null);
  }, [submittedURL]);

  const validURL = submittedURL.includes("youtube.com");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col p-16 gap-12 justify-items-center items-center font-[family-name:var(--font-geist-sans)]">
        <VideoURLInput setSubmittedURL={setSubmittedURL} />
        {validURL ? (
          <div className="flex flex-col md:flex-row gap-2 gap-y-4 justify-around">
            <EmbedVideo
              url={submittedURL}
              onTimeUpdate={setTimestamp}
              seekTimestamp={seekTimestamp}
            />
            <div className="w-px h-96 bg-gray-300 mx-6 hidden md:block" />
            <Tabs
              submittedURL={submittedURL}
              timestamp={timestamp}
              setTimestamp={setTimestamp}
              setSeekTimestamp={setSeekTimestamp}
            />
          </div>
        ) : (
          <div className="flex border-gray-200 text-red-400 mb-4 gap-2 justify-around">
            <h4>Please enter a valid YouTube URL</h4>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}
