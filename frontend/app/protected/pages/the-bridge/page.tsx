// app/protected/pages/the-bridge/page.tsx

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Home, Lightbulb, Rocket, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react"; // Impor createContext & useContext

// 1. BUAT DATA DUMMY
const dummyAnalysis = {
  target_profession: "Dummy UI/UX Designer",
  contextual_advice:
    "Ini adalah nasihat dummy. Fokus pada prototyping dan user testing untuk maju.",
  matching_skills: ["Figma (Dummy)", "Canva (Dummy)"],
  gap_skills: ["User Research (Dummy)", "Prototyping (Dummy)"],
};

const dummyRoadmap = {
  learning_path: [
    {
      mission_number: 1,
      title: "Misi Dummy 1: Belajar Wireframing",
      description: "Buat wireframe low-fidelity untuk aplikasi mobile.",
    },
    {
      mission_number: 2,
      title: "Misi Dummy 2: Dalami Prototyping Interaktif",
      description:
        "Ubah wireframe menjadi prototipe yang bisa diklik di Figma.",
    },
  ],
};

// 2. BUAT DUMMY CONTEXT
// Ini meniru provider asli Anda, tetapi dengan data palsu yang sudah kita siapkan.
const DummyRoadmapContext = createContext<any>(null);

function RoadmapPageContent() {
  const { analysis, roadmap } = useContext(DummyRoadmapContext); // Gunakan dummy context
  const router = useRouter();

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mb-8"
          >
            <Home className="mr-2 h-4 w-4" /> Kembali ke Halaman Utama
          </Button>

          <header className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Roadmap Pribadi Anda (Dummy)
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              Langkah-langkah untuk menjadi{" "}
              <span className="font-semibold text-blue-600">
                {analysis.target_profession}
              </span>
              .
            </p>
          </header>

          <div className="space-y-8">
            {/* Card Analisis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Lightbulb className="mr-3 text-yellow-500" />
                  Nasihat & Analisis AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertDescription>
                    {analysis.contextual_advice}
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <CheckCircle className="mr-2 text-green-600" />
                      Keahlian Sesuai
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matching_skills.map((s: string) => (
                        <Badge key={s} className="text-base py-1">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Target className="mr-2 text-red-600" />
                      Kesenjangan Skill
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.gap_skills.map((s: string) => (
                        <Badge
                          key={s}
                          variant="destructive"
                          className="text-base py-1"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Misi Belajar */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Rocket className="mr-3 text-green-500" />
                  Misi Belajar Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {roadmap?.learning_path.map((m: any, i: number) => (
                  <div
                    key={m.mission_number}
                    className="flex items-start gap-4 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg"
                  >
                    <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">
                        {m.title}
                      </h4>
                      <p className="text-slate-600">{m.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// 3. EXPORT KOMPONEN UTAMA YANG DIBUNGKUS DUMMY PROVIDER
export default function RoadmapPageWithDummyData() {
  const dummyValue = {
    analysis: dummyAnalysis,
    roadmap: dummyRoadmap,
    isLoading: false,
    // Sediakan fungsi dummy jika komponen anak membutuhkannya
    setAnalysis: () => {},
    setRoadmap: () => {},
    setIsLoading: () => {},
  };

  return (
    <DummyRoadmapContext.Provider value={dummyValue}>
      <RoadmapPageContent />
    </DummyRoadmapContext.Provider>
  );
}
