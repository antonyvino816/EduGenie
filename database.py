import os
import json
import hashlib
import secrets
import threading
from typing import Optional, Dict, Any, List

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(DATA_DIR, "users.json")
_lock = threading.Lock()

def _load_data() -> Dict[str, Any]:
    if not os.path.exists(USERS_FILE):
        return {"users": []}
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"users": []}

def _save_data(data: Dict[str, Any]) -> bool:
    try:
        tmp_file = USERS_FILE + ".tmp"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        if os.path.exists(USERS_FILE):
            os.replace(tmp_file, USERS_FILE)
        else:
            os.rename(tmp_file, USERS_FILE)
        return True
    except Exception as e:
        # Fallback to direct write
        try:
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            return True
        except Exception:
            return False

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hashes a password with a random salt."""
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return hashed, salt

def init_db():
    """Initializes the database storage and seed default demo user."""
    with _lock:
        data = _load_data()
        if not data.get("users"):
            # Create a default learner for instant testing
            pwd_hash, salt = hash_password("password123")
            data["users"] = [
                {
                    "id": 1,
                    "username": "poornima",
                    "full_name": "Poornima",
                    "email": "poornima@edugenie.local",
                    "password_hash": pwd_hash,
                    "salt": salt,
                    "created_at": "2026-09-30T17:00:00"
                }
            ]
            _save_data(data)

def create_user(username: str, password: str, full_name: str = "", email: str = "") -> Dict[str, Any]:
    """Creates a new user account."""
    username = username.strip().lower()
    full_name = full_name.strip() or username.capitalize()
    email = email.strip().lower() if email else f"{username}@edugenie.local"

    if not username:
        return {"success": False, "message": "Username is required"}
    if not password or len(password) < 3:
        return {"success": False, "message": "Password must be at least 3 characters"}

    with _lock:
        data = _load_data()
        users = data.get("users", [])

        # Check existing username or email
        for u in users:
            if u.get("username") == username:
                return {"success": False, "message": f"Username '{username}' already exists. Please choose another."}
            if email and u.get("email") == email:
                return {"success": False, "message": f"Email '{email}' is already registered."}

        pwd_hash, salt = hash_password(password)
        new_id = len(users) + 1
        user_record = {
            "id": new_id,
            "username": username,
            "full_name": full_name,
            "email": email,
            "password_hash": pwd_hash,
            "salt": salt,
            "created_at": "2026-09-30T17:15:00"
        }
        users.append(user_record)
        data["users"] = users
        _save_data(data)

        return {
            "success": True,
            "message": "Account created successfully! Welcome to EduGenie.",
            "user": {
                "id": new_id,
                "username": username,
                "full_name": full_name,
                "email": email
            }
        }

def authenticate_user(username_or_email: str, password: str) -> Dict[str, Any]:
    """Authenticates a user by username or email."""
    query = username_or_email.strip().lower()
    if not query or not password:
        return {"success": False, "message": "Username and password are required"}

    with _lock:
        data = _load_data()
        users = data.get("users", [])

        matched = None
        for u in users:
            if u.get("username") == query or u.get("email") == query:
                matched = u
                break

        if not matched:
            return {"success": False, "message": "Invalid username or password"}

        stored_hash = matched.get("password_hash")
        salt = matched.get("salt")
        check_hash, _ = hash_password(password, salt)

        if check_hash == stored_hash:
            return {
                "success": True,
                "message": "Login successful!",
                "user": {
                    "id": matched["id"],
                    "username": matched["username"],
                    "full_name": matched.get("full_name", matched["username"]),
                    "email": matched.get("email", "")
                }
            }
        else:
            return {"success": False, "message": "Invalid username or password"}

def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    query = username.strip().lower()
    with _lock:
        data = _load_data()
        for u in data.get("users", []):
            if u.get("username") == query:
                return {
                    "id": u["id"],
                    "username": u["username"],
                    "full_name": u.get("full_name", u["username"]),
                    "email": u.get("email", ""),
                    "created_at": u.get("created_at")
                }
    return None

# Seed on load
init_db()
