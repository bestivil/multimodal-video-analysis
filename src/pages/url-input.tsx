import { Button } from "@/components/ui/button";

import { CONST_PLACEHOLDER_URL } from "@/app/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function VideoURLInput({
  setSubmittedURL,
}: {
  setSubmittedURL: (url: string) => void;
}) {
  const [youtubeURL, setYoutubeURL] = useState<string>("");

  return (
    <div className="flex flex-row items-center justify-center  gap-4">
      <Input
        type="text"
        placeholder={CONST_PLACEHOLDER_URL}
        value={youtubeURL}
        onChange={(e) => setYoutubeURL(e.target.value)}
        className="w-[500px]"
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
}
