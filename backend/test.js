// test.js
import dotenv from 'dotenv';

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// --- NEW: Add this check for the API Key ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // This error will appear immediately if the .env file is wrong, which is more helpful.
  throw new Error("GEMINI_API_KEY not found. Please check your .env file name, location, and content.");
}
// --- End of new check ---

const genAI = new GoogleGenerativeAI(apiKey); // Use the validated key

async function testGeminiPrompt() {
  const prompt = `
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

Respond in valid JSON format only, like this:
{
  "careers": [
    { "name": "...", "description": "..." },
    { "name": "...", "description": "..." },
    { "name": "...", "description": "..." }
  ]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const response = result.response;
    let text = response.text();
    
    text = text.replace(/```json|```/g, '').trim();

    const json = JSON.parse(text);
    console.log('✅ Suggested Careers:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('❌ Gemini Error:', e);
  }
}

testGeminiPrompt();