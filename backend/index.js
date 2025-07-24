const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { createClient } = require('@supabase/supabase-js')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(env.local.GEMINI_API_KEY)
const supabase = createClient(env.local.SUPABASE_URL, env.local.SUPABASE_KEY)

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
    const text = result.response.text()

    const json = JSON.parse(text)

    await supabase.from('career_logs').insert([
      { user_data: user, result: json }
    ])

    res.json(json)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Failed to process" })
  }
})

app.listen(5000, () => console.log('Server on http://localhost:5000'))
