"use client";

import { KeyRound, Loader2, Mail, Quote, Triangle } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function SignUpForm({ className }: React.ComponentProps<"div">) {
  const accentColor = "#FF3402";
  // `useState` hooks are used to manage the component's internal memory (state).
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  // This function is called when the user clicks the "Create Account" button.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from reloading.
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation to check if passwords match.
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Send the form data to our backend API endpoint.
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    // Handle success or error responses from the backend.
    if (!response.ok) {
      setError(data.error || "Registration failed.");
    } else {
      setSuccessMessage(data.message);
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
                  Create an account
                </h1>
                <p className="text-stone-500 text-balance">
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
                  <Label htmlFor="email" className="text-stone-600">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || !!successMessage}
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
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || !!successMessage}
                      className="focus-accent-ring border-stone-300 bg-[#FEFEFE] pl-10 text-stone-800 focus:ring-2"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-stone-600">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading || !!successMessage}
                      className="focus-accent-ring border-stone-300 bg-[#FEFEFE] pl-10 text-stone-800 focus:ring-2"
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
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-stone-600">
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
