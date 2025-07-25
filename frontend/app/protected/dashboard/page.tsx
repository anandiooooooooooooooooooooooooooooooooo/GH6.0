// app/protected/dashboard/page.tsx

"use client";

import { AnalysisModal } from "@/components/user-profile-modal";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Map, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Komponen UI untuk Dashboard
function Dashboard({
  userFullName,
  onReanalyze,
}: {
  userFullName: string;
  onReanalyze: () => void;
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen w-full">
      <main className="container mx-auto px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#003664]">
            Selamat Datang, {userFullName}!
          </h1>
          <p className="mt-2 text-lg text-[#2975A7]">
            Semua yang kamu butuhkan untuk meraih mimpimu ada di sini.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={cardVariants}>
            <Link href="/roadmap">
              <div className="h-full bg-white p-8 rounded-2xl shadow-xl shadow-[#2975A7]/10 border border-[#DAE0E4]/80 hover:border-[#67C6E3] hover:scale-105 transition-all cursor-pointer">
                <div className="bg-[#67C6E3]/20 p-3 rounded-full w-fit mb-4">
                  <Map className="size-8 text-[#67C6E3]" />
                </div>
                <h3 className="text-xl font-semibold text-[#003664]">
                  Peta Jalan Saya
                </h3>
                <p className="mt-1 text-[#2975A7]">
                  Lihat, kelola, dan lacak kemajuan pada peta jalan karier yang
                  dibuat khusus untukmu.
                </p>
              </div>
            </Link>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Link href="/profile">
              <div className="h-full bg-white p-8 rounded-2xl shadow-xl shadow-[#2975A7]/10 border border-[#DAE0E4]/80 hover:border-[#2975A7] hover:scale-105 transition-all cursor-pointer">
                <div className="bg-[#2975A7]/20 p-3 rounded-full w-fit mb-4">
                  <User className="size-8 text-[#2975A7]" />
                </div>
                <h3 className="text-xl font-semibold text-[#003664]">
                  Profil Saya
                </h3>
                <p className="mt-1 text-[#2975A7]">
                  Perbarui biodata, pengalaman, dan keahlianmu agar peta jalan
                  tetap relevan.
                </p>
              </div>
            </Link>
          </motion.div>
          <motion.div variants={cardVariants} onClick={onReanalyze}>
            <div className="h-full bg-white p-8 rounded-2xl shadow-xl shadow-[#2975A7]/10 border border-[#DAE0E4]/80 hover:border-[#003664] hover:scale-105 transition-all cursor-pointer">
              <div className="bg-[#003664]/20 p-3 rounded-full w-fit mb-4">
                <RefreshCw className="size-8 text-[#003664]" />
              </div>
              <h3 className="text-xl font-semibold text-[#003664]">
                Analisis Ulang
              </h3>
              <p className="mt-1 text-[#2975A7]">
                Merasa ada yang berubah? Lakukan analisis ulang untuk
                mendapatkan rekomendasi terbaru.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

// Komponen utama halaman yang berisi logika
export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(
    null
  );
  const [userFullName, setUserFullName] = useState("Pengguna");
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, profile_completed")
        .eq("user_id", user.id)
        .single();
      const onboardingStatus = profile?.profile_completed || false;

      setProfileCompleted(onboardingStatus);
      setUserFullName(profile?.name || "Pengguna Baru");

      if (!onboardingStatus) {
        setIsModalOpen(true);
      }
      setIsLoading(false);
    };
    checkUserStatus();
  }, [router]);

  const handleOnboardingComplete = () => {
    setIsModalOpen(false);
    setProfileCompleted(true);
    // Refresh halaman untuk memastikan data nama terbaru ditampilkan
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#003664]" />
      </div>
    );
  }

  return (
    <>
      <Dashboard
        userFullName={userFullName}
        onReanalyze={() => setIsModalOpen(true)}
      />
      <AnalysisModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleOnboardingComplete}
      />
    </>
  );
}
