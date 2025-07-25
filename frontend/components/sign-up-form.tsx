"use client";

import { KeyRound, Loader2, Mail, Quote } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function SignUpForm({ className }: React.ComponentProps<"div">) {
  const accentColor = "#67C6E3";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // UPDATED: Redirect to a success page instead of showing a message.
      router.push("/auth/sign-up-success");
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      <style>{`.focus-accent-ring:focus { --tw-ring-color: ${accentColor} !important; }`}</style>
      <Card className="overflow-hidden rounded-2xl border-[#DAE0E4] bg-white shadow-2xl shadow-[#2975A7]/20 p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <div className="p-6 md:p-10">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold text-[#003664]">
                  Create an account
                </h1>
                <p className="text-[#2975A7] text-balance">
                  Register to start your journey.
                </p>
              </div>

              {error && (
                <div className="bg-red-100/80 border border-red-300 text-red-800 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-100/80 border border-green-300 text-green-800 p-3 rounded-md text-sm">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[#003664]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#67C6E3]/80" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || !!successMessage}
                      className="focus-accent-ring border-[#DAE0E4] bg-white pl-10 text-[#003664] placeholder:text-[#2975A7]/60 focus:ring-2"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[#003664]">
                    Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#67C6E3]/80" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || !!successMessage}
                      className="focus-accent-ring border-[#DAE0E4] bg-white pl-10 text-[#003664] placeholder:text-[#2975A7]/60 focus:ring-2"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-[#003664]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#67C6E3]/80" />
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading || !!successMessage}
                      className="focus-accent-ring border-[#DAE0E4] bg-white pl-10 text-[#003664] placeholder:text-[#2975A7]/60 focus:ring-2"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !!successMessage}
                  className="mt-2 w-full py-6 text-base text-white hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin text-white" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-[#003664]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: accentColor }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative hidden items-end bg-[#CCC1B8] p-8 md:flex">
            <Image
              src="https://images.unsplash.com/photo-1543732585-635a64386e81?q=80&w=1965&auto=format&fit=crop"
              alt="Colorful buildings"
              className="absolute inset-0 h-full w-full object-cover"
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2975A7]/80 to-[#67C6E3]/70" />
            <div className="relative z-10 text-white">
              <Quote className="mb-4 size-10 fill-white/80 text-white/80" />
              <blockquote className="text-xl font-semibold">
                &quot;The future belongs to those who believe in the beauty of
                their dreams.&quot;
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
