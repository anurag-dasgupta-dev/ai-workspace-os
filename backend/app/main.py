from fastapi import FastAPI
from pydantic import BaseModel

from app.services.ollama_service import generate_response

app = FastAPI()

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