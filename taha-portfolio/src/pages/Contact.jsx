import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub, FaFileDownload } from "react-icons/fa";

export default function Contact({ darkMode, lang }) {
  const [veri, setVeri] = useState(null);

  useEffect(() => {
    fetch(`https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/Iletisim_${lang}.json`)
      .then((res) => res.json())
      .then((data) => setVeri(data))
      .catch((err) => console.error("İletişim verisi alınamadı:", err));
  }, [lang]);

  if (!veri) return null;

  return (
    <section
      className={`py-16 px-6 min-h-[calc(100vh-200px)] transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-white via-indigo-50 to-purple-100 text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-indigo-800"}`}>
          {lang === "tr" ? "📞 İletişim" : "📞 Contact"}
        </h2>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-12`}>
          {veri.aciklama}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {/* Kart 1 */}
          <div className={`shadow rounded-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}>
              <FaEnvelope /> {lang === "tr" ? "E-posta" : "Email"}
            </h3>
            <p className="mt-1">{veri.email}</p>
          </div>

          {/* Kart 2 */}
          <div className={`shadow rounded-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}>
              <FaMapMarkerAlt /> {lang === "tr" ? "Lokasyon" : "Location"}
            </h3>
            <p className="mt-1">{veri.konum}</p>
          </div>

          {/* Kart 3 */}
          <div className={`shadow rounded-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}>
              <FaLinkedin /> LinkedIn
            </h3>
            <a
              href={veri.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`mt-1 block underline transition ${
                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {veri.linkedin}
            </a>
          </div>

          {/* Kart 4 */}
          <div className={`shadow rounded-lg p-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}>
              <FaGithub /> GitHub
            </h3>
            <a
              href={veri.github}
              target="_blank"
              rel="noreferrer"
              className={`mt-1 block underline transition ${
                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {veri.github}
            </a>
          </div>
        </div>

        {/* CV İndir Butonu */}
        <a
          href={veri.cvLink}
          download
          className="inline-flex items-center gap-2 mt-10 bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition"
        >
          <FaFileDownload />
          {lang === "tr" ? "CV'yi İndir" : "Download CV"}
        </a>
      </div>
    </section>
  );
}