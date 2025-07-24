"use client";
import { motion } from "framer-motion";

export const Hero = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void;
}) => {
  return (
    <section
      className="text-center pt-20"
      style={{
        background: "linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%)",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-center">
          <motion.p className="bg-white w-fit px-4 py-1 rounded-xl mb-4">
            Your #1 Platform for Finding Your Dream Career
          </motion.p>
        </div>
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Peta Impian di Ujung Jari
        </motion.h1>
        <motion.p
          className="text-slate-700 mt-6 mb-8 mx-auto text-lg max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          Create your profile, showcase your skills, and let employers find you.
        </motion.p>

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-2">
          <motion.div>
            <input
              type="text"
              placeholder="Cari cita-cita atau pelajaran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-6 py-2 rounded-3xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </motion.div>
          <motion.button
            className="bg-blue-500 text-white px-6 py-2 rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>
      </div>
    </section>
  );
};
