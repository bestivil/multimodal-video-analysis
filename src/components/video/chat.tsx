import { useRef, useEffect } from "react";
import localforage from "localforage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useChatManager,
  ProcessedChatMessage,
} from "@/app/hooks/useChatManager";
import { Breakdown as BreakdownContentType } from "@/app/hooks/useBreakdown";
import { formatTime } from "@/lib/utils";
import { TranscriptResponse } from "@/app/constants";

type ChatProps = {
  url: string;
  transcript: TranscriptResponse[] | undefined;
  breakdown: BreakdownContentType[] | undefined;
  setTimestamp: (timestamp: number) => void;
  onSeek: (timestamp: number) => void;
  videoEndTime: number;
};

const Chat: React.FC<ChatProps> = ({
  url,
  transcript,
  breakdown,
  setTimestamp,
  onSeek,
  videoEndTime,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSend, handleKeyDown, loading } =
    useChatManager({
      url,
      transcript: transcript?.map((item) => item.text).join(" \n\n"),
      breakdown: breakdown?.map((item) => item.summary).join(" \n\n"),
      videoEndTime,
    });

  console.log(messages);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (url) {
      (async () => {
        try {
          const record =
            (await localforage.getItem<{
              chat: ProcessedChatMessage[];
            }>(url)) || {};
          record.chat = messages;
          await localforage.setItem(url, record);
        } catch (error) {
          console.error("Failed to save chat for recent videos:", error);
        }
      })();
    }
  }, [url, messages]);

  return (
    <div className="w-full max-w-2xl flex flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] border rounded"
      >
        {messages.map((msg: ProcessedChatMessage, idx) => {
          const isUser = msg.sender === "user";
          const bubbleClasses = isUser
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-800";
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`p-4 rounded-lg max-w-[75%] ${bubbleClasses}`}>
                <p>{msg.content}</p>
                {!isUser && msg.sections && (
                  <ul className="mt-2 space-y-2 list-none">
                    {msg.sections.map((section) => (
                      <li
                        key={section.startTimestamp}
                        className="bg-gray-300 p-2 rounded hover:cursor-pointer"
                        onClick={() => {
                          setTimestamp(section.startTimestamp);
                          if (onSeek) {
                            onSeek(section.startTimestamp);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            className="min-w-[48px] text-xs text-gray-600"
                          >
                            {formatTime(section.startTimestamp)}
                          </Button>
                          <span className="font-semibold">{section.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-14">
                          {section.summary}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-4 rounded-lg max-w-[75%]">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex mt-4 gap-2"
      >
        <Input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;
