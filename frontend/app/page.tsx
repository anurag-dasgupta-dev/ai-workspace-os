"use client";

import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { useConversations } from "./hooks/useConversations";
import { useChat } from "./hooks/useChat";

export default function Home() {
  const [input, setInput] = useState("");
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const { conversations, activeId, setActiveId, createNew, remove, refreshTitles } =
    useConversations();
  const { messages, loading, send, insertDocument } = useChat(activeId, documentText);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || activeId === null) return;
    setInput("");
    await send(text);
    refreshTitles();
  };

  const handlePdfExtracted = (text: string, filename: string, pageCount: number) => {
    setDocumentText(text);
    setDocumentName(filename);
    insertDocument(filename, pageCount, text.length);
  };

  const clearDocument = () => {
    setDocumentText(null);
    setDocumentName(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={createNew}
          onDelete={remove}
        />
        <main className="flex flex-col flex-1 overflow-hidden">
          {activeId === null ? (
            <div className="flex flex-1 items-center justify-center text-gray-600 text-sm">
              Create a new chat to get started
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          {documentName && (
            <div className="px-6 py-2 border-t border-gray-800 flex items-center gap-2 bg-gray-900 text-sm text-gray-400">
              <span>📄 Loaded: {documentName}</span>
              <button
                onClick={clearDocument}
                className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                title="Remove document"
              >
                ✕
              </button>
            </div>
          )}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={loading || activeId === null}
            onPdfExtracted={handlePdfExtracted}
          />
        </main>
      </div>
    </div>
  );
}
