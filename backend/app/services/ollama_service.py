import json
import requests
from typing import Generator, Optional

OLLAMA_URL = "http://localhost:11434/api/generate"
MAX_DOCUMENT_CHARS = 50_000


def build_prompt(message: str, document_text: Optional[str] = None) -> str:
    if document_text:
        truncated = document_text[:MAX_DOCUMENT_CHARS]
        return f"Document:\n{truncated}\n\nQuestion:\n{message}"
    return message


def generate_response(message: str, document_text: Optional[str] = None) -> str:
    response = requests.post(
        OLLAMA_URL,
        json={"model": "qwen2.5:7b", "prompt": build_prompt(message, document_text), "stream": False},
    )
    data = response.json()
    return data.get("response", "Error: No response from Ollama")


def generate_stream(message: str, document_text: Optional[str] = None) -> Generator[str, None, None]:
    with requests.post(
        OLLAMA_URL,
        json={"model": "qwen2.5:7b", "prompt": build_prompt(message, document_text), "stream": True},
        stream=True,
    ) as response:
        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue
            try:
                chunk = json.loads(line)
                token = chunk.get("response", "")
                if token:
                    yield token
                if chunk.get("done"):
                    break
            except json.JSONDecodeError:
                continue