"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// UPDATED: Daftar karier disederhanakan, hanya berisi judul dan gambar baru yang relevan
const careers = [
  {
    title: "UI/UX Designer",
    image:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=800",
  },
  {
    title: "Digital Marketer",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800",
  },
  {
    title: "Dokter",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800",
  },
  {
    title: "Arsitek",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800",
  },
  {
    title: "Psikolog",
    image:
      "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800",
  },
  {
    title: "Project Manager",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
  },
  {
    title: "Content Creator",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800",
  },
  {
    title: "Ahli Gizi",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17025?q=80&w=800",
  },
  {
    title: "Insinyur Sipil",
    image:
      "https://images.unsplash.com/photo-1581092580497-909141b7d5e9?q=80&w=800",
  },
  {
    title: "Pengacara",
    image:
      "https://images.unsplash.com/photo-1505664194779-8be390b75058?q=80&w=800",
  },
  {
    title: "Programmer",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800",
  },
  {
    title: "Desainer Grafis",
    image:
      "https://images.unsplash.com/photo-1609923281222-ce8a72e73a78?q=80&w=800",
  },
  {
    title: "Akuntan",
    image:
      "https://images.unsplash.com/photo-1613435468653-61e3557523a3?q=80&w=800",
  },
  {
    title: "Chef",
    image:
      "https://images.unsplash.com/photo-1595424248211-e421c0b31e13?q=80&w=800",
  },
];

export const CareerCarousel = ({ search }: { search: string }) => {
  const filteredCareers = careers.filter((career) =>
    career.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="overflow-x-auto overflow-y-hidden bg-white scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      <div className="flex gap-4 w-max p-4">
        {filteredCareers.map((career, i) => (
          <motion.div
            key={career.title}
            className="min-w-[250px] bg-white shadow-md rounded-xl p-4 border border-slate-100 hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <div className="relative w-full h-36 rounded-lg mb-2 overflow-hidden">
              <Image
                src={career.image}
                alt={career.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mt-4">
              {career.title}
            </h3>
            {/* DELETED: Paragraf untuk 'role' telah dihapus */}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
