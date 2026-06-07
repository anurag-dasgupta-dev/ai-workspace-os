from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf_service import extract_text

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="File must be a PDF.")

    try:
        text, page_count = await extract_text(file)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "filename": file.filename,
        "text": text,
        "page_count": page_count,
    }
