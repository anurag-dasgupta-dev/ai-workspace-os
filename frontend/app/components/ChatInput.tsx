import PdfUploadButton from "./PdfUploadButton";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  onPdfExtracted?: (text: string, filename: string, pageCount: number) => void;
}

export default function ChatInput({ value, onChange, onSend, disabled, onPdfExtracted }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-6 border-t border-gray-800 flex gap-4">
      <textarea
        placeholder="Type your message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        className="flex-1 p-4 rounded-xl bg-gray-900 text-white border border-gray-700 resize-none"
      />
      <div className="flex flex-col gap-2">
        <button
          onClick={onSend}
          disabled={disabled}
          className="flex-1 bg-white text-black px-6 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
        {onPdfExtracted && (
          <PdfUploadButton onExtracted={onPdfExtracted} disabled={disabled} />
        )}
      </div>
    </div>
  );
}
