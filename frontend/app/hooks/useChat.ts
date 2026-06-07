"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "../types";
import { fetchMessages, sendMessage } from "../utils/api";

export function useChat(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId === null) return;
    fetchMessages(conversationId)
      .then(setMessages)
      .catch((err) => console.error("Failed to load messages", err));
  }, [conversationId]);

  const send = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim() || conversationId === null) return;

      // Optimistic user bubble — use a temp negative id so it won't clash
      const tempUserId = -Date.now();
      const tempAiId = tempUserId - 1;

      setMessages((prev) => [
        ...prev,
        { id: tempUserId, role: "user", content: text, conversation_id: conversationId },
        { id: tempAiId, role: "ai", content: "Thinking...", conversation_id: conversationId },
      ]);
      setLoading(true);

      try {
        const data = await sendMessage(text, conversationId);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAiId ? { ...msg, content: data.response } : msg
          )
        );
      } catch (err) {
        console.error("Failed to send message", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserId && m.id !== tempAiId));
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  return { messages: conversationId === null ? [] : messages, loading, send };
}
