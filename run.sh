#!/bin/bash
# Sets up the virtualenv (first run only) and starts EduGenie at http://127.0.0.1:8000
cd "$(dirname "$0")"
if [ ! -d .venv ]; then
  python3 -m venv .venv
  .venv/bin/pip install fastapi "uvicorn[standard]" jinja2 python-dotenv python-multipart google-genai
fi
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload
