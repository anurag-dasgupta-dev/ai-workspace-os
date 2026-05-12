"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await res.json();

    setResponse(data.response);
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        AI Workspace OS
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 rounded text-black"
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-6 py-3 rounded"
        >
          Send
        </button>
      </div>

      <div className="bg-gray-900 p-6 rounded">
        <h2 className="text-2xl mb-4">AI Response</h2>

        <p>{response}</p>
      </div>
    </main>
  );
}