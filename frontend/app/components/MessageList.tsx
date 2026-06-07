import { ChatItem } from "../types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatItem[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
