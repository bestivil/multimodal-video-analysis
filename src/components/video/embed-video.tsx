import { useEffect, useRef } from "react";

function EmbedVideo({
  url,
  onTimeUpdate,
  seekTimestamp,
}: {
  url: string;
  onTimeUpdate?: (time: number) => void;
  seekTimestamp?: number | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function getYouTubeId(url: string): string | null {
    if (!url || typeof url !== "string") {
      return null;
    }
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split(/[?&]/)[0];
    }
    if (url.includes("youtube.com")) {
      const v = url.split("v=")[1]?.split(/[?&]/)[0];
      return v || null;
    }
    return null;
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (
        event.origin !== "https://www.youtube.com" ||
        !event.data ||
        typeof event.data !== "string"
      ) {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        if (
          data.event === "infoDelivery" &&
          data.info &&
          typeof data.info.currentTime === "number"
        ) {
          if (onTimeUpdate) {
            onTimeUpdate(data.info.currentTime);
          }
        }
      } catch {}
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTimeUpdate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current) {
        getCurrentTime();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof seekTimestamp === "number" && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seekTimestamp, true],
          id: 1,
          channel: "widget",
        }),
        "*"
      );
    }
  }, [seekTimestamp]);

  function getCurrentTime() {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "listening",
          id: 1,
          channel: "widget",
        }),
        "*"
      );
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "getCurrentTime",
          args: [],
          id: 1,
          channel: "widget",
        }),
        "*"
      );
    }
  }

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <iframe
        ref={iframeRef}
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${
          typeof window !== "undefined" ? window.location.origin : ""
        }`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

export default EmbedVideo;
