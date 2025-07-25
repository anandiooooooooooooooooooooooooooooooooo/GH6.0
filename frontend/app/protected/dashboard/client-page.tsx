"use client";

import Dashboard from "@/components/dashboard";
import { AnalysisModal } from "@/components/user-profile-modal";
import { useCallback, useEffect, useState } from "react";

type Props = {
  userFullName: string;
  hasCompletedOnboarding: boolean;
};

export function DashboardClientPage({
  userFullName,
  hasCompletedOnboarding,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setIsModalOpen(true);
    }
  }, [hasCompletedOnboarding]);

  const handleOnboardingComplete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Dashboard
        userFullName={userFullName}
        onReanalyze={() => setIsModalOpen(true)}
      />{" "}
      {/* This line is correct, the error is in the Dashboard component definition */}
      <AnalysisModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleOnboardingComplete}
      />
    </>
  );
}
