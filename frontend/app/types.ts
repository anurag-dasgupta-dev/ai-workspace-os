export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  conversation_id: number;
  created_at?: string;
}

// Frontend-only — not persisted to SQLite (Phase 1).
// Lives in React state for the duration of the session.
export interface DocumentMessage {
  id: number;
  role: "document";
  filename: string;
  conversation_id: number;
  pageCount?: number;
  charCount?: number;
}

// Union of all items that can appear in the chat timeline.
export type ChatItem = Message | DocumentMessage;

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}
