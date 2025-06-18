import { LoadingAnimation } from "@/components/loading-animations";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import localforage from "localforage";
import ErrorComponent from "../error-component";
import { TranscriptResponse } from "@/app/constants";

type TranscriptProps = {
  data: TranscriptResponse[] | undefined;
  loading: boolean;
  error: Error | null;
  url: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  onSeek?: (timestamp: number) => void;
  refetchTranscript?: () => void;
};

const Transcript: React.FC<TranscriptProps> = ({
  data,
  loading,
  error,
  url,
  timestamp,
  setTimestamp,
  onSeek,
  refetchTranscript,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [timestamp]);

  useEffect(() => {
    if (url && data && Array.isArray(data)) {
      (async () => {
        try {
          const record =
            (await localforage.getItem<{
              transcript: TranscriptResponse[];
            }>(url)) || {};
          record.transcript = data;
          await localforage.setItem(url, record);
        } catch (error) {
          console.error("Failed to save transcript for recent videos:", error);
        }
      })();
    }
  }, [url, data]);

  if (!url) return null;
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return (
      <ErrorComponent
        message={error.message}
        refetchTranscript={refetchTranscript}
      />
    );
  }

  if (data && Array.isArray(data)) {
    return (
      <div
        ref={containerRef}
        className="relative max-h-[500px] overflow-y-auto space-y-2 max-w-2xl mx-auto mt-8"
      >
        {data.map((item: TranscriptResponse, idx: number) => {
          const isActive =
            item.start <= timestamp &&
            (typeof data[idx + 1] === "undefined" ||
              timestamp < data[idx + 1].start);
          return (
            <div
              ref={isActive ? activeRef : null}
              key={idx}
              className={`rounded p-4 mb-2 hover:cursor-pointer hover:bg-muted-foreground/10 ${
                isActive ? "bg-muted-foreground/10" : ""
              } ${theme === "dark" ? "bg-muted-foreground/5" : ""} `}
              onClick={() => {
                setTimestamp(item.start);
                if (onSeek) {
                  onSeek(item.start);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="min-w-[48px] text-xs text-gray-600"
                >
                  {formatTime(item.start)}
                </Button>
                <span>{item.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  if (typeof data === "string") {
    return <div>{data}</div>;
  }
  if (data && typeof data === "object" && "error" in data) {
    return (
      <div className="text-red-500">
        Error: {(data as { error: string }).error}
      </div>
    );
  }
  if (!data) {
    return null;
  }
  return <div>Unknown response</div>;
};

export default Transcript;
