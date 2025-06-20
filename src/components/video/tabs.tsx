import Breakdown from "./breakdown";
import Transcript from "./transcript";
import { useEffect, useState } from "react";
import Chat from "./chat";
import { useBreakdown } from "@/app/hooks/useBreakdown";
import { useTranscript } from "@/app/hooks/useTranscript";
const TABS = ["transcript", "breakdown", "chat"] as const;
type Tab = (typeof TABS)[number];

type TabsProps = {
  submittedURL: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  setSeekTimestamp: (timestamp: number) => void;
  setKeys: React.Dispatch<React.SetStateAction<string[]>>;
};

const Tabs: React.FC<TabsProps> = ({
  submittedURL,
  timestamp,
  setTimestamp,
  setSeekTimestamp,
  setKeys,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("transcript");

  useEffect(() => {
    setActiveTab("transcript");
  }, [submittedURL]);

  const {
    data: transcriptData,
    loading: transcriptLoading,
    error: transcriptError,
    refetch: refetchTranscript,
  } = useTranscript({
    URL: submittedURL,
    setKeys,
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

  return (
    <div className={`w-full min-w-[40%] max-w-2xl `}>
      <div
        className={`flex border-gray-200 mb-4 gap-2 justify-around ${
          !submittedURL && "opacity-50 pointer-events-none select-none"
        }`}
      >
        <div className="flex w-full  dark:border-gray-700">
          {TABS.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center cursor-pointer py-2 transition-colors dark:hover:bg-muted/30 hover:bg-muted transition-all
                ${
                  activeTab === tab
                    ? "border-b-2 border-b-muted-foreground font-semibold text-muted-foreground"
                    : "text-gray-500 dark:text-gray-400 hover:text-muted-foreground"
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>
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
              refetchTranscript={refetchTranscript}
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
            refetchBreakdown={refetchBreakdown}
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

export default Tabs;
