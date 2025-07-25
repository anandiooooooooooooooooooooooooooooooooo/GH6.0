# app.py (v6 - Using specific service role key)
# Description: This version uses a specific env variable for the service role key to avoid confusion.

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

# --- NEW: Aggressive check for environment variables ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
# **CHANGE: Using a more specific variable name for the service role key**
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("\n--- Verifying Loaded Credentials ---")
if not SUPABASE_URL:
    print("❌ FATAL: SUPABASE_URL not found in .env file!")
else:
    print(f"✅ SUPABASE_URL: {SUPABASE_URL}")

# **CHANGE: Checking for the new, specific variable name**
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
# **CHANGE: Checking for the new variable**
if not all([SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY]):
    raise ValueError("One or more required environment variables are missing. Check the log above.")

# Configure clients
# **CHANGE: Using the new service role key variable to create the client**
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
print("✅ Supabase and Gemini clients configured successfully.")


# --- 2. Gemini API Interaction ---
def get_career_suggestion_from_gemini(user_profile: dict) -> dict:
    # This function is correct and remains unchanged.
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    prompt_template = """
    You are an expert career counselor AI. Your task is to suggest the single best career path for a user based on their profile and then detail the skills required.
    Analyze the following user profile:
    - Name: {name} - Age: {age} - Gender: {gender} - Education Level: {education_level} - Skills: {skills} - Preferences (Interests/Industries): {preferences}
    Based on this profile, perform the following actions:
    1. Determine the single best career path suggestion. 2. List all the essential skills required for this career. 3. Provide a detailed, one-paragraph description for each of those essential skills.
    Respond in a valid JSON object with the following exact structure. Do not include any other text or markdown formatting like ```json.
    {{
      "career_name": "The single best career title suggested for the user",
      "skills_required": [ {{ "skill_name": "Name of the first required skill" }}, {{ "skill_name": "Name of the second required skill" }} ],
      "skills_descriptions": [ {{ "skill_name": "Name of the first required skill", "description": "A detailed paragraph explaining what this skill is and why it's important for the suggested career." }}, {{ "skill_name": "Name of the second required skill", "description": "A detailed paragraph explaining what this skill is and why it's important for the suggested career." }} ]
    }}
    """
    prompt = prompt_template.format(
        name=user_profile.get('name', 'Not provided'), age=user_profile.get('age', 'Not provided'),
        gender=user_profile.get('gender', 'Not provided'), education_level=user_profile.get('education_level', 'Not provided'),
        skills=user_profile.get('skills', 'Not provided'), preferences=user_profile.get('preferences', 'Not provided')
    )
    try:
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        suggestion_json = json.loads(cleaned_text)
        return suggestion_json
    except Exception as e:
        print(f"❌ ERROR in get_career_suggestion_from_gemini: {e}")
        return {"error": "Failed to generate AI suggestion.", "details": str(e)}


# --- 3. API Endpoint Definition ---
@app.route('/generate-suggestion', methods=['POST'])
def generate_suggestion_endpoint():
    print("\n--- Received new request ---")
    
    try:
        request_data = request.get_json()
        if not request_data or 'user_id' not in request_data:
            return jsonify({"error": "Missing 'user_id' in JSON body"}), 400
    except Exception:
        raw_data = request.get_data(as_text=True)
        print(f"❌ ERROR: Failed to decode JSON. Raw body received: '{raw_data}'")
        return jsonify({"error": "Failed to decode JSON object."}), 400
    
    user_uuid = request_data['user_id']
    print(f"✅ Step 1: Received request for user_id (UUID): {user_uuid}")

    try:
        print(f"⏳ Step 2: Fetching profile from 'user' table where 'user_id' = {user_uuid}...")
        response = supabase.from_('user').select('*').eq('user_id', user_uuid).single().execute()
        
        user_profile = response.data
        if not user_profile:
            print(f"❌ ERROR: User with UUID {user_uuid} not found. Supabase returned 0 rows.")
            print(f"   L- Full Supabase response: {response}")
            return jsonify({"error": f"User with UUID {user_uuid} not found."}), 404
        
        integer_user_id = user_profile['id']
        print(f"✅ Step 2: Successfully fetched profile for user with integer id: {integer_user_id}")

        print("⏳ Step 3: Calling Gemini API...")
        suggestion_json = get_career_suggestion_from_gemini(user_profile)
        
        if "error" in suggestion_json:
             return jsonify(suggestion_json), 500
        
        print("✅ Step 3: Successfully received suggestion from Gemini.")
        
        print("⏳ Step 4: Saving suggestion...")
        suggestion_to_save = {'user_profile_id': integer_user_id, 'suggestion_data': suggestion_json}
        insert_response = supabase.from_('career_suggestions').insert(suggestion_to_save).execute()

        if insert_response.data:
            print("✅ Step 4: Successfully saved suggestion.")
            return jsonify(suggestion_json), 200
        else:
            print(f"❌ ERROR: Failed to insert into Supabase. Details: {insert_response.error}")
            return jsonify({"error": "Failed to save suggestion."}), 500

    except Exception as e:
        print(f"❌ FATAL ERROR in endpoint: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


# --- 4. Main Execution Block ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
