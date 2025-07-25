"use client";

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
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function ConceptExplainer() {
  const [concept, setConcept] = useState("API");
  const [background, setBackground] = useState("Akuntansi");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!concept || !background) {
      alert("Mohon isi kedua field!");
      return;
    }
    setIsLoading(true);
    setExplanation("");

    try {
      const response = await fetch("http://localhost:8000/explain-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept, background }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan penjelasan dari server.");
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error(error);
      setExplanation("Maaf, terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
          Penerjemah Konsep Hiper-Personal
        </CardTitle>
        <CardDescription>
          Bingung dengan istilah teknis? Biarkan &quot;Kang Jelasin&quot;
          membantu Anda dengan analogi yang sesuai latar belakang Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="concept">Konsep Teknis</Label>
          <Input
            type="text"
            id="concept"
            placeholder="Contoh: API, Git, Docker"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="background">Latar Belakang Anda</Label>
          <Input
            type="text"
            id="background"
            placeholder="Contoh: Akuntansi, Desainer, Koki"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>
        {explanation && (
          <div className="p-4 mt-4 border rounded-md bg-muted">
            <p className="text-sm whitespace-pre-wrap">{explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleExplain} disabled={isLoading}>
          {isLoading ? "Sedang Berpikir..." : "Jelaskan Sekarang!"}
        </Button>
      </CardFooter>
    </Card>
  );
}
