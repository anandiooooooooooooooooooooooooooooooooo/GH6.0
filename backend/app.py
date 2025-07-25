import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai

# --- Load environment variables ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not all([GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    raise EnvironmentError("❌ One or more environment variables are missing in .env")

# --- Initialize Gemini ---
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# --- Initialize Supabase ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- FastAPI App ---
app = FastAPI()

# --- CORS (Optional) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Input Schema ---
class UserInput(BaseModel):
    name: str
    age: int
    gender: str
    education: str
    skills: list[str]
    preferences: list[str]

# --- Route ---
@app.post("/suggest-career")
def suggest_career(user: UserInput):
    try:
        # Format user prompt
        prompt = f"""
Suggest 3 career options in valid JSON only. No markdown or explanation.

Format:
{{
  "careers": [
    {{ "name": "...", "description": "..." }},
    {{ "name": "...", "description": "..." }},
    {{ "name": "...", "description": "..." }}
  ]
}}

User profile:
- Name: {user.name}
- Age: {user.age}
- Gender: {user.gender}
- Education: {user.education}
- Skills: {', '.join(user.skills)}
- Preferences: {', '.join(user.preferences)}
"""

        # Call Gemini
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        # Handle ```json formatting from Gemini
        if text.startswith("```"):=
            text = text.replace("```json", "").replace("```", "").strip()

        career_data = json.loads(text)
        careers = career_data.get("careers")

        if not careers:
            raise HTTPException(status_code=500, detail="No careers returned by Gemini.")

        # Insert into Supabase
        for career in careers:
            result = supabase.table("career_suggestions").insert({
                "name": user.name,
                "age": user.age,
                "gender": user.gender,
                "education": user.education,
                "skills": user.skills,
                "preferences": user.preferences,
                "career_name": career["name"],
                "career_description": career["description"]
            }).execute()

            if result.get("error"):
                raise HTTPException(status_code=500, detail="Supabase insert error")

        return {"status": "success", "careers": careers}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from Gemini: {e}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
