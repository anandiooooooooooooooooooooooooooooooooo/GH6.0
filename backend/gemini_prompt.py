import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client


# Load environment variables from .env
load_dotenv()

# Validate API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise EnvironmentError("❌ GEMINI_API_KEY not found. Check your .env file name, location, and content.")

# Initialize Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Prompt
prompt = """
Suggest 3 best career options for this user:
- Name: Alice
- Age: 22
- Gender: Female
- Education Level: Bachelor of Computer Science
- Location: Jakarta
- Skills: JavaScript, UI/UX, React
- Preferences: Creative industries, tech startups
- MBTI: ENTJ
- Hobbies: Design, reading tech blogs
- Work Experience: Internship at software company
- Career Goal: Lead product designer
- Work Style: Team-based, flexible
- Values: Innovation, impact, learning
- Languages: English, Indonesian
- Preferred career path: UI/UX Designer at a Creative Tech Agency

 Choose and then explain the steps to acquire the skills needed to achieve those careers. 

 First, please skills required. Once you've listed them, I'd like you to explain each skill required one by one. 

 Then, explain the steps to acquire all the required skills from their current educational level to achieve their career path. 

 No need for skill acquisition steps.

Respond in JSON like this:
{
  "skills": [
    { "skill_name": "..." },
    { "skill_name": "..." },
    { "skill_name": "..." }
  ],

  "skills_desc": [
    { "skill_name": "...", "description": "..." },
    { "skill_name": "...", "description": "..." },
    { "skill_name": "...", "description": "..." },etc
  ]

}
"""

# Main function
def test_gemini_prompt():
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Clean formatting if Gemini responds with ```json
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        data = json.loads(text)
        print("✅ Suggested Careers:\n", json.dumps(data, indent=2))
    except Exception as e:
        print("❌ Gemini Error:", e)

if __name__ == "__main__":
    test_gemini_prompt()
