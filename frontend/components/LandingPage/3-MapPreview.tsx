"use client";
import { LockKeyhole } from "lucide-react";

export const MapPreview = () => {
  const roadmap = [
    { title: "Mimpi Jadi Dokter", icon: "🩺" },
    { title: "Belajar IPA", icon: "📚" },
    { title: "Masuk SMA Unggulan", icon: "🏫" },
    { title: "Ikut Olimpiade Sains", icon: "🥇" },
    { title: "Masuk FK UI", icon: "🎓" },
    { title: "Jadi Dokter", icon: "🩺" },
  ];

  return (
    <section className="bg-slate-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Intip Jalur Mimpi Kamu
        </h2>
        <p className="text-slate-600 mt-2">
          Temukan langkah-langkah menuju cita-citamu setelah login
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 rounded-lg flex flex-col items-center justify-center text-center p-4">
          <LockKeyhole className="w-10 h-10 text-slate-500 mb-2" />
          <p className="text-slate-700 font-medium">
            Login untuk melihat Jalur Mimpimu
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {roadmap.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {step.icon}
                </div>
                {idx < roadmap.length - 1 && (
                  <div className="h-10 w-1 bg-blue-300 mt-1" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">{step.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="/auth/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
        >
          Masuk & Mulai Petamu
        </a>
      </div>
    </section>
  );
};
