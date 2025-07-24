import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List

# --- KONFIGURASI AWAL ---

# Memuat environment variables dari file .env
load_dotenv()

# Menginisialisasi aplikasi FastAPI dengan dokumentasi yang lebih baik
app = FastAPI(
    title="Jembatan Keahlian AI Backend",
    description="API untuk analisis keahlian dan pembuatan jalur belajar cerdas menggunakan Gemini.",
    version="1.1.0"
)

# Mengkonfigurasi CORS agar Next.js di localhost bisa berkomunikasi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KONFIGURASI GEMINI API ---

# Mengambil API Key dan memberikan error jika tidak ada
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY tidak ditemukan di environment. Harap buat file .env dan isi kuncinya.")

genai.configure(api_key=GEMINI_API_KEY)

# ✨ PENINGKATAN KUNCI: Memaksa output model menjadi JSON secara native
# Ini adalah cara paling andal untuk memastikan frontend menerima data yang terstruktur.
generation_config = {"response_mime_type": "application/json"}
model = genai.GenerativeModel(
    'gemini-1.5-flash-latest', # Menggunakan versi model terbaru
    generation_config=generation_config
)


# --- MODEL DATA (PYDANTIC) ---
# Mendefinisikan struktur data yang akan diterima dari frontend.

class UserSkill(BaseModel):
    name: str
    level: str # Contoh: "Dasar", "Menengah", "Mahir"

class GapAnalysisRequest(BaseModel):
    target_profession: str
    current_skills: List[UserSkill]
    background: str = ""
    experience: str = ""

class LearningPathRequest(BaseModel):
    target_profession: str
    background: str
    skill_gaps: List[str]

class ConceptRequest(BaseModel):
    concept: str
    background: str


# --- FUNGSI PEMBANTU (HELPER) ---

async def call_gemini_api_for_json(prompt: str):
    """
    Fungsi terpusat untuk memanggil Gemini API secara asynchronous.
    - Menggunakan 'generate_content_async' untuk performa non-blocking.
    - Membersihkan dan mem-parsing output JSON dari Gemini.
    - Menangani error secara terpusat.
    """
    try:
        # Panggilan API asynchronous, tidak memblokir server
        response = await model.generate_content_async(prompt)

        # Membersihkan respons jika model masih membungkusnya dengan markdown
        cleaned_json_string = response.text.strip().removeprefix("```json").removesuffix("```").strip()

        # Mengubah string JSON menjadi objek Python (dictionary)
        return json.loads(cleaned_json_string)

    except Exception as e:
        # Memberikan pesan error yang jelas jika terjadi masalah
        print(f"Error saat memanggil Gemini atau mem-parsing JSON: {e}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada server AI: {str(e)}")


# --- ENDPOINTS API ---

@app.post("/analyze-gap", summary="Fitur #1: Analis Kesenjangan Skill")
async def analyze_skill_gap(request: GapAnalysisRequest):
    """Menganalisis kesenjangan antara keahlian saat ini dan profesi tujuan."""
    skills_list_str = ", ".join([f"{s.name} ({s.level})" for s in request.current_skills])

    prompt = f"""
    Anda adalah seorang konsultan karir AI. Berdasarkan data berikut:
    - Profesi Tujuan: '{request.target_profession}'
    - Latar Belakang: '{request.background}'
    - Pengalaman: '{request.experience}'
    - Keahlian Saat Ini: {skills_list_str}

    Lakukan analisis dan berikan output HANYA dalam format JSON yang valid dengan struktur berikut:
    {{
      "required_skills": ["skill_1", "skill_2", ...],
      "matching_skills": ["skill_yang_sudah_cocok_1", ...],
      "gap_skills": ["skill_yang_perlu_ditingkatkan_1", ...],
      "contextual_advice": "Sebuah paragraf singkat berisi nasihat kontekstual dan memotivasi."
    }}
    """
    return await call_gemini_api_for_json(prompt)


@app.post("/generate-learning-path", summary="Fitur #2: Jembatan Belajar Adaptif")
async def generate_adaptive_learning_path(request: LearningPathRequest):
    """Membuat jalur belajar yang dipersonalisasi berdasarkan kesenjangan keahlian."""
    gaps_list_str = ", ".join(request.skill_gaps)

    prompt = f"""
    Anda adalah seorang mentor AI. Buat rencana belajar untuk seseorang yang ingin menjadi '{request.target_profession}' dengan latar belakang '{request.background}'. Skill yang perlu dipelajari adalah: {gaps_list_str}.

    Buat serangkaian misi belajar yang relevan. Berikan output HANYA dalam format JSON yang valid dengan struktur berikut:
    {{
      "learning_path": [
        {{
          "mission_number": 1,
          "title": "Judul Misi Pertama",
          "description": "Deskripsi singkat dan relevan untuk misi pertama."
        }},
        {{
          "mission_number": 2,
          "title": "Judul Misi Kedua",
          "description": "Deskripsi singkat dan relevan untuk misi kedua."
        }}
      ]
    }}
    """
    return await call_gemini_api_for_json(prompt)


@app.post("/explain-concept", summary="Fitur #3: Penerjemah Konsep (Kang Jelasin)")
async def get_concept_explanation(request: ConceptRequest):
    """Menjelaskan konsep teknis dengan analogi yang dipersonalisasi."""
    prompt = f"""
    Anda adalah 'Kang Jelasin'. Jelaskan konsep teknis '{request.concept}' menggunakan analogi yang mudah dipahami untuk seseorang dengan latar belakang '{request.background}'. Gunakan bahasa yang santai.

    Berikan output HANYA dalam format JSON yang valid dengan struktur berikut:
    {{
      "explanation": "Teks penjelasan hasil analogi Anda di sini."
    }}
    """
    return await call_gemini_api_for_json(prompt)


# --- MENJALANKAN SERVER ---

if __name__ == "__main__":
    import uvicorn
    # Menjalankan server Uvicorn. Opsi reload=True bagus untuk development.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
