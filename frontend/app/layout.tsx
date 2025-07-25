import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RoadmapProvider } from "./context/RoadmapContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jalur Mimpi - Peta Impian di Ujung Jari",
  description:
    "Ubah kebingungan belajar menjadi petualangan seru menuju cita-citamu. Jalur Mimpi menghubungkan setiap pelajaran dengan mimpimu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-screen">
      <body
        className={`${inter.className} h-full min-h-screen bg-white font-sans`}
      >
        <RoadmapProvider>
          <div className="flex h-full w-full flex-col">
            {/* Optional: fixed navbar if needed */}
            <Navbar />

            {/* Main content */}
            <main>{children}</main>
          </div>
        </RoadmapProvider>
      </body>
    </html>
  );
}
