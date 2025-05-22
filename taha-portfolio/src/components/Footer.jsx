import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from "react-icons/fa";

export default function Footer({ darkMode, lang }) {
  const [footerVeri, setFooterVeri] = useState(null);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const veri = await yanit.json();
        setFooterVeri(veri.footer);
      } catch (error) {
        console.error("Footer verisi alınamadı:", error);
      }
    };

    veriGetir();
  }, [lang]);

  return (
    <footer
      className={`py-10 mt-0 w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-800 text-white" : "bg-indigo-800 text-white"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {/* Sol kısım */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {footerVeri?.isim || "Taha Bayraktar"}
          </h3>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
            {footerVeri?.aciklama ||
              (lang === "tr"
                ? "Frontend'e tutkuyla bağlı, kullanıcı odaklı arayüzler geliştiren bir mühendisim."
                : "A passionate frontend developer focused on user-centric interfaces.")}
          </p>
        </div>

        {/* Sağ kısım */}
        <div className="flex flex-col md:items-end items-start">
          <div className="flex space-x-5 text-xl mb-3">
            <a
              href={footerVeri?.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaGithub />
            </a>
            <a
              href={footerVeri?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${footerVeri?.email}`}
              className="hover:text-indigo-300 transition"
            >
              <FaEnvelope />
            </a>
            <a
              href={footerVeri?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300 transition"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-xs text-gray-300">
            &copy; {new Date().getFullYear()} {footerVeri?.isim || "Taha Bayraktar"}.{" "}
            {lang === "tr"
              ? "Tüm hakları saklıdır."
              : "All rights reserved."}
            <br />
            <span className="italic">Built with React + TailwindCSS ⚛️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}