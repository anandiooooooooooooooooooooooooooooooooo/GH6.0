/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analysis-modal.tsx

"use client";

import { getCareerSuggestions } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Briefcase,
  Cake,
  Heart,
  Loader2,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

type SkillLevel = "Dasar" | "Menengah" | "Mahir";
type Skill = { id: number | null; name: string; level: SkillLevel };
type CareerSuggestion = { career_name: string; career_description: string };

const educationLevels = [
  "SMA / SMK Sederajat",
  "Diploma (D1-D3)",
  "Sarjana (S1)",
  "Magister (S2)",
  "Doktor (S3)",
];
const genders = ["Pria", "Wanita"];

export function AnalysisModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [gender, setGender] = useState("");
  const [preferences, setPreferences] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);

  const [suggestedCareers, setSuggestedCareers] = useState<CareerSuggestion[]>(
    []
  );
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);

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

  const handleSaveAndSuggest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Pengguna tidak ditemukan.");

      const profileDataForSupabase = {
        user_id: user.id,
        name,
        age: parseInt(age, 10) || null,
        education_level: educationLevel,
        gender,
        skills,
        preferences,
        profile_completed: false,
      };

      // FIXED: onConflict sekarang menggunakan 'user_id' yang benar
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(profileDataForSupabase, { onConflict: "id" });

      if (upsertError)
        throw new Error(`Gagal menyimpan profil awal: ${upsertError.message}`);

      const profileDataForGemini = {
        name,
        age: parseInt(age, 10) || 0,
        education_level: educationLevel,
        gender,
        skills,
        preferences,
      };
      const data = await getCareerSuggestions(profileDataForGemini);

      if (data.error) throw new Error(data.error);
      if (!data.suggestions || data.suggestions.length === 0)
        throw new Error("Tidak ada rekomendasi yang diterima.");

      setSuggestedCareers(data.suggestions);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeOnboarding = async () => {
    if (!selectedCareer) {
      setError("Silakan pilih salah satu rekomendasi karier.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Pengguna tidak ditemukan.");

      const { error: finalUpdateError } = await supabase
        .from("profiles")
        .update({
          preferred_career: selectedCareer,
          profile_completed: true,
        })
        .eq("user_id", user.id);

      if (finalUpdateError)
        throw new Error(
          `Gagal menyelesaikan proses: ${finalUpdateError.message}`
        );

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const FormStep1 = (
    <motion.div
      key={1}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label className="flex items-center gap-2 text-md text-[#003664]">
            <User size={16} /> Nama Lengkap
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
          />
        </div>
        <div className="grid gap-2">
          <Label className="flex items-center gap-2 text-md text-[#003664]">
            <Cake size={16} /> Usia
          </Label>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Contoh: 21"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label className="flex items-center gap-2 text-md text-[#003664]">
            <Users size={16} /> Jenis Kelamin
          </Label>
          <Select onValueChange={setGender} value={gender}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label className="flex items-center gap-2 text-md text-[#003664]">
            <Briefcase size={16} /> Tingkat Pendidikan
          </Label>
          <Select onValueChange={setEducationLevel} value={educationLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Pendidikan Terakhir" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label className="flex items-center gap-2 text-md text-[#003664]">
          <Heart size={16} /> Preferensi & Minat
        </Label>
        <Textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Contoh: Suka bekerja dalam tim, menyukai tantangan visual..."
        />
      </div>
    </motion.div>
  );

  const FormStep2 = (
    <motion.div
      key={2}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="grid gap-1.5">
        <Label className="text-md text-[#003664]">Keahlian yang Dimiliki</Label>
        <Command className="border rounded-lg border-[#DAE0E4]">
          <CommandInput
            placeholder="Cari skill..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
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
            className="flex items-center justify-between gap-2 p-2 border rounded-md border-[#DAE0E4]"
          >
            <Badge
              variant="outline"
              className="bg-[#67C6E3]/20 text-[#2975A7] border-[#67C6E3]/50"
            >
              {skill.name}
            </Badge>
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
                className="h-8 w-8 text-slate-500 hover:bg-red-100 hover:text-red-600"
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

  const FormStep3 = (
    <motion.div
      key={3}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[#003664]">
          Rekomendasi Karier Untukmu
        </h3>
        <p className="text-sm text-[#2975A7]">
          Berdasarkan profilmu, berikut 3 karier yang paling sesuai. Silakan
          pilih satu.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {suggestedCareers.map((career) => (
          <button
            key={career.career_name}
            onClick={() => setSelectedCareer(career.career_name)}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 h-36 flex flex-col ${
              selectedCareer === career.career_name
                ? "border-[#67C6E3] bg-[#67C6E3]/10 ring-2 ring-[#67C6E3]/50"
                : "border-[#DAE0E4] hover:border-[#2975A7]"
            }`}
          >
            <span className="font-bold text-lg text-[#003664]">
              {career.career_name}
            </span>
            <span className="text-xs text-[#2975A7] mt-1">
              {career.career_description}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 border-[#DAE0E4] bg-white">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-[#003664] flex items-center gap-3">
            <Sparkles className="text-[#67C6E3]" />
            Lengkapi Profil Anda
          </DialogTitle>
          <DialogDescription className="text-md text-[#2975A7]">
            Langkah {step} dari 3:{" "}
            {step === 1
              ? "Profil Dasar"
              : step === 2
              ? "Inventaris Keahlian"
              : "Pilih Karier"}
          </DialogDescription>
          <Progress
            value={(step / 3) * 100}
            className="mt-4 h-2 [&>*]:bg-[#67C6E3]"
          />
        </DialogHeader>
        <div className="px-6 py-2 h-[450px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && FormStep1}
            {step === 2 && FormStep2}
            {step === 3 && FormStep3}
          </AnimatePresence>
        </div>
        <div className="flex justify-between p-6 bg-slate-50/50 border-t border-[#DAE0E4]">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="border-[#DAE0E4] text-[#2975A7]"
          >
            Kembali
          </Button>
          {step === 1 && (
            <Button
              onClick={() => setStep(2)}
              className="bg-[#2975A7] text-white hover:bg-[#003664]"
            >
              Lanjut ke Keahlian
            </Button>
          )}
          {step === 2 && (
            <Button
              onClick={handleSaveAndSuggest}
              disabled={isLoading}
              className="bg-[#2975A7] text-white hover:bg-[#003664]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Menganalisis...
                </>
              ) : (
                "Dapatkan Rekomendasi"
              )}
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleFinalizeOnboarding}
              disabled={isLoading || !selectedCareer}
              className="bg-[#67C6E3] text-white hover:bg-[#2975A7]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Simpan Profil & Lanjutkan"
              )}
            </Button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 px-6 pb-4 text-center">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
