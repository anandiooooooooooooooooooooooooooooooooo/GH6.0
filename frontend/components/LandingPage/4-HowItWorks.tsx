"use client";
import { motion } from "framer-motion";
import { BrainCircuit, FileText, LogIn, Sparkles } from "lucide-react";

// Data untuk menjelaskan alur proses yang baru
const processSteps = [
  {
    icon: LogIn,
    bgColor: "bg-[#67C6E3]",
    title: "Masuk atau Buat Akun",
    description:
      "Mulai dengan masuk ke akunmu atau daftar jika kamu pengguna baru untuk membuka semua fitur.",
  },
  {
    icon: FileText,
    bgColor: "bg-[#2975A7]",
    title: "Isi Biodata & Minat",
    description:
      "Ceritakan tentang dirimu, keahlian, dan apa yang kamu sukai. Ini membantu AI kami mengenalimu.",
  },
  {
    icon: BrainCircuit,
    bgColor: "bg-[#003664]",
    title: "AI Membuatkan Peta Jalan",
    description:
      "Sistem AI canggih kami akan menganalisis datamu dan membuatkan jalur karier yang paling cocok untukmu.",
  },
  {
    icon: Sparkles,
    bgColor: "bg-[#67C6E3]",
    title: "Tanya & Eksplorasi",
    description:
      "Gunakan fitur chat untuk bertanya pada AI, perdalam pemahamanmu, dan sesuaikan rencana kariermu.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="cara-kerja"
      className="py-20 sm:py-32 bg-slate-50/70 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Judul Sesi */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003664]">
            Perjalananmu Dimulai di Sini
          </h2>
          <p className="mt-4 text-lg text-[#2975A7]">
            Lihat bagaimana AI kami mengubah minatmu menjadi sebuah rencana
            karier yang jelas, langkah demi langkah.
          </p>
        </div>

        {/* Kontainer untuk Langkah-langkah */}
        <div className="relative flex flex-col gap-12 md:gap-20">
          {processSteps.map((step, index) => {
            const isOdd = index % 2 !== 0;
            // Varian animasi untuk efek geser dari kiri atau kanan
            const variants = {
              hidden: { opacity: 0, x: isOdd ? 100 : -100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            };

            return (
              <motion.div
                key={step.title}
                className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 ${
                  isOdd ? "md:flex-row-reverse" : "md:flex-row"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Nomor Langkah di Latar Belakang */}
                <h3 className="hidden md:block text-8xl lg:text-9xl font-bold text-[#DAE0E4]/60 select-none">
                  0{index + 1}
                </h3>

                {/* Kartu Konten */}
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex items-center gap-5 border border-[#DAE0E4]/60">
                  <div
                    className={`flex-shrink-0 p-3 rounded-full ${step.bgColor}`}
                  >
                    <step.icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#003664]">
                      {step.title}
                    </h4>
                    <p className="text-sm text-[#2975A7] mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
