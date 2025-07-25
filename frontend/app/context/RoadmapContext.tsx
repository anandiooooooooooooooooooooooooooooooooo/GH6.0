"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

// Tipe untuk data yang akan kita simpan
type AnalysisResult = unknown;
type RoadmapResult = unknown;

// Tipe untuk nilai yang akan disediakan oleh Context
interface RoadmapContextType {
  analysis: AnalysisResult | null;
  roadmap: RoadmapResult | null;
  setAnalysis: Dispatch<SetStateAction<AnalysisResult | null>>;
  setRoadmap: Dispatch<SetStateAction<RoadmapResult | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

// Buat Context dengan nilai default
const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

// Buat Provider Component
export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const value = {
    analysis,
    roadmap,
    setAnalysis,
    setRoadmap,
    isLoading,
    setIsLoading,
  };

  return (
    <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
  );
}

// Buat custom hook untuk kemudahan penggunaan
export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error("useRoadmap must be used within a RoadmapProvider");
  }
  return context;
}
