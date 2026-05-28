import { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({ messages, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {loading && (
        <div className="bg-gray-800 max-w-2xl p-4 rounded-xl">
          AI is thinking...
        </div>
      )}
    </div>
  );
}
