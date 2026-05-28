import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_response(prompt: str):
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen2.5:7b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    print(data)

    return data.get("response", "Error: No response from Ollama")