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
  const { conversations, activeId, setActiveId, createNew, remove, refreshTitles } =
    useConversations();
  const { messages, loading, send } = useChat(activeId);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || activeId === null) return;
    setInput("");
    await send(text);
    refreshTitles();
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
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={loading || activeId === null}
          />
        </main>
      </div>
    </div>
  );
}
