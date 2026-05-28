from app.services.chat_service import save_message, get_messages
from app.database import init_db
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from app.services.ollama_service import generate_response

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/messages")
def messages():
    return get_messages()

@app.post("/chat")
def chat(request: ChatRequest):
    save_message("user", request.message)

    response = generate_response(request.message)

    save_message("ai", response)

    return {
        "response": response
    }