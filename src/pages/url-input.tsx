import { Button } from "@/components/ui/button";

import { CONST_PLACEHOLDER_URL } from "@/app/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type VideoURLInputProps = {
  setSubmittedURL: (url: string) => void;
};

const VideoURLInput: React.FC<VideoURLInputProps> = ({ setSubmittedURL }) => {
  const [youtubeURL, setYoutubeURL] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row items-center justify-center  gap-4">
      <Input
        type="text"
        placeholder={CONST_PLACEHOLDER_URL}
        value={youtubeURL}
        onChange={(e) => setYoutubeURL(e.target.value)}
        className="w-[500px] border-gray-300 dark:border-gray-700"
      />
      <Button
        onClick={() =>
          setSubmittedURL(
            youtubeURL.trim().length === 0 ? CONST_PLACEHOLDER_URL : youtubeURL
          )
        }
        className="cursor-pointer"
      >
        Send Video
      </Button>
    </div>
  );
};

export default VideoURLInput;
