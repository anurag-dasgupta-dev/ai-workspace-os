const API_BASE = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export function fetchConversations() {
  return request<import("../types").Conversation[]>("/conversations/");
}

export function createConversation(title = "New Chat") {
  return request<import("../types").Conversation>("/conversations/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export function deleteConversation(id: number) {
  return request<{ ok: boolean }>(`/conversations/${id}`, { method: "DELETE" });
}

export function fetchMessages(conversationId: number) {
  return request<import("../types").Message[]>(
    `/conversations/${conversationId}/messages`
  );
}

export function sendMessage(
  message: string,
  conversationId: number,
  documentText?: string
) {
  return request<{ response: string }>("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      ...(documentText ? { document_text: documentText } : {}),
    }),
  });
}

export async function streamMessage(
  message: string,
  conversationId: number,
  documentText: string | undefined,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      ...(documentText ? { document_text: documentText } : {}),
    }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
}

export async function uploadPdf(
  file: File
): Promise<{ filename: string; text: string; page_count: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload/pdf`, {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type — the browser sets it automatically with the
    // multipart boundary when using FormData.
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }

  return res.json();
}
