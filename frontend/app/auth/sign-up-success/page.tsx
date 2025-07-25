import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const accentColor = "#67C6E3";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <Card className="bg-white border-[#DAE0E4] shadow-2xl shadow-[#2975A7]/20">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <MailCheck className="size-16" style={{ color: accentColor }} />
            </div>
            <CardTitle className="text-2xl text-[#003664]">
              Thank you for signing up!
            </CardTitle>
            <CardDescription className="!mt-2 text-[#2975A7]">
              Please check your email to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#2975A7]">
              We&apos;ve sent a confirmation link to your inbox. You&apos;ll
              need to click it before you can log in.
            </p>
          </CardContent>
          {/* NEW: Added a footer with a link back to the login page */}
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
