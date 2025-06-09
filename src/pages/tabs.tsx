import { Button } from "@/components/ui/button";
import { Breakdown } from "./breakdown";
import { Transcript } from "./transcript";
import { useEffect, useState } from "react";
import { Chat } from "./chat";
import { useBreakdown } from "@/app/hooks/useBreakdown";
import { useTranscript } from "@/app/hooks/useTranscript";
import { useQueryClient } from "@tanstack/react-query";
const TABS = ["transcript", "breakdown", "chat"] as const;
type Tab = (typeof TABS)[number];

type TabsProps = {
  submittedURL: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  setSeekTimestamp: (timestamp: number) => void;
};

export const Tabs = ({
  submittedURL,
  timestamp,
  setTimestamp,
  setSeekTimestamp,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("transcript");

  const {
    data: transcriptData,
    loading: transcriptLoading,
    error: transcriptError,
    refetch: refetchTranscript,
  } = useTranscript({
    URL: submittedURL,
  });

  const {
    data: breakdownData,
    loading: breakdownLoading,
    error: breakdownError,
    refetch: refetchBreakdown,
  } = useBreakdown({
    URL: submittedURL,
    transcript: transcriptData || undefined,
  });

  const videoEndTime = transcriptData?.length
    ? transcriptData[transcriptData.length - 1].start +
      transcriptData[transcriptData.length - 1].duration
    : 0;

  useEffect(() => {
    if (!transcriptData || transcriptLoading) {
      refetchTranscript();
    }
  }, []);

  useEffect(() => {
    if (
      !breakdownData ||
      breakdownLoading ||
      (Array.isArray(breakdownData) && breakdownData.length === 0)
    ) {
      refetchBreakdown();
    }
  }, []);

  return (
    <div className={`w-full min-w-[40%] max-w-2xl `}>
      <div
        className={`flex border-gray-200 mb-4 gap-2 justify-around ${
          !submittedURL && "opacity-50 pointer-events-none select-none"
        }`}
      >
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant="secondary"
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "border-b-2" : ""}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
      <div>
        {activeTab === "transcript" &&
          (!submittedURL ? (
            <div className="flex border-gray-200 text-red-400 mb-4 gap-2 justify-around">
              <h4>Please enter a valid YouTube URL</h4>
            </div>
          ) : (
            <Transcript
              data={transcriptData}
              loading={transcriptLoading}
              error={transcriptError}
              url={submittedURL}
              timestamp={timestamp}
              setTimestamp={setTimestamp}
              onSeek={setSeekTimestamp}
            />
          ))}
        {activeTab === "breakdown" && (
          <Breakdown
            data={breakdownData}
            loading={breakdownLoading}
            error={breakdownError}
            url={submittedURL}
            timestamp={timestamp}
            setTimestamp={setTimestamp}
            onSeek={setSeekTimestamp}
          />
        )}

        {activeTab === "chat" && (
          <Chat
            url={submittedURL}
            transcript={transcriptData}
            breakdown={breakdownData}
            setTimestamp={setTimestamp}
            onSeek={setSeekTimestamp}
            videoEndTime={videoEndTime}
          />
        )}
      </div>
    </div>
  );
};
