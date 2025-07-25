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
    <html lang="id">
      <body className={`${inter.className} bg-white font-sans`}>
        <RoadmapProvider>{children}</RoadmapProvider>
      </body>
    </html>
  );
}
