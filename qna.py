from typing import Optional, Dict, Any
from gemini_client import generate_text


def answer_question(question: str, context: Optional[str] = None, api_key: Optional[str] = None) -> Dict[str, Any]:
    prompt = (
        "You are EduGenie, a friendly tutor. Answer the student's question clearly in markdown, "
        "with a short explanation and an example where helpful.\n\n"
    )
    if context:
        prompt += f"Use this context:\n{context}\n\n"
    prompt += f"Question: {question}"

    answer = generate_text(prompt, api_key)
    if answer:
        return {"question": question, "answer": answer, "source": "gemini"}
    return {
        "question": question,
        "answer": (
            f"### {question}\n\n"
            "EduGenie is running in **offline mode** (no Gemini API key configured), so a live AI answer "
            "isn't available.\n\n- Click the key icon to add your Gemini API key, or set `GEMINI_API_KEY` in a `.env` file.\n"
            "- Meanwhile, explore the curated **Study Notes** and **Practice** sections."
        ),
        "source": "offline",
    }
