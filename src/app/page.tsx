"use client";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import EmbedVideo from "@/pages/embed-video";
import Tabs from "@/pages/tabs";
import VideoURLInput from "@/pages/url-input";
import { ThemeToggle } from "@/components/theme-toggle";
import RecentVideos from "@/components/recent-videos";

const queryClient = new QueryClient();

function Home() {
  const [submittedURL, setSubmittedURL] = useState<string>("");
  const [timestamp, setTimestamp] = useState<number>(0);
  const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);

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

          <div className="flex flex-col md:flex-row gap-2 gap-y-4 justify-between w-full h-full">
            <div className="flex flex-col gap-4 w-full">
              <RecentVideos setSubmittedURL={setSubmittedURL} />
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
