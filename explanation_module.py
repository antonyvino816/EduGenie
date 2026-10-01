from typing import Dict, Any, Optional
from gemini_client import generate_json


def explain_concept(concept: str, level: str = "beginner", api_key: Optional[str] = None) -> Dict[str, Any]:
    prompt = (
        f"Explain the concept '{concept}' to a {level} learner. Return a JSON object with keys: "
        '"simple_definition" (string), "everyday_analogy" (string), "technical_clarity" (string), '
        '"real_world_application" (string), "code_or_example" (string), "key_takeaways" (list of 3-5 strings).'
    )
    data = generate_json(prompt, api_key)
    if isinstance(data, dict) and data.get("simple_definition"):
        data.update({"concept": concept, "level": level, "source": "gemini"})
        return data
    return {
        "concept": concept,
        "level": level,
        "source": "offline",
        "simple_definition": f"'{concept}' — a live AI explanation needs a Gemini API key. Add one via the key icon to get a full explanation.",
        "everyday_analogy": "Think of EduGenie offline like a library with the lights off: the books (curated notes) are still there, but the librarian (Gemini) is away.",
        "technical_clarity": "",
        "real_world_application": "",
        "code_or_example": f"# Notes for {concept}\n# Configure GEMINI_API_KEY to generate content",
        "key_takeaways": [
            "Set GEMINI_API_KEY in a .env file or through the UI",
            "Curated notes are available for Java, Python, DBMS, OS, CN and Aptitude",
        ],
    }
