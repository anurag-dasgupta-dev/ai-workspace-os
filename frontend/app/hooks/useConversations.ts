"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation } from "../types";
import {
  fetchConversations,
  createConversation,
  deleteConversation,
} from "../utils/api";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
      // Auto-select the most recent conversation on first load
      setActiveId((prev) => (prev === null && data.length > 0 ? data[0].id : prev));
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      try {
        await deleteConversation(id);
        setConversations((prev) => {
          const next = prev.filter((c) => c.id !== id);
          if (activeId === id) {
            setActiveId(next.length > 0 ? next[0].id : null);
          }
          return next;
        });
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    },
    [activeId]
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

  return { conversations, activeId, setActiveId, createNew, remove, refreshTitles };
}
