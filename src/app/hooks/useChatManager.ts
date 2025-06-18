import { useState, useEffect, KeyboardEvent } from "react";
import { ChatMessage, useChat, ChatResponse } from "./useChat";

export type Section = ChatResponse["sections"][0];

export interface ProcessedChatMessage extends ChatMessage {
  sections?: Section[];
}

type UseChatManagerProps = {
  url: string;
  transcript: string | undefined;
  breakdown: string | undefined;
  videoEndTime: number;
};

export function useChatManager({
  url,
  transcript,
  breakdown,
  videoEndTime,
}: UseChatManagerProps) {
  const [messages, setMessages] = useState<ProcessedChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const {
    data: rawResponse,
    loading,
    refetch,
  } = useChat({
    prompt: currentPrompt,
    url,
    transcript,
    breakdown,
    history: messages,
    videoEndTime,
  });

  useEffect(() => {
    if (pending) {
      refetch();
    }
  }, [pending, refetch]);

  useEffect(() => {
    if (pending && !loading && rawResponse) {
      let content: string;
      let sections: Section[] | undefined;
      if (typeof rawResponse === "object" && "response" in rawResponse) {
        content = rawResponse.response;
        sections = rawResponse.sections;
      } else if (typeof rawResponse === "object") {
        content = JSON.stringify(rawResponse);
      } else {
        content = rawResponse as string;
      }

      setMessages((prev) => {
        const newPrev = [...prev];
        const last = newPrev[newPrev.length - 1];
        if (last?.sender === "assistant" && last.content === "...") {
          newPrev[newPrev.length - 1] = {
            sender: "assistant",
            content,
            sections,
          };
        } else {
          newPrev.push({ sender: "assistant", content, sections });
        }
        return newPrev;
      });
      setCurrentPrompt("");
      setPending(false);
    }
  }, [rawResponse, loading, pending]);

  const handleSend = () => {
    if (!input.trim()) return;
    setPending(true);
    const trimmed = input.trim();
    setCurrentPrompt(trimmed);
    setMessages((prev) => [...prev, { sender: "user", content: trimmed }]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return { messages, input, setInput, handleSend, handleKeyDown, loading };
}
