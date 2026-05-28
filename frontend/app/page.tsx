"use client";

import { useEffect, useState } from "react";
import { Message } from "./types";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/messages");

      const data = await res.json();

      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
    ]);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.response },
      ]);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <MessageList
        messages={messages}
        loading={loading}
      />

      <ChatInput
        value={message}
        onChange={setMessage}
        onSend={sendMessage}
        disabled={loading}
      />
    </main>
  );
}