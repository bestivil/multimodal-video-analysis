"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import EmbedVideo from "@/components/video/embed-video";
import Tabs from "@/components/video/tabs";
import VideoURLInput from "@/components/video/url-input";
import { ThemeToggle } from "@/components/theme-toggle";
import RecentVideos from "@/components/recent-videos";

const queryClient = new QueryClient();

function Home() {
  const [submittedURL, setSubmittedURL] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    setSeekTimestamp(null);
  }, [submittedURL]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="flex flex-col p-16 gap-12 justify-items-center items-center font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-row w-full items-center gap-2">
            <div className="flex flex-row w-full items-center gap-12 justify-center">
              <VideoURLInput setSubmittedURL={setSubmittedURL} />
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 gap-y-4 justify-around w-full h-full">
            <div className="flex flex-col gap-4 w-full">
              <RecentVideos
                submittedURL={submittedURL}
                setSubmittedURL={setSubmittedURL}
                keys={keys}
                setKeys={setKeys}
              />
              <EmbedVideo
                url={submittedURL}
                onTimeUpdate={setTimestamp}
                seekTimestamp={seekTimestamp}
              />
            </div>
            <Tabs
              submittedURL={submittedURL}
              timestamp={timestamp}
              setTimestamp={setTimestamp}
              setSeekTimestamp={setSeekTimestamp}
              setKeys={setKeys}
            />
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function Page() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Home />
    </ThemeProvider>
  );
}
