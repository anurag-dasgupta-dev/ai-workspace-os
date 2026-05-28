from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import conversation_service, chat_service

router = APIRouter(prefix="/conversations", tags=["conversations"])


class CreateRequest(BaseModel):
    title: str = "New Chat"


class UpdateTitleRequest(BaseModel):
    title: str


@router.get("/")
def list_conversations():
    return conversation_service.get_conversations()


@router.post("/")
def create_conversation(req: CreateRequest):
    return conversation_service.create_conversation(req.title)


@router.get("/{conv_id}")
def get_conversation(conv_id: int):
    conv = conversation_service.get_conversation(conv_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.patch("/{conv_id}/title")
def update_title(conv_id: int, req: UpdateTitleRequest):
    conv = conversation_service.update_title(conv_id, req.title)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


@router.delete("/{conv_id}")
def delete_conversation(conv_id: int):
    deleted = conversation_service.delete_conversation(conv_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"ok": True}


@router.get("/{conv_id}/messages")
def get_messages(conv_id: int):
    return chat_service.get_messages(conv_id)
