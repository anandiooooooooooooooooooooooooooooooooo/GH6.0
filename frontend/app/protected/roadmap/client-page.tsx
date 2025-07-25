// app/roadmap/client-page.tsx

"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Flag, Rocket } from "lucide-react";

// Tipe data untuk menjaga konsistensi
type Milestone = {
  title: string;
  description: string;
  duration: string;
};

type Phase = {
  phase: string;
  milestones: Milestone[];
};

type Profile = {
  name: string;
  preferred_career: string;
};

export function RoadmapClientPage({
  profile,
  roadmap,
}: {
  profile: Profile;
  roadmap: Phase[];
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="w-full bg-[#CCC1B8]/30 min-h-screen">
      <main className="container mx-auto px-6 py-24 sm:py-32">
        {/* Header Halaman */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#003664]">
            Peta Jalan Kariermu
          </h1>
          <p className="mt-4 text-lg md:text-xl text-[#2975A7]">
            Langkah-langkah yang disiapkan AI untukmu menjadi{" "}
            <span className="font-bold text-[#003664]">
              {profile.preferred_career}
            </span>
            .
          </p>
        </motion.div>

        {/* Timeline Roadmap */}
        <motion.div
          className="relative pl-8 md:pl-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Garis Vertikal Timeline */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DAE0E4] rounded-full md:left-2"></div>

          {roadmap.map((phase, phaseIndex) => (
            <motion.div
              key={phase.phase}
              className="mb-12"
              variants={itemVariants}
            >
              {/* Titik Fase pada Timeline */}
              <div className="absolute -left-4 md:left-0 size-8 bg-[#2975A7] rounded-full border-4 border-white flex items-center justify-center">
                <Flag className="size-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#003664] ml-2">
                {phase.phase}
              </h2>

              {/* Kartu Milestone */}
              <div className="mt-6 space-y-6">
                {phase.milestones.map((milestone) => (
                  <motion.div
                    key={milestone.title}
                    className="relative pl-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Garis Horizontal ke Milestone */}
                    <div className="absolute left-[-28px] md:left-[-36px] top-3 w-7 md:w-9 h-[2px] bg-[#DAE0E4]"></div>
                    {/* Titik Milestone */}
                    <div className="absolute left-[-34px] md:left-[-42px] top-1.5 size-5 bg-white rounded-full border-4 border-[#67C6E3]"></div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#DAE0E4]/60">
                      <h3 className="font-bold text-lg text-[#003664] flex items-center gap-2">
                        <CheckCircle className="size-5 text-[#67C6E3]" />
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-[#2975A7]">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-sm font-medium text-[#2975A7]">
                        <Clock className="size-4" />
                        <span>Estimasi: {milestone.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Bagian Akhir Timeline */}
          <motion.div variants={itemVariants}>
            <div className="absolute -left-4 md:left-0 size-8 bg-[#67C6E3] rounded-full border-4 border-white flex items-center justify-center">
              <Rocket className="size-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#003664] ml-2">
              Mimpi Tercapai!
            </h2>
            <p className="mt-2 text-[#2975A7] ml-2">
              Lanjutkan perjalanan belajarmu dan terus berkembang.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
