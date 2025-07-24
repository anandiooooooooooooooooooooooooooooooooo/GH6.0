"use client";

import { KeyRound, Loader2, Mail, Quote, Triangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client"; // ✅ Client-side Supabase
import { cn } from "@/lib/utils";

import Image from "next/image";

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const accentColor = "#FF3402";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const supabase = createClient(); // ✅ Client Supabase client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
    } else {
      router.push("/pages/dashboard");
      router.refresh();
    }

    setIsLoading(false);
  };

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      <style>{`.focus-accent-ring:focus { --tw-ring-color: ${accentColor} !important; }`}</style>
      <Card className="overflow-hidden rounded-2xl border-stone-200 bg-[#FAF8F4] shadow-2xl shadow-stone-300/50">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className="mb-2 flex items-center gap-2 text-xl font-bold"
                  style={{ color: accentColor }}
                >
                  <Triangle className="size-6 fill-current" />
                  <span>Jalur Mimpi</span>
                </div>
                <h1 className="text-3xl font-bold text-stone-800">
                  Welcome back
                </h1>
                <p className="text-stone-500 text-balance">
                  Login to continue your journey.
                </p>
              </div>

              {error && (
                <div className="bg-red-100/80 border border-red-300 text-red-800 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-stone-600">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="focus-accent-ring border-stone-300 bg-[#FEFEFE] pl-10 text-stone-800 placeholder:text-stone-400 focus:ring-2"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-stone-600">
                    Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="focus-accent-ring border-stone-300 bg-[#FEFEFE] pl-10 text-stone-800 placeholder:text-stone-400 focus:ring-2"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full py-6 text-base text-white hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
              </form>

              <div className="text-center text-sm text-stone-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: accentColor }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative hidden items-end p-8 md:flex">
            <Image
              src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1974&auto=format&fit=crop"
              alt="Starry night sky"
              className="absolute inset-0 h-full w-full object-cover"
              width={1000}
              height={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative z-10 text-white">
              <Quote className="mb-4 size-10 fill-white/80 text-white/80" />
              <blockquote className="text-xl font-semibold">
                &quot;Masa depan adalah milik mereka yang percaya pada keindahan
                mimpi mereka.&quot;
              </blockquote>
              <footer className="mt-2 text-sm text-white/80">
                - Eleanor Roosevelt
              </footer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
