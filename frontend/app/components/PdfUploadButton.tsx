"use client";

import { useRef, useState } from "react";
import { uploadPdf } from "../utils/api";

interface Props {
  onExtracted: (text: string, filename: string, pageCount: number) => void;
  disabled?: boolean;
}

export default function PdfUploadButton({ onExtracted, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadPdf(file);
      onExtracted(result.text, result.filename, result.page_count);
    } catch (err) {
      console.error("PDF upload failed", err);
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected without a page reload.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={disabled || uploading}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        title={uploading ? "Uploading PDF…" : "Upload PDF"}
        className="px-4 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
      >
        {uploading ? "Uploading…" : "Upload PDF"}
      </button>
    </>
  );
}
