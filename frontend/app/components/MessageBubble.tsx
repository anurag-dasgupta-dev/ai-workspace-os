import { ChatItem } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
  message: ChatItem;
}

export default function MessageBubble({ message }: Props) {
  if (message.role === "document") {
    const meta =
      message.pageCount !== undefined
        ? `${message.pageCount} ${message.pageCount === 1 ? "page" : "pages"}`
        : message.charCount !== undefined
        ? `${message.charCount.toLocaleString()} characters`
        : null;

    return (
      <div className="max-w-2xl p-3 rounded-xl bg-gray-800 border border-gray-700 flex items-center gap-3">
        <span className="text-2xl leading-none">📄</span>
        <div>
          <p className="text-sm font-medium text-white leading-snug">{message.filename}</p>
          <p className="text-xs text-gray-400 mt-0.5">PDF Uploaded</p>
          {meta && <p className="text-xs text-gray-500 mt-0.5">{meta}</p>}
        </div>
      </div>
    );
  }

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
