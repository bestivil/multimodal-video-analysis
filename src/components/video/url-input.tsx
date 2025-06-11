import { Button } from "@/components/ui/button";

import { CONST_PLACEHOLDER_URL } from "@/app/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type VideoURLInputProps = {
  setSubmittedURL: (url: string) => void;
};

const VideoURLInput: React.FC<VideoURLInputProps> = ({ setSubmittedURL }) => {
  const [youtubeURL, setYoutubeURL] = useState<string>("");

  const handleSubmit = () => {
    setSubmittedURL(
      youtubeURL.trim().length === 0 ? CONST_PLACEHOLDER_URL : youtubeURL
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center  gap-4">
      <div className="relative w-[500px]">
        <Input
          type="text"
          placeholder={CONST_PLACEHOLDER_URL}
          value={youtubeURL}
          onChange={(e) => setYoutubeURL(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="w-full pr-10 border-gray-300 dark:border-gray-700"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1 rounded text-sm text-gray-500">
          <span
            className="inline-block align-middle"
            style={{
              fontFamily:
                'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: "0.95em",
              letterSpacing: "0.01em",
            }}
          >
            ↩︎
          </span>
        </kbd>
      </div>
      <Button onClick={handleSubmit} className="cursor-pointer">
        Send
      </Button>
    </div>
  );
};

export default VideoURLInput;
