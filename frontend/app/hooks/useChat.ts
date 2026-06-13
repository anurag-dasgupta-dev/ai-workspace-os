"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatItem, Message } from "../types";
import { fetchMessages, streamMessage } from "../utils/api";

export function useChat(conversationId: number | null, documentText: string | null = null) {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (conversationId === null) return;
    fetchMessages(conversationId)
      .then(setMessages)
      .catch((err) => console.error("Failed to load messages", err));
  }, [conversationId]);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // MVP limitation: reuses POST /chat/stream, which causes the backend to persist a
  // duplicate user message on every regenerate. A future /chat/regenerate endpoint
  // should stream from the previous user message without creating another user row.
  const regenerate = useCallback(async (): Promise<void> => {
    if (loading || conversationId === null) return;

    // Find the last AI message first, then search backwards from that position
    // for its paired user message. This correctly handles consecutive AI messages
    // or document cards between user and AI turns.
    const lastAiMsg = messages.slice().reverse().find(
      (m): m is Message => m.role === "ai"
    );
    if (!lastAiMsg) return;

    const lastAiIndex = messages.findIndex((m) => m.id === lastAiMsg.id);
    const lastUserMsg = messages
      .slice(0, lastAiIndex)
      .reverse()
      .find((m): m is Message => m.role === "user");
    if (!lastUserMsg) return;

    const tempAiId = -Date.now();
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== lastAiMsg.id),
      { id: tempAiId, role: "ai", content: "Thinking...", conversation_id: conversationId },
    ]);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulated = "";
    let firstToken = true;

    try {
      await streamMessage(
        lastUserMsg.content,
        conversationId,
        documentText ?? undefined,
        (token) => {
          if (firstToken) { accumulated = token; firstToken = false; }
          else accumulated += token;
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiId
                ? { ...(msg as Message), content: snapshot }
                : msg
            )
          );
        },
        controller.signal
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Regenerate failed", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempAiId));
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [loading, conversationId, documentText, messages]);

  const send = useCallback(
    async (text: string): Promise<void> => {
      if (!text.trim() || conversationId === null) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Optimistic user bubble — use a temp negative id so it won't clash
      const tempUserId = -Date.now();
      const tempAiId = tempUserId - 1;

      setMessages((prev) => [
        ...prev,
        { id: tempUserId, role: "user", content: text, conversation_id: conversationId },
        { id: tempAiId, role: "ai", content: "Thinking...", conversation_id: conversationId },
      ]);
      setLoading(true);

      let accumulated = "";
      let firstToken = true;

      try {
        await streamMessage(text, conversationId, documentText ?? undefined, (token) => {
          if (firstToken) {
            accumulated = token;
            firstToken = false;
          } else {
            accumulated += token;
          }
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiId
                ? { ...(msg as Message), content: snapshot }
                : msg
            )
          );
        }, controller.signal);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // User stopped generation — partial content stays visible, no error shown
          return;
        }
        console.error("Failed to send message", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserId && m.id !== tempAiId));
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, documentText]
  );

  const insertDocument = useCallback(
    (filename: string, pageCount?: number, charCount?: number) => {
      if (conversationId === null) return;
      setMessages((prev) => [
        ...prev,
        {
          id: -Date.now(),
          role: "document" as const,
          filename,
          conversation_id: conversationId,
          pageCount,
          charCount,
        },
      ]);
    },
    [conversationId]
  );

  return { messages: conversationId === null ? [] : messages, loading, send, stop, regenerate, insertDocument };
}
