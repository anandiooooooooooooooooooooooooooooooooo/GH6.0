import { Heart } from "lucide-react";

export const Footer = () => (
  <footer className="bg-slate-900 text-white py-16">
    <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Jalur Mimpi</h3>
        <p className="text-slate-400">
          Peta Impian di Ujung Jari. Dibangun dengan{" "}
          <Heart className="inline w-4 h-4 text-red-500" /> di Tangerang
          Selatan.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Navigasi</h3>
        <ul className="space-y-2">
          <li>
            <a href="#fitur" className="text-slate-400 hover:text-white">
              Fitur
            </a>
          </li>
          <li>
            <a href="#cara-kerja" className="text-slate-400 hover:text-white">
              Cara Kerja
            </a>
          </li>
          <li>
            <a href="#kisah" className="text-slate-400 hover:text-white">
              Kisah
            </a>
          </li>
          <li>
            <a href="#faq" className="text-slate-400 hover:text-white">
              FAQ
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Dukungan</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-slate-400 hover:text-white">
              Hubungi Kami
            </a>
          </li>
          <li>
            <a href="#" className="text-slate-400 hover:text-white">
              Kebijakan Privasi
            </a>
          </li>
          <li>
            <a href="#" className="text-slate-400 hover:text-white">
              Syarat & Ketentuan
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Tetap Terhubung</h3>
        <p className="text-slate-400 mb-4">Dapatkan info terbaru dari kami.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Email kamu"
            className="w-full rounded-l-lg px-3 py-2 text-slate-800 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">
            Go
          </button>
        </div>
      </div>
    </div>
    <div className="text-center text-slate-500 mt-12 border-t border-slate-700 pt-8">
      &copy; {new Date().getFullYear()} Jalur Mimpi. Sebuah Proyek untuk
      Memajukan Pendidikan Indonesia.
    </div>
  </footer>
);
