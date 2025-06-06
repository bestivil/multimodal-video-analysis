import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

export type TranscriptItem = {
  text: string;
  duration: number;
  offset: number;
  lang: string;
};

type TranscriptProps = {
  data: TranscriptItem[] | undefined;
  loading: boolean;
  error: Error | null;
  url: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  onSeek?: (timestamp: number) => void;
};

export function Transcript({
  data,
  loading,
  error,
  url,
  timestamp,
  setTimestamp,
  onSeek,
}: TranscriptProps) {
  if (!url) return null;
  if (loading) {
    return <div>Loading transcript...</div>;
  }
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (data && Array.isArray(data)) {
    return (
      <div className="space-y-2 max-w-2xl mx-auto mt-8">
        {data.map((item: TranscriptItem, idx: number) => {
          const isActive =
            item.offset <= timestamp &&
            (typeof data[idx + 1] === "undefined" ||
              timestamp < data[idx + 1].offset);
          return (
            <div
              key={idx}
              className={`rounded p-4 mb-2 hover:cursor-pointer ${
                isActive ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setTimestamp(item.offset);
                if (onSeek) {
                  onSeek(item.offset);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="min-w-[48px] text-xs text-gray-600"
                >
                  {formatTime(item.offset)}
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
}
