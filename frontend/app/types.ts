export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  conversation_id: number;
  created_at?: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}
