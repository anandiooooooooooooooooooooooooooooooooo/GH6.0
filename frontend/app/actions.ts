// app/actions.ts

"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Konfigurasi Gemini dengan API Key dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Tipe data untuk input fungsi
type UserProfile = {
  name: string;
  age: number;
  education_level: string;
  gender: string;
  skills: { name: string; level: string }[];
  preferences: string;
};


// --- FUNGSI LAMA (TETAP DIPERTAHANKAN) ---
export async function getCareerSuggestions(profile: UserProfile) {
  const prompt = `
    Anda adalah seorang penasihat karier yang cerdas. Berdasarkan profil pengguna berikut, berikan 3 rekomendasi jalur karier terbaik.

    Profil Pengguna:
    - Nama: ${profile.name}
    - Usia: ${profile.age}
    - Pendidikan: ${profile.education_level}
    - Keahlian: ${profile.skills.map(s => `${s.name} (${s.level})`).join(", ")}
    - Preferensi/Minat: ${profile.preferences}

    Balas HANYA dengan objek JSON yang valid dengan satu kunci "suggestions" yang merupakan array berisi 3 objek.
    Setiap objek harus memiliki kunci "career_name" dan "career_description" (maksimal 25 kata).
    Contoh:
    {
      "suggestions": [
        { "career_name": "Product Manager", "career_description": "Mengawasi pengembangan produk dari konsep hingga peluncuran, menjembatani bisnis, teknologi, dan pengalaman pengguna." },
        { "career_name": "UX Researcher", "career_description": "Memahami perilaku dan kebutuhan pengguna melalui riset mendalam untuk menginformasikan desain produk." },
        { "career_name": "Data Analyst", "career_description": "Menginterpretasikan data untuk menemukan wawasan bisnis dan membantu pengambilan keputusan strategis." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedJson = JSON.parse(cleanedJsonString);
    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API for suggestions:", error);
    return { error: "Gagal menghasilkan rekomendasi dari AI." };
  }
}


// --- FUNGSI LAMA (TETAP DIPERTAHANKAN) ---
export async function generateRoadmap(profile: any) {
  const prompt = `
    Anda adalah seorang mentor karier dan perancang kurikulum AI. Tugas Anda adalah membuat peta jalan belajar (roadmap) yang detail dan realistis untuk seorang pengguna berdasarkan profil mereka.

    Profil Pengguna:
    - Nama: ${profile.name}
    - Usia: ${profile.age}
    - Tingkat Pendidikan: ${profile.education_level}
    - Keahlian Saat Ini: ${profile.skills.map((s: any) => `${s.name} (tingkat: ${s.level})`).join(", ")}
    - Karier yang Diinginkan: ${profile.preferred_career}

    Buatlah peta jalan yang terdiri dari 3 hingga 5 fase belajar. Setiap fase harus memiliki judul yang jelas dan berisi 2 hingga 4 pencapaian (milestones). Setiap pencapaian harus memiliki judul, deskripsi singkat (aksi yang harus dilakukan), dan estimasi durasi.

    Balas HANYA dengan objek JSON yang valid dengan struktur berikut. Jangan tambahkan teks atau format markdown apa pun di luar objek JSON ini.

    Contoh Struktur:
    {
      "roadmap": [
        {
          "phase": "Fase 1: Fondasi dan Pemahaman Dasar",
          "milestones": [
            { "title": "Pelajari Prinsip Dasar UI/UX", "description": "Fokus pada teori warna, tipografi, user flow, dan wireframing.", "duration": "3 Minggu" },
            { "title": "Kuasai Figma dari Dasar", "description": "Pelajari semua alat inti, pembuatan komponen, dan prototyping di Figma.", "duration": "4 Minggu" }
          ]
        },
        {
          "phase": "Fase 2: Membangun Proyek Portofolio Pertama",
          "milestones": [
            { "title": "Redesain Aplikasi Populer", "description": "Pilih satu aplikasi dan lakukan studi kasus untuk mendesain ulang interfacenya.", "duration": "4 Minggu" }
          ]
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedJson = JSON.parse(cleanedJsonString);
    return parsedJson;
  } catch (error) {
    console.error("Error calling Gemini API for roadmap:", error);
    return { error: "Gagal membuat roadmap dari AI." };
  }
}

// --- FUNGSI BARU UNTUK DATA DUMMY ---
export async function generateDummyRoadmap(profile: any) {
  console.log("✅ Menggunakan data roadmap DUMMY untuk pengembangan.");

  // Simulasi jeda waktu seperti panggilan API sungguhan
  await new Promise(resolve => setTimeout(resolve, 1000));

  const dummyData = {
    "roadmap": [
      {
        "phase": "Fase 1: Fondasi Web Development",
        "milestones": [
          { "title": "Pelajari HTML & CSS Dasar", "description": "Pahami struktur halaman web dengan HTML dan styling dasar menggunakan CSS.", "duration": "2 Minggu" },
          { "title": "Dasar-dasar JavaScript", "description": "Kuasai variabel, tipe data, loop, function, dan manipulasi DOM.", "duration": "4 Minggu" },
          { "title": "Pengenalan Git & GitHub", "description": "Belajar sistem kontrol versi untuk mengelola kode dan berkolaborasi.", "duration": "1 Minggu" }
        ]
      },
      {
        "phase": "Fase 2: Menguasai Framework Modern",
        "milestones": [
          { "title": "Belajar React.js", "description": "Pahami konsep komponen, state, props, dan hooks untuk membangun UI interaktif.", "duration": "4 Minggu" },
          { "title": "Membangun Proyek dengan Next.js", "description": "Gunakan React untuk membuat aplikasi full-stack dengan App Router dan Server Actions.", "duration": "5 Minggu" },
          { "title": "Styling dengan Tailwind CSS", "description": "Terapkan desain yang responsif dan modern dengan cepat menggunakan utility-first CSS.", "duration": "2 Minggu" }
        ]
      },
      {
        "phase": "Fase 3: Menjadi Profesional Siap Kerja",
        "milestones": [
          { "title": "Pengenalan TypeScript", "description": "Tambahkan static typing pada JavaScript untuk menulis kode yang lebih aman dan mudah dikelola.", "duration": "3 Minggu" },
          { "title": "Dasar-dasar Pengujian (Testing)", "description": "Pelajari cara menulis unit test dan integration test menggunakan Jest dan React Testing Library.", "duration": "2 Minggu" },
          { "title": "Membangun & Deploy Portofolio", "description": "Buat proyek akhir yang solid, lalu deploy ke Vercel untuk ditunjukkan kepada rekruter.", "duration": "4 Minggu" }
        ]
      }
    ]
  };
  return dummyData;
}
