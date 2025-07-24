"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export const Navbar = () => (
  <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Jalur Mimpi</h1>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#fitur"
          className="text-slate-600 hover:text-blue-600 font-medium"
        >
          Fitur
        </a>
        <a
          href="#cara-kerja"
          className="text-slate-600 hover:text-blue-600 font-medium"
        >
          Cara Kerja
        </a>
        <a
          href="#kisah"
          className="text-slate-600 hover:text-blue-600 font-medium"
        >
          Kisah
        </a>
      </div>
      <Link href={"/auth/sign-up"}>
        <motion.button
          className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
      </Link>
    </div>
  </nav>
);
