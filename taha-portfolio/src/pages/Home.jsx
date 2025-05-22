import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SkillsSlider from "../components/SkillsSlider";
import Skills from "../components/Skills";
import Education from "../components/Education";
import MyInfo from "../components/MyInfo";
import Footer from "../components/Footer";
import Experience from "../components/Experience";

export default function Home({ darkMode, lang }) {
  const [veri, setVeri] = useState(null);

  useEffect(() => {
    fetch(`https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json`)
      .then((response) => response.json())
      .then((data) => setVeri(data))
      .catch((error) => console.error("Veri çekme hatası:", error));
  }, [lang]); // ✅ lang değişince veri tekrar fetch edilecek

  if (!veri) {
    return <div className="text-center py-20">Yükleniyor...</div>;
  }

  return (
    <>
      {/* HERO SECTION */}
      <div
        className={`px-6 py-20 transition-colors duration-500 ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-white via-indigo-50 to-purple-100 text-black"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
          {/* Profil Fotoğrafı */}
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 hover:scale-105 transition-transform duration-300">
            <img
              src={veri.profilFoto}
              alt={veri.adSoyad}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Yazılar */}
          <div className="text-center md:text-left">
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
              darkMode ? "text-pink-400" : "text-indigo-800"
            }`}>
              {lang === "tr" ? "Merhaba! Ben" : "Hello! I'm"} <span className="text-pink-600">{veri.adSoyad}</span> 👋
            </h1>
            <p className={`text-lg md:text-xl mb-3 font-semibold ${
              darkMode ? "text-gray-300" : "text-black"
            }`}>
              {veri.unvan}
            </p>
            <p className={`text-md max-w-xl mb-6 leading-relaxed ${
              darkMode ? "text-gray-400" : "text-black/90"
            }`}>
              {veri.aciklama}
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-4">
              <Link
                to={veri.projelerLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300"
              >
                {lang === "tr" ? "Projelerim" : "My Projects"}
              </Link>
              <Link
                to={veri.iletisimLink}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300"
              >
                {lang === "tr" ? "İletişim" : "Contact"}
              </Link>
            </div>

            {/* Sosyal Medya */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href={veri.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl transition ${
                  darkMode
                    ? "text-white hover:text-gray-300"
                    : "text-black hover:text-indigo-700"
                }`}
              >
                <FaGithub />
              </a>
              <a
                href={veri.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-2xl transition ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-700 hover:text-blue-900"
                }`}
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDER + BİLGİLER */}
      <div className={`py-16 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? "text-pink-300" : "text-indigo-800"}`}>
            {lang === "tr" ? "Kullandığım Teknolojiler" : "Technologies I Use"}
          </h2>
          <SkillsSlider darkMode={darkMode} lang={lang} />
        </div>
        <Skills darkMode={darkMode} lang={lang} />
        <Education darkMode={darkMode} lang={lang} />
        <Experience darkMode={darkMode} lang={lang} />
        <MyInfo darkMode={darkMode} lang={lang} />
      </div>
    </>
  );
}