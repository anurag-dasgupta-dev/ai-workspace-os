import { ChatItem } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatItem[];
  onRegenerate?: () => void;
  loading?: boolean;
}

export default function MessageList({ messages, onRegenerate, loading }: Props) {
  const lastAiId = messages.slice().reverse().find((m) => m.role === "ai")?.id;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isLastAi={msg.id === lastAiId}
          onRegenerate={onRegenerate}
          loading={loading}
        />
      ))}
    </div>
  );
}
