// app/roadmap/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// Impor KEDUA fungsi
import { generateDummyRoadmap } from "@/app/actions";
import { RoadmapClientPage } from "./client-page";

export default async function RoadmapPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // if (!profile || !profile.profile_completed) {
  //   return redirect("/protected/dashboard");
  // }

  // --- GANTI FUNGSI DI SINI ---

  // Panggil fungsi asli jika Anda ingin terhubung ke Gemini (gunakan saat produksi)
  // const roadmapData = await generateRoadmap(profile);

  // Panggil fungsi dummy untuk mempercepat pengembangan frontend
  const roadmapData = await generateDummyRoadmap(profile);

  // ---

  if (roadmapData.error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Gagal Membuat Roadmap
        </h1>
        <p className="text-slate-500 mt-2">{roadmapData.error}</p>
      </div>
    );
  }

  return (
    <RoadmapClientPage
      profile={{
        ...profile,
        preferred_career: "Software Engineer", // inject dummy
      }}
      roadmap={roadmapData.roadmap}
    />
  );
}
