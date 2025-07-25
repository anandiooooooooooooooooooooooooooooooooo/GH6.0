import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from supabase import create_client, Client
import google.generativeai as genai

# --- 1. Initialization and Configuration ---
print("--- Starting Server ---")
print("Loading environment variables from .env file...")
load_dotenv()
app = Flask(__name__)

# --- Aggressive check for environment variables ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("\n--- Verifying Loaded Credentials ---")
if not SUPABASE_URL:
    print("❌ FATAL: SUPABASE_URL not found in .env file!")
else:
    print(f"✅ SUPABASE_URL: {SUPABASE_URL}")

if not SUPABASE_SERVICE_ROLE_KEY:
    print("❌ FATAL: SUPABASE_SERVICE_ROLE_KEY not found in .env file! This is required for backend operations.")
else:
    # Print a masked version for security
    print(f"✅ SUPABASE_SERVICE_ROLE_KEY: Loaded (ends with '...{SUPABASE_SERVICE_ROLE_KEY[-4:]}')")

if not GEMINI_API_KEY:
    print("❌ FATAL: GEMINI_API_KEY not found in .env file!")
else:
    print(f"✅ GEMINI_API_KEY: Loaded")
print("-------------------------------------\n")


# Raise an error if keys are missing to prevent the app from running with bad config
if not all([SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY]):
    raise ValueError("One or more required environment variables are missing. Check the log above.")

# Configure clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
print("✅ Supabase and Gemini clients configured successfully.")


# --- 2. Gemini API Functions ---

@app.route('/gen-career-recommend', methods=['POST'])
def get_career_suggestions_from_gemini(user_profile: dict) -> dict:
    """
    STEP 1: Asks Gemini for 3 career suggestions (name and description).
    """
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"""
    You are a concise career advisor. Based on the following user profile, suggest the 3 best career paths.

    User Profile:
    - Name: {user_profile.get('name', 'N/A')}
    - Age: {user_profile.get('age', 'N/A')}
    - Education: {user_profile.get('education_level', 'N/A')}
    - Skills: {user_profile.get('skills', 'N/A')}
    - Preferences/Interests: {user_profile.get('preferences', 'N/A')}

    Respond with ONLY a valid JSON object with a single key "suggestions" which is an array of 3 objects.
    Each object must have a "career_name" and a "career_description" (under 30 words).
    Example:
    {{
      "suggestions": [
        {{ "career_name": "Product Manager", "career_description": "Oversee product development from conception to launch, bridging gaps between business, tech, and user experience." }},
        {{ "career_name": "UX Researcher", "career_description": "Understand user behaviors, needs, and motivations through observation techniques, task analysis, and other feedback methodologies." }},
        {{ "career_name": "Data Analyst", "career_description": "Interpret data and turn it into information which can offer ways to improve a business, thus affecting business decisions." }}
      ]
    }}
    """
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"❌ ERROR in get_career_suggestions_from_gemini: {e}")
        return {"error": "Failed to generate career suggestions.", "details": str(e)}

def get_skill_details_from_gemini(user_profile: dict) -> dict:
    """
    STEP 2: Asks Gemini for detailed skills for a chosen career path.
    """
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt = f"""
    You are an expert career counselor AI. A user has provided their profile and has chosen a preferred career path.
    Your task is to detail the essential skills required for this chosen path.

    User Profile:
    - Name: {user_profile.get('name', 'N/A')}
    - Skills: {user_profile.get('skills', 'N/A')}
    - Chosen Career Path: {user_profile.get('preferred_career', 'N/A')}

    Based on this complete profile, provide a detailed, one-paragraph description for each of the essential skills.
    Respond in a valid JSON object with the following exact structure. Do not include any other text or markdown formatting.
    {{
      "skills_descriptions": [
        {{ "skill_name": "Name of the first required skill", "description": "A detailed paragraph explaining this skill." }},
        {{ "skill_name": "Name of the second required skill", "description": "A detailed paragraph explaining this skill." }}
      ]
    }}
    """
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"❌ ERROR in get_skill_details_from_gemini: {e}")
        return {"error": "Failed to generate skill details.", "details": str(e)}


# --- 3. API Endpoints ---

@app.route('/generate-career-titles', methods=['POST'])
def generate_career_titles_endpoint():
    print("\n--- Received request for STEP 1: Generate Career Suggestions ---")
    request_data = request.get_json()
    if not request_data or 'user_id' not in request_data:
        return jsonify({"error": "Missing 'user_id' in request body"}), 400

    user_uuid = request_data['user_id']
    print(f"Request for user_id (UUID): {user_uuid}")

    try:
        # **CHANGE: Using 'profiles' table**
        user_profile_response = supabase.from_('profiles').select('*').eq('user_id', user_uuid).single().execute()
        if not user_profile_response.data:
            print(f"❌ ERROR: User with UUID {user_uuid} not found. Supabase returned 0 rows.")
            return jsonify({"error": f"User with UUID {user_uuid} not found."}), 404

        user_profile = user_profile_response.data
        integer_user_id = user_profile['id']
        print(f"Successfully fetched profile for user with integer id: {integer_user_id}")

        suggestions_json = get_career_suggestions_from_gemini(user_profile)
        if "error" in suggestions_json or "suggestions" not in suggestions_json:
            return jsonify(suggestions_json), 500

        suggestions = suggestions_json["suggestions"]
        print(f"Received suggestions from Gemini: {suggestions}")

        suggestions_to_save = [
            {
                'user_profile_id': integer_user_id,
                'user_id': user_uuid,
                'career_name': sug.get('career_name'),
                'career_description': sug.get('career_description')
            } for sug in suggestions
        ]
        insert_response = supabase.from_('career_suggestions').insert(suggestions_to_save).execute()
        if not insert_response.data:
            print(f"❌ ERROR: Failed to save career suggestions. Details: {insert_response.error}")
            return jsonify({"error": "Failed to save career suggestions."}), 500

        print("✅ Successfully saved suggestions to database.")
        return jsonify(suggestions_json), 200

    except Exception as e:
        print(f"❌ FATAL ERROR in /generate-career-titles endpoint: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


@app.route('/generate-skill-details', methods=['POST'])
def generate_skill_details_endpoint():
    print("\n--- Received request for STEP 2: Generate Skill Details ---")
    request_data = request.get_json()
    if not request_data or 'user_id' not in request_data or 'preferred_career' not in request_data:
        return jsonify({"error": "Request body must contain 'user_id' and 'preferred_career'"}), 400

    user_uuid = request_data['user_id']
    preferred_career = request_data['preferred_career']
    print(f"Request for user_id (UUID): {user_uuid} with chosen career: {preferred_career}")

    try:
        # **CHANGE: Using 'profiles' table**
        supabase.from_('profiles').update({'preferred_career': preferred_career}).eq('user_id', user_uuid).execute()
        print(f"Successfully updated user's preferred career to '{preferred_career}'")

        # **CHANGE: Using 'profiles' table**
        user_profile_response = supabase.from_('profiles').select('*').eq('user_id', user_uuid).single().execute()
        if not user_profile_response.data:
            return jsonify({"error": "Could not re-fetch user profile after update."}), 404

        full_user_profile = user_profile_response.data

        skills_json = get_skill_details_from_gemini(full_user_profile)
        if "error" in skills_json or "skills_descriptions" not in skills_json:
            return jsonify(skills_json), 500

        print("✅ Successfully generated skill details from Gemini.")

        skills_to_save = [
            {'title': skill.get('skill_name'), 'description': skill.get('description'), 'user_id': user_uuid}
            for skill in skills_json["skills_descriptions"]
        ]

        if skills_to_save:
            print(f"⏳ Saving {len(skills_to_save)} skills to the 'skills' table...")
            supabase.from_('skills').insert(skills_to_save).execute()
            print("✅ Successfully saved skills to the 'skills' table.")

        # **CHANGE: Using 'profiles' table**
        print("⏳ Setting 'profile_completed' to true for the user...")
        supabase.from_('profiles').update({'profile_completed': True}).eq('user_id', user_uuid).execute()
        print("✅ User profile marked as completed.")

        return jsonify(skills_json), 200

    except Exception as e:
        print(f"❌ FATAL ERROR in /generate-skill-details endpoint: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


# --- 4. Main Execution Block ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
