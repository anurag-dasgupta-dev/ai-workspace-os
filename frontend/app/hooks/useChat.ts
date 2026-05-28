"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "../types";
import { fetchMessages, sendMessage } from "../utils/api";

export function useChat(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId === null) {
      setMessages([]);
      return;
    }
    fetchMessages(conversationId)
      .then(setMessages)
      .catch((err) => console.error("Failed to load messages", err));
  }, [conversationId]);

  const send = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim() || conversationId === null) return;

      // Optimistic user bubble — use a temp negative id so it won't clash
      const tempId = -Date.now();
      setMessages((prev) => [
        ...prev,
        { id: tempId, role: "user", content: text, conversation_id: conversationId },
      ]);
      setLoading(true);

      try {
        const data = await sendMessage(text, conversationId);
        // Replace optimistic message + add AI response with real data
        const aiMsg: Message = {
          id: tempId - 1,
          role: "ai",
          content: data.response,
          conversation_id: conversationId,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("Failed to send message", err);
        // Remove optimistic bubble on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  return { messages, loading, send };
}
