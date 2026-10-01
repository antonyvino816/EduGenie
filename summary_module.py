import re
from typing import Dict, Any, Optional
from gemini_client import generate_text


def summarize_text(text: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    prompt = (
        "Summarize the following study material in markdown: a 2-sentence overview, then high-yield "
        "revision bullet points, then a 'Key Vocabulary' list.\n\n" + text
    )
    summary = generate_text(prompt, api_key)
    if summary:
        return {"summary": summary, "source": "gemini"}

    # Offline extractive fallback: first few sentences as bullets
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    bullets = "\n".join(f"- {s}" for s in sentences[:5])
    return {
        "summary": f"**Offline summary (key sentences):**\n\n{bullets}\n\n_Add a Gemini API key for an AI-generated summary._",
        "source": "offline",
    }
