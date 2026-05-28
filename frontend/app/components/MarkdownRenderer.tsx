"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { Components } from "react-markdown";
import type { CSSProperties } from "react";

interface Props {
  content: string;
}

const components: Components = {
  // Strip the <pre> wrapper — our code handler owns block rendering entirely.
  // Without this, SyntaxHighlighter ends up nested inside a bare <pre>.
  pre({ children }) {
    return <>{children}</>;
  },

  // Handles both fenced code blocks and inline code.
  // react-markdown v9+ removed the `inline` prop; we detect block code by:
  //   1. a language-* className (fenced block with language tag), OR
  //   2. a newline in the content (fenced block without language tag)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ className, children }: any) {
    const language = /language-(\w+)/.exec(className ?? "")?.[1];
    const codeString = String(children).replace(/\n$/, "");
    const isBlock = Boolean(language) || codeString.includes("\n");

    if (isBlock) {
      return (
        <div className="my-3 rounded-lg overflow-hidden text-sm">
          {language && (
            <div className="bg-gray-700 px-4 py-1.5 text-xs text-gray-400 font-mono select-none">
              {language}
            </div>
          )}
          <SyntaxHighlighter
            language={language ?? "text"}
            style={oneDark}
            PreTag="div"
            customStyle={
              {
                margin: 0,
                borderRadius: 0,
                background: "#1e1e2e",
                fontSize: "0.8125rem",
                padding: "1rem",
              } as CSSProperties
            }
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code className="bg-gray-700 text-pink-300 rounded px-1.5 py-0.5 text-[0.8em] font-mono">
        {children}
      </code>
    );
  },

  // Headings
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-5 mb-3 text-white">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-4 mb-2 text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-3 mb-1 text-gray-100">{children}</h3>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className="leading-relaxed mb-3 last:mb-0">{children}</p>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-gray-500 pl-4 my-3 text-gray-400 italic">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => <hr className="border-gray-700 my-4" />,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
    >
      {children}
    </a>
  ),

  // Bold / italic
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-300">{children}</em>,

  // Tables (GFM)
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-700">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-gray-200 border border-gray-600">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border border-gray-700 text-gray-300">{children}</td>
  ),
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="text-gray-200 text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
