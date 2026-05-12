from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from app.services.ollama_service import generate_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "AI Workspace OS Backend Running"}

@app.post("/chat")
def chat(request: ChatRequest):
    response = generate_response(request.message)

    return {
        "response": response
    }