// app/protected/dashboard/client-page.tsx (INI ISINYA)

"use client";

import Dashboard from "@/components/dashboard";
import { AnalysisModal } from "@/components/user-profile-modal";
import { useEffect, useState } from "react";

type Props = {
  userFullName: string;
  hasCompletedOnboarding: boolean;
};

export function DashboardClientPage({
  userFullName,
  hasCompletedOnboarding,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tidak ada lagi pengambilan data di sini, karena data sudah diterima dari props.
  useEffect(() => {
    // Langsung cek props, jika onboarding belum selesai, buka modal.
    if (!hasCompletedOnboarding) {
      setIsModalOpen(true);
    }
  }, [hasCompletedOnboarding]);

  const handleOnboardingComplete = () => {
    setIsModalOpen(false);
    // Di sini kita bisa mengasumsikan UI akan update
    // atau melakukan refresh halaman
  };

  return (
    <>
      <Dashboard userFullName={userFullName} />
      <AnalysisModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleOnboardingComplete}
      />
    </>
  );
}
