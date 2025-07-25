"use client";
import { motion } from "framer-motion";

const careers = [
  { title: "Dokter", image: "/images/dokter.jpg" },
  { title: "Arsitek", image: "/images/arsitek.jpg" },
  { title: "Guru", image: "/images/guru.jpg" },
  { title: "Programmer", image: "/images/programmer.jpg" },
  { title: "Pilot", image: "/images/pilot.jpg" },
  { title: "Seniman", image: "/images/seniman.jpg" },
  { title: "Chef", image: "/images/chef.jpg" },
];

export const CareerCarousel = ({ search }: { search: string }) => {
  const filteredCareers = careers.filter((career) =>
    career.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="overflow-x-auto bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      <div className="flex gap-4 w-max">
        {filteredCareers.map((career, i) => (
          <motion.div
            key={career.title}
            className="min-w-[250px] bg-white shadow-md rounded-xl p-4 border border-slate-100 hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
          >
            <img
              src={career.image}
              alt={career.title}
              className="w-full h-36 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold text-slate-800">
              {career.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Jelajahi karier sebagai {career.title.toLowerCase()}.
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
