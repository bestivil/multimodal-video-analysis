import { Breakdown as BreakdownContentType } from "@/app/hooks/useBreakdown";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useEffect, useRef } from "react";
import localforage from "localforage";
import { LoadingAnimation } from "@/components/loading-animations";
import ErrorComponent from "../error-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

type BreakdownProps = {
  data: BreakdownContentType[] | undefined;
  loading: boolean;
  error: Error | null;
  url: string;
  timestamp: number;
  setTimestamp: (timestamp: number) => void;
  onSeek?: (timestamp: number) => void;
  refetchBreakdown?: () => void;
};

const Breakdown: React.FC<BreakdownProps> = ({
  data,
  loading,
  error,
  url,
  timestamp,
  setTimestamp,
  onSeek,
  refetchBreakdown,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

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
        } catch (error) {}
      })();
    }
  }, [url, data]);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [timestamp]);

  if (!url) return null;
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error || data?.length === 0) {
    return (
      <ErrorComponent
        message={error?.message || "Unable to generate breakdown."}
        refetchBreakdown={refetchBreakdown}
      />
    );
  }

  if (data && Array.isArray(data)) {
    return (
      <>
        {data.length > 0 && (
          <div className="flex items-center justify-center md:justify-end mx-4">
            <span
              className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded select-none flex flex-row items-center gap-2 cursor-pointer"
              onClick={() => {
                refetchBreakdown?.();
              }}
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Regenerate with AI
            </span>
          </div>
        )}
        <div
          ref={containerRef}
          className="relative max-h-[500px] overflow-y-auto space-y-2 max-w-2xl mx-auto mt-8"
        >
          {data.map((item) => {
            const isActive =
              item.startTime <= timestamp && timestamp < item.endTime;
            return (
              <div
                ref={isActive ? activeRef : null}
                key={item.startTime}
                className={`rounded p-4 mb-2 hover:cursor-pointer hover:bg-muted-foreground/10 ${
                  isActive ? "bg-muted-foreground/10" : ""
                } ${theme === "dark" ? "bg-muted-foreground/5" : ""}`}
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
      </>
    );
  }
  if (data && typeof data === "object" && "error" in data) {
    return <div className="text-red-500">Error</div>;
  }
  if (!data) {
    return null;
  }
  return <div>Unknown response</div>;
};

export default Breakdown;
