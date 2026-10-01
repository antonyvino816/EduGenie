from typing import Dict, Any, Optional
from gemini_client import generate_json


def generate_quiz(topic_or_passage: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    prompt = (
        "Create 3 multiple-choice questions about the following topic or passage. Return a JSON object "
        'with key "mcqs": a list of objects with "question" (string), "options" (list of 4 strings), '
        '"correct_answer" (string, exactly matching one option), "explanation" (string).\n\n'
        f"Topic/Passage: {topic_or_passage}"
    )
    data = generate_json(prompt, api_key)
    if isinstance(data, dict) and data.get("mcqs"):
        data.update({"topic": topic_or_passage, "source": "gemini"})
        return data
    return {
        "topic": topic_or_passage,
        "source": "offline",
        "message": "Offline mode: configure a Gemini API key to generate quizzes on any topic.",
        "mcqs": [
            {
                "question": "What does EduGenie need to generate custom quizzes?",
                "options": ["A Gemini API key", "A database", "An internet browser only", "Nothing"],
                "correct_answer": "A Gemini API key",
                "explanation": "AI-generated quizzes use Google Gemini, which requires an API key.",
            }
        ],
    }
