const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { createClient } = require('@supabase/supabase-js')

// Load .env only in local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const app = express()
app.use(cors())
app.use(express.json())

// Use environment variables correctly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

app.post('/suggest', async (req, res) => {
  const user = req.body

  const prompt = `
Suggest 3 best career options for this user:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Education Level: ${user.education}
- Location: ${user.location}
- Skills: ${user.skills}
- Preferences: ${user.preferences}
- MBTI: ${user.mbti}
- Hobbies: ${user.hobbies}
- Work Experience: ${user.experience}
- Career Goal: ${user.careerGoal}
- Work Style: ${user.workStyle}
- Values: ${user.values}
- Languages: ${user.language}

Respond in JSON like this:
{
  "careers": [
    { "name": "...", "description": "..." },
    { "name": "...", "description": "..." },
    { "name": "...", "description": "..." }
  ]
}
`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)

    if (!result || !result.response) {
      throw new Error('No response from Gemini API')
    }

    let text = result.response.text()
    text = text.replace(/```json|```/g, '').trim()

    const json = JSON.parse(text)

    // Store result in Supabase
    await supabase.from('career_logs').insert([
      { user_data: user, result: json }
    ])

    res.json(json)
  } catch (e) {
    console.error('❌ Error:', e.message)
    res.status(500).json({ error: 'Failed to process suggestion', details: e.message })
  }
})

// Use Railway's port or default to 5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
