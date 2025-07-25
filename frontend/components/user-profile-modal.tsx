"use client";

import { useRoadmap } from "@/app/context/RoadmapContext"; // ✅ Impor custom hook kita
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ Impor useRouter untuk redirect
import { useCallback, useEffect, useState } from "react";

const supabase = createClient(); // ✅ Inisialisasi Supabase client

// Tipe data
type SkillLevel = "Dasar" | "Menengah" | "Mahir";
type Skill = { id: number | null; name: string; level: SkillLevel };

// === Komponen Utama Modal ===
export function AnalysisModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter(); // Inisialisasi router
  const {
    setAnalysis,
    setRoadmap,
    setIsLoading: setGlobalLoading,
  } = useRoadmap(); // Gunakan state dari context

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk form
  const [fullName, setFullName] = useState("Siti Aisyah");
  const [background, setBackground] = useState("Fresh Graduate S1 Desain");
  const [experience, setExperience] = useState(
    "Membuat beberapa desain logo dan postingan media sosial."
  );
  const [targetProfession, setTargetProfession] = useState("UI/UX Designer");
  const [skills, setSkills] = useState<Skill[]>([
    { id: null, name: "Figma", level: "Menengah" },
    { id: null, name: "Canva", level: "Mahir" },
  ]);

  // State untuk Autocomplete
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);

  // (Fungsi addSkill, removeSkill, updateSkillLevel, debouncedSearch tetap sama seperti sebelumnya...)
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase.rpc("search_skills", {
        search_term: query,
      });
      setSuggestions(data || []);
    }, 300),
    []
  );
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  const addSkill = (skill: { id: number | null; name: string }) => {
    if (
      !skills.find((s) => s.name.toLowerCase() === skill.name.toLowerCase())
    ) {
      setSkills([...skills, { ...skill, level: "Dasar" }]);
    }
    setSearchTerm("");
  };
  const removeSkill = (skillName: string) =>
    setSkills(skills.filter((s) => s.name !== skillName));
  const updateSkillLevel = (skillName: string, level: SkillLevel) =>
    setSkills(skills.map((s) => (s.name === skillName ? { ...s, level } : s)));

  const handleAnalyzeAndRedirect = async () => {
    setIsLoading(true);
    setGlobalLoading(true); // Set loading global untuk halaman roadmap
    setError(null);
    try {
      // 1. Panggil Analisis Kesenjangan
      const analysisRes = await fetch("http://localhost:8000/gap-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_profession: targetProfession,
          current_skills: skills,
          background: background,
          experience: experience,
        }),
      });
      if (!analysisRes.ok) throw new Error("Gagal saat analisis kesenjangan.");
      const analysisData = await analysisRes.json();
      setAnalysis(analysisData); // Simpan hasil ke context global

      // 2. Panggil Generator Roadmap
      if (analysisData.gap_skills?.length > 0) {
        const roadmapRes = await fetch("http://localhost:8000/the-bridge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_profession: targetProfession,
            background: background,
            skill_gaps: analysisData.gap_skills,
          }),
        });
        if (!roadmapRes.ok) throw new Error("Gagal saat membuat roadmap.");
        const roadmapData = await roadmapRes.json();
        setRoadmap(roadmapData); // Simpan hasil ke context global
      }

      onOpenChange(false); // Tutup modal
      router.push("/roadmap"); // ✅ Lakukan redirect ke halaman roadmap
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false); // Hentikan loading lokal jika error
      setGlobalLoading(false); // Hentikan loading global jika error
    }
  };

  const FormStep1 = (
    <motion.div
      key={1}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="grid gap-1.5">
        <Label>Nama Lengkap</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label>Latar Belakang</Label>
        <Input
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Pengalaman</Label>
        <Textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Profesi Tujuan</Label>
        <Input
          value={targetProfession}
          onChange={(e) => setTargetProfession(e.target.value)}
        />
      </div>
    </motion.div>
  );

  const FormStep2 = (
    <motion.div
      key={2}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="grid gap-1.5">
        <Label>Inventaris Keahlian</Label>
        <Command className="border rounded-lg">
          <CommandInput
            placeholder="Cari skill..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            {suggestions.map((s) => (
              <CommandItem key={s.id} onSelect={() => addSkill(s)}>
                {s.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between gap-2 p-2 border rounded-md"
          >
            <Badge variant="outline">{skill.name}</Badge>
            <div className="flex items-center gap-2">
              <Select
                value={skill.level}
                onValueChange={(v: SkillLevel) =>
                  updateSkillLevel(skill.name, v)
                }
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dasar">Dasar</SelectItem>
                  <SelectItem value="Menengah">Menengah</SelectItem>
                  <SelectItem value="Mahir">Mahir</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeSkill(skill.name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Langkah {step} dari 2:{" "}
            {step === 1 ? "Profil Anda" : "Keahlian Anda"}
          </DialogTitle>
          <Progress value={step * 50} className="mt-2" />
        </DialogHeader>
        <div className="py-6">
          <AnimatePresence mode="wait">
            {step === 1 ? FormStep1 : FormStep2}
          </AnimatePresence>
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={step === 1}
          >
            Kembali
          </Button>
          {step === 1 && <Button onClick={() => setStep(2)}>Lanjut</Button>}
          {step === 2 && (
            <Button onClick={handleAnalyzeAndRedirect} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Menganalisis...
                </>
              ) : (
                <>Selesai & Lihat Roadmap</>
              )}
            </Button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
