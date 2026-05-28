"use client";

import { Conversation } from "../types";

interface Props {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <aside className="w-60 flex-shrink-0 bg-gray-900 flex flex-col h-full border-r border-gray-800">
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-200 text-sm transition-colors"
        >
          <span className="text-base leading-none">+</span>
          New Chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-gray-600 text-xs text-center mt-6">
            No chats yet
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              activeId === conv.id
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <span className="text-sm truncate flex-1 min-w-0">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0 p-0.5 text-gray-500 hover:text-red-400 transition-all text-xs"
              aria-label="Delete chat"
            >
              ✕
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
