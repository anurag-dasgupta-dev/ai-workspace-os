from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database import init_db
from app.services import chat_service, conversation_service
from app.services.ollama_service import generate_response
from app.routes.conversations import router as conversations_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations_router)

init_db()


class ChatRequest(BaseModel):
    message: str
    conversation_id: int


@app.post("/chat")
def chat(req: ChatRequest):
    chat_service.save_message("user", req.message, req.conversation_id)

    response = generate_response(req.message)

    chat_service.save_message("ai", response, req.conversation_id)
    conversation_service.touch(req.conversation_id)

    # Auto-title the conversation from the first user message
    conv = conversation_service.get_conversation(req.conversation_id)
    if conv and conv["title"] == "New Chat":
        title = req.message[:50] + ("..." if len(req.message) > 50 else "")
        conversation_service.update_title(req.conversation_id, title)

    return {"response": response}
