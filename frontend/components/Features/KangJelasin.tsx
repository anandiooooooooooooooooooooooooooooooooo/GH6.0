"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Cog,
  Lightbulb,
  Loader2,
  Rocket,
  Route,
} from "lucide-react";
import { useState } from "react";

// Tipe data (tidak berubah)
type RoadmapStep = {
  step: number;
  title: string;
  description: string;
};

// Kerangka (Skeleton) yang disesuaikan untuk tata letak zig-zag
const RoadmapSkeleton = () => (
  <div className="relative w-full space-y-8 mt-10">
    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-200" />
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`relative w-full flex ${
          i % 2 === 0 ? "justify-end" : "justify-start"
        }`}
      >
        <div className="w-1/2 px-4">
          <div className="p-4 rounded-lg bg-slate-100 animate-pulse">
            <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-10 w-full bg-slate-200 rounded-md mt-2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export function ConceptExplainer() {
  const [concept, setConcept] = useState("API");
  const [background, setBackground] = useState("Akuntansi");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);

  const handleExplain = async () => {
    if (!concept || !background) {
      setError("Mohon isi kedua field!");
      return;
    }
    setIsLoading(true);
    setRoadmapSteps([]);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/explain-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept, background }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.detail || "Gagal mendapatkan penjelasan dari server."
        );
      }
      const data = await response.json();
      if (data.roadmap_steps) {
        setRoadmapSteps(data.roadmap_steps);
      } else {
        throw new Error("Format respons dari server tidak sesuai.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (index: number) => {
    if (index === 0) return <Lightbulb className="w-5 h-5" />;
    if (index === roadmapSteps.length - 1)
      return <Rocket className="w-5 h-5" />;
    return <Cog className="w-5 h-5" />;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex items-center text-2xl">
          <Route className="w-8 h-8 mr-3 text-blue-600" />
          Roadmap Pemahaman Konsep
        </CardTitle>
        <CardDescription>
          Bingung dengan istilah teknis? Ikuti peta jalan yang dipersonalisasi
          untuk memahami konsepnya.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="concept">Konsep Teknis</Label>
            <Input
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="background">Latar Belakang Anda</Label>
            <Input
              id="background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
        </div>

        {/* --- Tampilan Output Roadmap Kompleks --- */}
        <div className="mt-8 min-h-[200px]">
          {isLoading && <RoadmapSkeleton />}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Terjadi Kesalahan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && roadmapSteps.length > 0 && (
            <div className="relative w-full">
              {/* Garis Waktu Sentral (Hanya terlihat di layar medium ke atas) */}
              <div className="hidden md:block absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-indigo-400 rounded-full" />

              {roadmapSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="relative flex md:grid md:grid-cols-2 md:gap-x-16 items-start my-6 md:my-0"
                >
                  {/* Ikon di Tengah (Desktop) atau di Kiri (Mobile) */}
                  <div
                    className={`
                    flex-shrink-0 z-10
                    md:absolute md:top-4 md:left-1/2 md:-translate-x-1/2
                    w-12 h-12 rounded-full bg-white border-4 border-blue-500 text-blue-600
                    flex items-center justify-center font-bold text-lg shadow-lg
                  `}
                  >
                    {getStepIcon(index)}
                  </div>

                  {/* Konten Teks */}
                  <div
                    className={`
                    w-full ml-6 md:ml-0
                    md:flex md:items-center
                    ${
                      index % 2 === 0
                        ? "md:col-start-2"
                        : "md:col-start-1 md:text-right"
                    }
                  `}
                  >
                    <div
                      className={`w-full p-4 rounded-lg bg-slate-50 border border-slate-200 shadow-md hover:shadow-xl transition-shadow duration-300 animate-in fade-in-50`}
                    >
                      <h3 className="font-bold text-lg text-blue-800">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-6">
        <Button
          onClick={handleExplain}
          disabled={isLoading}
          className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-shadow bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Membuat Peta Jalan...
            </>
          ) : (
            "Buatkan Saya Peta Jalan!"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
