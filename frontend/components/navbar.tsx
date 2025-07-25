"use client";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, UserCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// NEW: Dua set link navigasi untuk status login yang berbeda
const guestNavLinks = [
  { title: "Fitur", href: "#fitur" },
  { title: "Cara Kerja", href: "#cara-kerja" },
  { title: "Kisah", href: "#kisah" },
];
const userNavLinks = [
  { title: "Dashboard", href: "/protected/dashboard" },
  { title: "Roadmap Saya", href: "/roadmap" },
  { title: "Eksplorasi", href: "/explore" },
];

// Reusable NavLink component
const NavLink = ({ title, href }: { title: string; href: string }) => (
  <Link
    href={href}
    className="relative font-medium text-[#2975A7] transition-colors hover:text-[#003664]"
  >
    {title}
    <motion.span
      className="absolute bottom-[-5px] left-0 h-[2px] w-full bg-[#67C6E3]"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1, originX: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
  </Link>
);

// Helper untuk mendapatkan inisial dari email
const getInitials = (email: string) => {
  return email?.substring(0, 2).toUpperCase() || "P";
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    router.push("/");
  };

  const navLinks = user ? userNavLinks : guestNavLinks;

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#DAE0E4]/80">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/images/jalur-mimpi-logo.png"
            alt="Jalur Mimpi Logo"
            width={150}
            height={50}
            className="h-6 w-auto"
          />
        </Link>

        {/* UPDATED: Navigasi dinamis */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink key={link.title} {...link} />
          ))}
        </div>

        {/* UPDATED: Tombol login/register diganti dengan menu profil */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-10 animate-pulse bg-slate-200 rounded-full" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-[#003664] text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#67C6E3]"
              >
                {getInitials(user.email!)}
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#DAE0E4]/80 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-[#DAE0E4]/80">
                      <p className="text-sm text-[#2975A7]">Signed in as</p>
                      <p className="font-semibold text-sm text-[#003664] truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#003664] rounded-md hover:bg-slate-100">
                          <UserCircle size={16} /> Profil Saya
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href={"/auth/login"}>
                <motion.button className="border border-[#2975A7] text-[#2975A7] font-semibold px-5 py-2 rounded-xl hover:bg-[#2975A7] hover:text-white transition-colors">
                  Login
                </motion.button>
              </Link>
              <Link href={"/auth/sign-up"}>
                <motion.button className="bg-gradient-to-r from-[#67C6E3] to-[#2975A7] text-white font-semibold px-5 py-2 rounded-xl hover:shadow-lg hover:shadow-[#67C6E3]/40 transition-shadow">
                  Register
                </motion.button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? (
              <X size={24} className="text-[#003664]" />
            ) : (
              <Menu size={24} className="text-[#003664]" />
            )}
          </button>
        </div>
      </div>

      {/* UPDATED: Menu mobile juga dinamis */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden bg-white/95 absolute top-full left-0 w-full border-t border-[#DAE0E4]/80 shadow-lg"
          >
            <div className="flex flex-col gap-6 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-[#003664] font-semibold text-lg text-center"
                >
                  {link.title}
                </a>
              ))}
              <hr className="border-[#DAE0E4]/80" />
              <div className="flex flex-col items-center gap-4">
                {isLoading ? (
                  <div className="h-10 w-24 animate-pulse bg-slate-200 rounded-xl" />
                ) : user ? (
                  <>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <button className="w-full font-semibold text-lg text-[#003664]">
                        Profil Saya
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full font-semibold text-lg text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={"/auth/login"}>
                      <button className="w-full font-semibold text-lg text-[#003664]">
                        Login
                      </button>
                    </Link>
                    <Link href={"/auth/sign-up"}>
                      <button className="w-full bg-gradient-to-r from-[#67C6E3] to-[#2975A7] text-white font-semibold px-8 py-3 rounded-xl">
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
