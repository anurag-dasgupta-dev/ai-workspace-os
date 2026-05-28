import { Message } from "../types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div
      className={`max-w-2xl p-4 rounded-xl ${
        isUser ? "bg-blue-600 ml-auto" : "bg-gray-800"
      }`}
    >
      <p className="text-sm opacity-70 mb-1">{isUser ? "You" : "AI"}</p>
      <p>{message.content}</p>
    </div>
  );
}
