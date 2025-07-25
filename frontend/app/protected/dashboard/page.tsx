"use client";

import { Button } from "@/components/ui/button";
import { AnalysisModal } from "@/components/user-profile-modal";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center">
      <div className="mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full w-fit shadow-lg">
        <Sparkles className="h-12 w-12 text-white" />
      </div>
      <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
        Jembatan Keahlian
      </h1>
      <p className="text-slate-600 mt-4 max-w-xl mx-auto">
        Ubah cita-cita karir Anda menjadi rencana aksi yang nyata. Mulai dengan
        analisis cerdas yang dipersonalisasi untuk Anda.
      </p>
      <Button
        size="lg"
        className="mt-8 text-lg py-7 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        Mulai Analisis Cerdas Saya
      </Button>

      {/* Memanggil modal yang sederhana dan elegan */}
      <AnalysisModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </main>
  );
}
