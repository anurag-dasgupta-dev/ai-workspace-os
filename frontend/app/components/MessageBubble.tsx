import { Message } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

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
      <p className="text-xs font-medium opacity-60 mb-2">{isUser ? "You" : "AI"}</p>
      {isUser ? (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      ) : (
        <MarkdownRenderer content={message.content} />
      )}
    </div>
  );
}
