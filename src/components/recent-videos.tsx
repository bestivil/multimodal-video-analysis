"use client";
import { useEffect, useState } from "react";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { fetchVideoMetadata } from "@/app/hooks/useVideoMetadata";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface VideoData {
  transcript?: string;
  breakdown?: string;
  chat?: string;
  thumbnail?: string;
  title?: string;
}

type RecentVideosProps = {
  setSubmittedURL: (url: string) => void;
};

export default function RecentVideos({ setSubmittedURL }: RecentVideosProps) {
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [videoData, setVideoData] = useState<Record<string, VideoData>>({});
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      const keys = (await localforage.keys()) as string[];
      setRecentKeys(keys);
      const dataRecord: Record<string, VideoData> = {};
      for (const key of keys) {
        const item = await localforage.getItem<VideoData>(key);
        if (item) {
          dataRecord[key] = item;
        }
      }
      setVideoData(dataRecord);
    }
    loadRecent();
  }, []);

  Object.keys(videoData).map(async (key) => {
    const { title, thumbnail } = await fetchVideoMetadata(key);
    videoData[key].title = title;
    videoData[key].thumbnail = thumbnail;
    if (title || thumbnail) {
      localforage.setItem(key, videoData[key]);
    }

    return videoData[key];
  });

  return (
    <div
      className=" max-h-[315px] max-w-[560px] mx-auto p-12 rounded-lg shadow-sm dark:bg-gray-900/10 dark:shadow-gray-300/10 shadow-gray-300 dark:shadow-gray-800"
      style={{
        width: "100%",
        minHeight: isOpen ? undefined : `${Math.max(120, 64 + 56 * 1)}px`,
        transition: "min-height 0.2s",
        overflow: isOpen ? "auto" : "hidden",
        boxSizing: "border-box",
      }}
    >
      <div className="flex flex-row items-center mb-4">
        <h2 className="text-2xl font-bold flex-auto">
          Recents{" "}
          <span className="text-sm text-gray-500">
            {recentKeys.length > 0 ? `(${recentKeys.length})` : ""}
          </span>
        </h2>
        <Button
          variant="ghost"
          className={`ml-2 px-3 py-1 rounded cursor-pointer transition-transform duration-450 ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </Button>
      </div>

      <div
        className={`flex flex-row items-center rounded transition ${
          recentKeys.length > 0 ? "-space-x-6" : ""
        }`}
      >
        {recentKeys.length === 0 && (
          <div className="flex flex-row items-center justify-center rounded transition">
            <span className="flex flex-row items-center text-gray-500 text-sm">
              No recent videos - add a video to get started
            </span>
          </div>
        )}
        {!isOpen && recentKeys.length > 0 && (
          <>
            {recentKeys.slice(-5).map((url, index) => {
              const video = videoData[url] || {};
              return (
                <div key={index}>
                  <img
                    src={video.thumbnail}
                    className="w-20 h-12 object-cover rounded-md border border-black/20 dark:border-gray-700/20 "
                  />
                </div>
              );
            })}
            <span className="flex flex-row items-center ml-auto text-gray-500 text-sm">
              Expand for more
            </span>
          </>
        )}
      </div>
      <div
        style={{
          width: "100%",
          visibility: isOpen ? "visible" : "hidden",
          height: isOpen ? "auto" : 0,
          transition: "height 0.2s",
        }}
      >
        <ul className="space-y-4">
          {isOpen &&
            [...recentKeys].reverse().map((url) => {
              const video = videoData[url] || {};
              return (
                <li
                  key={url}
                  className="flex items-center justify-between gap-4 p-2 rounded hover:bg-muted-background/5 dark:hover:bg-gray-800/10 transition cursor-pointer"
                  onClick={() => setSubmittedURL(url)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title || "Video thumbnail"}
                        className="w-12 h-8 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-8 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                    <button
                      className="text-left truncate dark:text-white/80 text-black/80 hover:underline font-medium flex-1"
                      style={{ maxWidth: "16rem" }}
                    >
                      {video.title ? video.title : url.slice(0, 20) + "..."}
                    </button>
                  </div>
                  <FontAwesomeIcon
                    data-tooltip-id="delete-item"
                    data-tooltip-content="Delete item"
                    icon={faTrash}
                    onClick={() => {
                      localforage.removeItem(url);
                      setRecentKeys(recentKeys.filter((key) => key !== url));
                    }}
                    className="cursor-pointer hover:bg-muted-background rounded-md p-1"
                  />
                </li>
              );
            })}
        </ul>
      </div>
      <ReactTooltip id="delete-item" place="top" variant="error" />
    </div>
  );
}
