"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  Lightbulb,
  Loader,
  Trophy,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";

// --- Tipe Data & Data Mock ---
type Misi = {
  title: string;
  type: "bacaan" | "video" | "proyek";
  resource: string;
};

type BatuLoncatan = {
  skillName: string;
  missions: Misi[];
};

type AnalysisResult = {
  ownedSkills: string[];
  gapSkills: string[];
  learningBridge: BatuLoncatan[];
};

type RoadmapState = {
  [skillName: string]: {
    [missionTitle: string]: boolean;
  };
};

// --- Komponen UI Pendukung ---

const TagInput = ({ skills, setSkills }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        setSkills([...skills, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border-2 border-slate-300 rounded-lg bg-white min-h-[48px]">
        {skills.map((skill) => (
          <motion.div
            key={skill}
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(skill)}
              className="focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik keahlian & tekan Enter..."
          className="flex-grow bg-transparent focus:outline-none p-1"
        />
      </div>
    </div>
  );
};

const MisiCard = ({ misi, isCompleted, onToggle, onTranslate }) => {
  const getIcon = () => {
    switch (misi.type) {
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "bacaan":
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case "proyek":
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 pl-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-colors ${
            isCompleted
              ? "bg-green-500 border-green-500"
              : "border-slate-300 hover:border-green-400"
          }`}
        >
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </button>
        <div className="flex items-center gap-3">
          {getIcon()}
          <a
            href={misi.resource}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-slate-700 hover:underline ${
              isCompleted ? "line-through text-slate-400" : ""
            }`}
          >
            {misi.title}
          </a>
        </div>
      </div>
      <motion.button
        onClick={() => onTranslate(misi.title)}
        className="p-2 rounded-full hover:bg-yellow-100 text-yellow-500 hover:text-yellow-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Jelaskan Pakai Analogi!"
      >
        <Lightbulb className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

const ExplanationModal = ({ explanation, onClose, isLoading }) => (
  <AnimatePresence>
    {explanation !== null && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Kang Jelasin Bilang...
            </h2>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {explanation}
            </p>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Halaman Utama ---
export default function JembatanKeahlianPage() {
  // State untuk Fitur 1
  const [careerGoal, setCareerGoal] = useState("Analis Data");
  const [currentSkills, setCurrentSkills] = useState(["Microsoft Excel"]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Fitur 2
  const [roadmapState, setRoadmapState] = useState<RoadmapState>({});

  // State untuk Fitur 3
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // --- Logika & Simulasi API ---

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    // Simulasi panggilan API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Data mock yang dikembalikan oleh AI
    const mockResult: AnalysisResult = {
      ownedSkills: ["Microsoft Excel"],
      gapSkills: [
        "SQL untuk Pemula",
        "Dasar Python",
        "Visualisasi Data (Tableau)",
      ],
      learningBridge: [
        {
          skillName: "SQL untuk Pemula",
          missions: [
            {
              title: "Memahami SELECT, FROM, WHERE",
              type: "bacaan",
              resource: "#",
            },
            {
              title: "Belajar tentang INNER JOIN",
              type: "video",
              resource: "#",
            },
          ],
        },
        {
          skillName: "Dasar Python",
          missions: [
            {
              title: "Instalasi Python & Pengenalan Jupyter",
              type: "video",
              resource: "#",
            },
            { title: "Mengenal Library Pandas", type: "bacaan", resource: "#" },
            {
              title: "Membaca file CSV dengan Pandas",
              type: "proyek",
              resource: "#",
            },
          ],
        },
        {
          skillName: "Visualisasi Data (Tableau)",
          missions: [
            {
              title: "Membuat chart batang pertama di Tableau",
              type: "proyek",
              resource: "#",
            },
          ],
        },
      ],
    };
    setAnalysisResult(mockResult);

    // Inisialisasi state roadmap
    const initialRoadmapState = {};
    mockResult.learningBridge.forEach((skill) => {
      initialRoadmapState[skill.skillName] = {};
      skill.missions.forEach((misi) => {
        initialRoadmapState[skill.skillName][misi.title] = false;
      });
    });
    setRoadmapState(initialRoadmapState);

    setIsLoading(false);
  };

  const handleToggleMisi = (skillName, missionTitle) => {
    setRoadmapState((prev) => ({
      ...prev,
      [skillName]: {
        ...prev[skillName],
        [missionTitle]: !prev[skillName][missionTitle],
      },
    }));
  };

  const handleTranslateConcept = async (concept: string) => {
    setExplanation(""); // Buka modal dengan state loading
    setIsModalLoading(true);
    // Simulasi panggilan API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let mockExplanation = "";
    if (concept.includes("INNER JOIN")) {
      mockExplanation =
        "Gini lho, `INNER JOIN` itu kayak tukang nasi goreng.\n\nBayangin kamu punya dua daftar: satu daftar semua bahan di dapur (Tabel A), dan satu lagi daftar bahan khusus untuk nasi goreng (Tabel B).\n\n`INNER JOIN` itu cuma akan ngambil bahan-bahan yang ada di **kedua daftar itu** (nasi, telur, kecap). Bahan yang nggak ada di resep nasi goreng (misal: terigu) nggak akan diambil. Paham kan?";
    } else {
      mockExplanation = `Oke, mari kita bahas tentang "${concept}".\n\nBayangkan ini seperti merakit mainan. Kamu punya buku petunjuk (itu adalah konsepnya) dan kepingan-kepingan lego (itu adalah datanya). Kamu harus mengikuti petunjuk langkah demi langkah agar rakitanmu jadi sempurna. Sama seperti belajar, setiap konsep adalah satu petunjuk penting menuju mimpimu!`;
    }

    setExplanation(mockExplanation);
    setIsModalLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        {/* --- FITUR 1: ANALIS KESENJANGAN SKILL --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 text-center">
            Bangun Jembatan Keahlianmu
          </h1>
          <p className="text-slate-600 text-center mt-2 mb-8">
            Identifikasi celah antara keahlianmu sekarang dan profesi impianmu.
          </p>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="font-semibold text-slate-700 mb-2 block">
                1. Apa profesi impianmu?
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full p-3 border-2 border-slate-300 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500 transition"
              >
                <option>Analis Data</option>
                <option>Desainer Grafis</option>
                <option>Digital Marketer</option>
                <option>Front-End Developer</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 mb-2 block">
                2. Apa saja keahlianmu saat ini?
              </label>
              <TagInput skills={currentSkills} setSkills={setCurrentSkills} />
            </div>
          </div>

          <div className="text-center mt-8">
            <motion.button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-blue-600 text-white font-bold px-10 py-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-all text-lg shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" />
                  <span>Menganalisis...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Analisis Kesenjanganku</span>
                  <ArrowRight />
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              {/* --- Output Analisis --- */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-3">
                    ✅ Modal Anda
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.ownedSkills.map((skill) => (
                      <li key={skill} className="text-green-700">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-orange-800 mb-3">
                    🔲 Jembatan yang Perlu Dibangun
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.gapSkills.map((skill) => (
                      <li key={skill} className="text-orange-700">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* --- FITUR 2: JEMBATAN BELAJAR PERSONAL --- */}
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-8">
                  Jembatan Belajarmu
                </h2>
                <div className="relative pl-6">
                  <div className="absolute left-9 top-0 w-1 h-full bg-slate-200 rounded-full -z-10"></div>
                  {analysisResult.learningBridge.map((batu, index) => {
                    const missionsInStep = roadmapState[batu.skillName] || {};
                    const completedMissions =
                      Object.values(missionsInStep).filter(Boolean).length;
                    const totalMissions = batu.missions.length;
                    const isStepCompleted =
                      totalMissions > 0 && completedMissions === totalMissions;

                    return (
                      <motion.div
                        key={batu.skillName}
                        className="relative mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg transition-colors z-10 ${
                              isStepCompleted ? "bg-green-500" : "bg-blue-600"
                            }`}
                          >
                            {isStepCompleted ? (
                              <Check size={16} />
                            ) : (
                              <span className="font-bold text-xs">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-xl text-slate-800">
                            {batu.skillName}
                          </h3>
                        </div>
                        <div className="pl-10 mt-4 space-y-3">
                          {batu.missions.map((misi) => (
                            <MisiCard
                              key={misi.title}
                              misi={misi}
                              isCompleted={
                                roadmapState[batu.skillName]?.[misi.title] ||
                                false
                              }
                              onToggle={() =>
                                handleToggleMisi(batu.skillName, misi.title)
                              }
                              onTranslate={handleTranslateConcept}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FITUR 3: PENERJEMAH KONSEP LOKAL (MODAL) --- */}
        <ExplanationModal
          explanation={explanation}
          onClose={() => setExplanation(null)}
          isLoading={isModalLoading}
        />
      </div>
    </div>
  );
}
