import os
import json
import logging
from typing import Optional, Any

from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("edugenie.gemini")

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_runtime_key: Optional[str] = None


def get_api_key(override: Optional[str] = None) -> Optional[str]:
    """Returns the Gemini API key: request override > UI-set key > environment."""
    return (override or _runtime_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or None)


def set_api_key(key: str) -> bool:
    global _runtime_key
    _runtime_key = key.strip() or None
    return _runtime_key is not None


def is_api_configured(override: Optional[str] = None) -> bool:
    return bool(get_api_key(override))


def generate_text(prompt: str, api_key: Optional[str] = None) -> Optional[str]:
    """Calls Gemini and returns the text response, or None if unavailable."""
    key = get_api_key(api_key)
    if not key:
        return None
    try:
        from google import genai
        client = genai.Client(api_key=key)
        resp = client.models.generate_content(model=MODEL_NAME, contents=prompt)
        return resp.text
    except Exception as e:
        logger.error(f"Gemini request failed: {e}")
        return None


def generate_json(prompt: str, api_key: Optional[str] = None) -> Optional[Any]:
    """Calls Gemini asking for JSON output and parses it, or None on failure."""
    text = generate_text(prompt + "\n\nRespond with valid JSON only, no markdown fences.", api_key)
    if not text:
        return None
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned[cleaned.find("\n") + 1:] if "\n" in cleaned else cleaned
    try:
        return json.loads(cleaned)
    except Exception:
        start, end = cleaned.find("{"), cleaned.rfind("}")
        if start != -1 and end != -1:
            try:
                return json.loads(cleaned[start:end + 1])
            except Exception:
                pass
    logger.error("Could not parse Gemini JSON response")
    return None
