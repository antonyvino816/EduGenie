import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, Form, Header, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import core EduGenie AI modules
from qna import answer_question
from explanation_module import explain_concept
from quiz_module import generate_quiz
from summary_module import summarize_text
from learning_path import get_learning_recommendations
from gemini_client import is_api_configured, set_api_key, get_api_key

# Import Database & Study Data
import database
from study_data import STUDY_NOTES, INDIABIX_PRACTICE_QUESTIONS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edugenie.main")

# Initialize FastAPI app
app = FastAPI(
    title="EduGenie: Google Gemini Powered Learning Assistant",
    description="A lightweight AI-powered educational assistant that simplifies learning through generative AI.",
    version="2.1.0"
)

# Enable CORS for Live Server (port 5500) and any local development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure directories exist
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = BASE_DIR  # index.html lives in the project root
STATIC_DIR = os.path.join(BASE_DIR, "static")

os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

# Mount static files and templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


# --- Request Schemas ---
class SignUpRequest(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = ""
    email: Optional[str] = ""

class LoginRequest(BaseModel):
    username: str
    password: str

class QnARequest(BaseModel):
    question: str
    context: Optional[str] = None
    api_key: Optional[str] = None

class ExplainRequest(BaseModel):
    concept: str
    level: Optional[str] = "beginner"
    api_key: Optional[str] = None

class QuizRequest(BaseModel):
    topic: str
    api_key: Optional[str] = None

class SummaryRequest(BaseModel):
    text: str
    api_key: Optional[str] = None

class LearningPathRequest(BaseModel):
    topic: str
    level: Optional[str] = "Beginner"
    api_key: Optional[str] = None

class ApiKeyRequest(BaseModel):
    api_key: str


# --- Helper to extract API Key ---
def resolve_api_key(body_key: Optional[str], x_gemini_key: Optional[str] = None) -> Optional[str]:
    if body_key and body_key.strip():
        return body_key.strip()
    if x_gemini_key and x_gemini_key.strip():
        return x_gemini_key.strip()
    return None


# --- Web Frontend Route ---
@app.get("/", response_class=HTMLResponse)
async def serve_home(request: Request):
    """Renders the main EduGenie dynamic educational platform."""
    api_ready = is_api_configured()
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"api_ready": api_ready}
    )


# --- Authentication Endpoints ---
@app.post("/api/auth/signup")
async def handle_signup(payload: SignUpRequest):
    """Registers a new learner in EduGenie."""
    res = database.create_user(
        username=payload.username,
        password=payload.password,
        full_name=payload.full_name or "",
        email=payload.email or ""
    )
    if not res.get("success"):
        return JSONResponse(status_code=400, content=res)
    return res


@app.post("/api/auth/login")
async def handle_login(payload: LoginRequest):
    """Authenticates an existing learner."""
    res = database.authenticate_user(
        username_or_email=payload.username,
        password=payload.password
    )
    if not res.get("success"):
        return JSONResponse(status_code=401, content=res)
    return res


@app.get("/api/auth/me")
async def get_current_user(username: str = Query(...)):
    """Retrieves profile info for the user."""
    user = database.get_user_by_username(username)
    if not user:
        return JSONResponse(status_code=404, content={"success": False, "message": "User not found"})
    return {"success": True, "user": user}


# --- Study Notes Endpoints ---
@app.get("/api/notes")
async def list_note_topics():
    """Lists available pre-curated topics."""
    topics = []
    for key, data in STUDY_NOTES.items():
        topics.append({
            "key": key,
            "title": data["title"],
            "tagline": data["tagline"],
            "badge": data["badge"],
            "icon": data["icon"]
        })
    return {"topics": topics}


@app.get("/api/notes/{topic}")
async def get_topic_notes(topic: str, x_gemini_key: Optional[str] = Header(None)):
    """Retrieves notes for a specific topic, with AI fallback for unknown topics."""
    key = topic.strip().lower()
    if key in STUDY_NOTES:
        return {"success": True, "source": "curated", "topic": key, "notes": STUDY_NOTES[key]}

    # Fallback to AI generation via Gemini
    try:
        explanation = explain_concept(concept=topic, level="beginner", api_key=x_gemini_key)
        custom_notes = {
            "title": f"{topic.capitalize()} Notes",
            "tagline": f"AI Generated Summary for {topic.capitalize()}",
            "badge": "AI Generated",
            "icon": "🤖",
            "overview": explanation.get("simple_definition") or explanation.get("summary", ""),
            "key_concepts": [
                {
                    "title": "Everyday Analogy",
                    "desc": explanation.get("everyday_analogy", "Learn complex topics with intuitive real-world metaphors.")
                },
                {
                    "title": "Key Details",
                    "desc": explanation.get("technical_clarity") or explanation.get("simple_definition", "")
                },
                {
                    "title": "Real-World Application",
                    "desc": explanation.get("real_world_application", "Applied in modern software engineering.")
                }
            ],
            "code_example": {
                "title": f"{topic.capitalize()} Overview",
                "code": explanation.get("code_or_example", f"# Reference notes for {topic}\n# Auto-generated by EduGenie AI")
            },
            "cheat_sheet": explanation.get("key_takeaways", [
                f"Core fundamentals of {topic}",
                "Review definitions and practice questions to master this topic."
            ])
        }
        return {"success": True, "source": "ai", "topic": key, "notes": custom_notes}
    except Exception as e:
        logger.error(f"Error generating notes for {topic}: {e}")
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": f"Notes for '{topic}' are not available yet."}
        )


# --- IndiaBix Practice Questions Endpoints ---
@app.get("/api/practice/{topic}")
async def get_practice_questions(topic: str, x_gemini_key: Optional[str] = Header(None)):
    """Retrieves IndiaBix-style MCQs with 4 options and detailed explanations."""
    key = topic.strip().lower()
    if key in INDIABIX_PRACTICE_QUESTIONS:
        return {
            "success": True,
            "topic": key,
            "title": STUDY_NOTES.get(key, {}).get("title", f"{key.upper()} Practice"),
            "questions": INDIABIX_PRACTICE_QUESTIONS[key]
        }

    # Dynamic fallback: Generate using Gemini Quiz module
    try:
        quiz_res = generate_quiz(topic_or_passage=topic, api_key=x_gemini_key)
        raw_mcqs = quiz_res.get("mcqs", [])
        formatted_questions = []
        for i, q in enumerate(raw_mcqs):
            opts = q.get("options", [])
            corr_ans = q.get("correct_answer", "")
            corr_idx = 0
            for idx, opt in enumerate(opts):
                if opt.strip().lower() == corr_ans.strip().lower() or opt.strip().startswith(corr_ans):
                    corr_idx = idx
                    break
            formatted_questions.append({
                "id": i + 1,
                "question": q.get("question", ""),
                "options": opts,
                "correct": corr_idx,
                "explanation": q.get("explanation", f"The correct answer is {opts[corr_idx] if opts else corr_ans}.")
            })
        return {
            "success": True,
            "topic": key,
            "title": f"{topic.capitalize()} Practice Drills",
            "questions": formatted_questions
        }
    except Exception as e:
        logger.error(f"Error fetching practice questions for {topic}: {e}")
        return JSONResponse(status_code=404, content={"success": False, "message": "Practice questions unavailable."})


# --- System & API Key Status Endpoints ---
@app.get("/api/status")
async def get_system_status(x_gemini_key: Optional[str] = Header(None)):
    """Checks whether the Gemini API key is configured."""
    active = is_api_configured(x_gemini_key)
    return {
        "status": "online",
        "api_configured": active,
        "active_model": "Gemini 1.5 Pro / Flash",
        "message": "EduGenie is ready to assist your learning!"
    }


@app.post("/api/set-key")
async def configure_api_key(payload: ApiKeyRequest):
    """Allows user to update the Gemini API key directly from UI."""
    key = payload.api_key.strip()
    if not key:
        return JSONResponse(status_code=400, content={"error": "API Key cannot be empty."})
    success = set_api_key(key)
    return {
        "status": "success" if success else "warning",
        "message": "Gemini API Key updated successfully!",
        "api_configured": True
    }


async def parse_request_data(request: Request) -> Dict[str, Any]:
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            return await request.json()
        except Exception:
            return {}
    else:
        try:
            form = await request.form()
            return dict(form)
        except Exception:
            return {}


# --- Activity 2.1.2: QnA Endpoint ---
@app.post("/qa")
@app.post("/qna")
async def handle_qna(request: Request, x_gemini_key: Optional[str] = Header(None)):
    data = await parse_request_data(request)
    q = data.get("question")
    ctx = data.get("context")
    key = resolve_api_key(data.get("api_key"), x_gemini_key)

    if not q:
        return JSONResponse(status_code=400, content={"error": "Question is required."})

    result = answer_question(question=q, context=ctx, api_key=key)
    return result


# --- Activity 2.1.1: Concept Explanation Endpoint ---
@app.post("/explain")
async def handle_explain(request: Request, x_gemini_key: Optional[str] = Header(None)):
    data = await parse_request_data(request)
    c = data.get("concept")
    lvl = data.get("level", "beginner") or "beginner"
    key = resolve_api_key(data.get("api_key"), x_gemini_key)

    if not c:
        return JSONResponse(status_code=400, content={"error": "Concept is required."})

    result = explain_concept(concept=c, level=lvl, api_key=key)
    return result


# --- Activity 2.1.3: Quiz Generation Endpoint ---
@app.post("/quiz")
async def handle_quiz(request: Request, x_gemini_key: Optional[str] = Header(None)):
    data = await parse_request_data(request)
    t = data.get("topic")
    key = resolve_api_key(data.get("api_key"), x_gemini_key)

    if not t:
        return JSONResponse(status_code=400, content={"error": "Topic or passage is required."})

    result = generate_quiz(topic_or_passage=t, api_key=key)
    return result


# --- Activity 2.1.4: Summary Endpoint ---
@app.post("/summarize")
async def handle_summary(request: Request, x_gemini_key: Optional[str] = Header(None)):
    data = await parse_request_data(request)
    txt = data.get("text")
    key = resolve_api_key(data.get("api_key"), x_gemini_key)

    if not txt:
        return JSONResponse(status_code=400, content={"error": "Text is required."})

    result = summarize_text(text=txt, api_key=key)
    return result


# --- Activity 2.1.5: Learning Path Recommendations Endpoint ---
@app.post("/learn/recommendations")
@app.post("/learning_path")
async def handle_learning_path(request: Request, x_gemini_key: Optional[str] = Header(None)):
    data = await parse_request_data(request)
    t = data.get("topic")
    lvl = data.get("level", "Beginner") or "Beginner"
    key = resolve_api_key(data.get("api_key"), x_gemini_key)

    if not t:
        return JSONResponse(status_code=400, content={"error": "Topic is required."})

    result = get_learning_recommendations(topic=t, current_level=lvl, api_key=key)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)