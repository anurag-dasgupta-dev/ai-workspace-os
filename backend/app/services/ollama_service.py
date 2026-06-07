import requests
from typing import Optional

OLLAMA_URL = "http://localhost:11434/api/generate"
MAX_DOCUMENT_CHARS = 50_000


def generate_response(message: str, document_text: Optional[str] = None) -> str:
    if document_text:
        truncated = document_text[:MAX_DOCUMENT_CHARS]
        prompt = f"Document:\n{truncated}\n\nQuestion:\n{message}"
    else:
        prompt = message

    response = requests.post(
        OLLAMA_URL,
        json={"model": "qwen2.5:7b", "prompt": prompt, "stream": False},
    )

    data = response.json()
    return data.get("response", "Error: No response from Ollama")