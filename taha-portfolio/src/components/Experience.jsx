import { useEffect, useState } from "react";

export default function Experience({ darkMode, lang }) {
  const [deneyimler, setDeneyimler] = useState([]);

  useEffect(() => {
    const getir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const json = await yanit.json();
        setDeneyimler(json.deneyimler || []);
      } catch (e) {
        console.error("Deneyim verisi alınamadı:", e);
      }
    };

    getir();
  }, [lang]); // lang değiştiğinde veri yeniden çekilsin

  if (deneyimler.length === 0) return null;

  return (
    <section
      className={`py-16 px-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-50 text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl font-bold mb-10 text-center ${
            darkMode ? "text-pink-300" : "text-indigo-800"
          }`}
        >
          {lang === "tr" ? "💼 Deneyimlerim" : "💼 My Experiences"}
        </h2>

        <div className="space-y-6">
          {deneyimler.map((deneyim, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg shadow-md hover:shadow-lg transition ${
                darkMode ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}
              >
                {deneyim.sirket}
              </h3>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {deneyim.pozisyon}
              </p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} italic`}>
                {deneyim.tarih}
              </p>
              <p className={darkMode ? "text-gray-200" : "text-gray-800 mt-2"}>
                {deneyim.aciklama}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}