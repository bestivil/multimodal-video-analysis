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
  const queryClient = useQueryClient();

  const {
    data: transcriptData,
    loading: transcriptLoading,
    error: transcriptError,
  } = useTranscript({
    URL: submittedURL,
  });

  const {
    data: breakdownData,
    loading: breakdownLoading,
    error: breakdownError,
  } = useBreakdown({
    URL: submittedURL,
    transcript: transcriptData || undefined,
  });

  const videoEndTime = transcriptData?.length
    ? transcriptData[transcriptData.length - 1].start +
      transcriptData[transcriptData.length - 1].duration
    : 0;

  useEffect(() => {
    if (
      !transcriptData ||
      (Array.isArray(transcriptData) && transcriptData.length === 0)
    ) {
      queryClient.invalidateQueries({ queryKey: ["transcript"] });
      queryClient.invalidateQueries({ queryKey: ["breakdown"] });
    }
  }, [transcriptData, queryClient]);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex border-gray-200 mb-4 gap-2 justify-around">
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
        {activeTab === "transcript" && (
          <Transcript
            data={transcriptData}
            loading={transcriptLoading}
            error={transcriptError}
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
