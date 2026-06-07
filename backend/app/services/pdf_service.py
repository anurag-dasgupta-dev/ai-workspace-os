import io
from fastapi import UploadFile
from pypdf import PdfReader


async def extract_text(file: UploadFile) -> tuple[str, int]:
    """Read an uploaded PDF and return (extracted_text, page_count).

    Raises ValueError if no text could be extracted (scanned/image-only PDF).
    """
    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))

    pages: list[str] = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())

    if not pages:
        raise ValueError(
            "No extractable text found. The PDF may be scanned or image-based."
        )

    return "\n\n".join(pages), len(reader.pages)
