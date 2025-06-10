import { Breakdown as BreakdownContentType } from "../app/hooks/useBreakdown";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useEffect } from "react";
import localforage from "localforage";
import { LoadingAnimation } from "@/components/loading-animations";

type BreakdownProps = {
  data: BreakdownContentType[] | undefined;
  loading: boolean;
  error: Error | null;
  url: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  onSeek?: (timestamp: number) => void;
};

export function Breakdown({
  data,
  loading,
  error,
  url,
  timestamp,
  setTimestamp,
  onSeek,
}: BreakdownProps) {
  useEffect(() => {
    if (url && data && Array.isArray(data)) {
      (async () => {
        try {
          const record =
            (await localforage.getItem<{
              breakdown: BreakdownContentType[];
            }>(url)) || {};
          record.breakdown = data;
          await localforage.setItem(url, record);
        } catch (error) {
          console.error("Failed to save breakdown for recent videos:", error);
        }
      })();
    }
  }, [url, data]);

  if (!url) return null;
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (data && Array.isArray(data)) {
    return (
      <div className="space-y-2 max-w-2xl mx-auto mt-8">
        {data.map((item) => {
          const isActive =
            item.startTime <= timestamp && timestamp < item.endTime;
          return (
            <div
              key={item.startTime}
              className={`rounded p-4 mb-2 hover:cursor-pointer ${
                isActive ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setTimestamp(item.startTime);
                if (onSeek) {
                  onSeek(item.startTime);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="min-w-[48px] text-xs text-gray-600"
                >
                  {formatTime(item.startTime)}
                </Button>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-500 pl-14">{item.summary}</p>
            </div>
          );
        })}
      </div>
    );
  }
  if (data && typeof data === "object" && "error" in data) {
    return <div className="text-red-500">Error</div>;
  }
  if (!data) {
    return null;
  }
  return <div>Unknown response</div>;
}
