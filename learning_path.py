from typing import Dict, Any, Optional
from gemini_client import generate_text


def get_learning_recommendations(topic: str, current_level: str = "Beginner", api_key: Optional[str] = None) -> Dict[str, Any]:
    prompt = (
        f"Create a step-by-step learning path in markdown for a {current_level} learner who wants to master "
        f"'{topic}'. Include weekly milestones, what to practice each week, and free resources."
    )
    plan = generate_text(prompt, api_key)
    if plan:
        return {"topic": topic, "level": current_level, "answer": plan, "source": "gemini"}
    return {
        "topic": topic,
        "level": current_level,
        "source": "offline",
        "answer": (
            f"## Learning path: {topic} ({current_level})\n\n"
            "1. **Week 1 – Foundations:** learn core terminology and basics.\n"
            "2. **Week 2 – Practice:** solve small exercises daily.\n"
            "3. **Week 3 – Projects:** build a mini project applying the concepts.\n"
            "4. **Week 4 – Review:** revise, take quizzes, fill gaps.\n\n"
            "_Add a Gemini API key for a personalized, detailed roadmap._"
        ),
    }
