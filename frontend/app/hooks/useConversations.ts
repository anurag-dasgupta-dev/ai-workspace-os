"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation } from "../types";
import {
  fetchConversations,
  createConversation,
  deleteConversation,
  renameConversation,
} from "../utils/api";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    fetchConversations()
      .then((data) => {
        setConversations(data);
        setActiveId((prev) => (prev === null && data.length > 0 ? data[0].id : prev));
      })
      .catch((err) => console.error("Failed to load conversations", err));
  }, []);

  const createNew = useCallback(async () => {
    try {
      const conv = await createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
      return conv;
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  }, []);

  const remove = useCallback(
    async (id: number) => {
      const previousConversations = conversations;
      const previousActiveId = activeId;

      // Pick the item that was adjacent to the deleted one so the view
      // doesn't jump to the top of the list.
      let nextActiveId = activeId;
      if (activeId === id) {
        const idx = conversations.findIndex((c) => c.id === id);
        const remaining = conversations.filter((c) => c.id !== id);
        nextActiveId = remaining[idx]?.id ?? remaining[idx - 1]?.id ?? null;
      }

      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(nextActiveId);

      try {
        await deleteConversation(id);
      } catch (err) {
        console.error("Failed to delete conversation", err);
        setConversations(previousConversations);
        setActiveId(previousActiveId);
      }
    },
    [activeId, conversations]
  );

  // Refresh titles after auto-title is set by the backend
  const refreshTitles = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to refresh conversations", err);
    }
  }, []);

  const rename = useCallback(async (id: number, title: string) => {
    let previousTitle = "";
    setConversations((prev) => {
      const conv = prev.find((c) => c.id === id);
      if (conv) previousTitle = conv.title;
      return prev.map((c) => (c.id === id ? { ...c, title } : c));
    });
    try {
      await renameConversation(id, title);
    } catch (err) {
      console.error("Failed to rename conversation", err);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: previousTitle } : c))
      );
    }
  }, []);

  return { conversations, activeId, setActiveId, createNew, remove, refreshTitles, rename };
}
