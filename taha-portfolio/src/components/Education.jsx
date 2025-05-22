import { useEffect, useState } from "react";

export default function Education({ darkMode, lang }) {
  const [egitimler, setEgitimler] = useState([]);
  const [diller, setDiller] = useState([]);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const veri = await yanit.json();
        setEgitimler(veri.egitimler);
        setDiller(veri.diller);
      } catch (error) {
        console.error("Eğitim verisi çekilemedi:", error);
      }
    };

    veriGetir();
  }, [lang]); // lang değiştiğinde yeniden veri çek

  return (
    <section
      className={`py-16 px-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl font-bold mb-10 text-center animate-fade-in-up ${
            darkMode ? "text-pink-300" : "text-indigo-800"
          }`}
        >
          {lang === "tr" ? "🎓 Eğitim" : "🎓 Education"}
        </h2>

        <div className="space-y-8 mb-12">
          {egitimler.map((edu, index) => (
            <div
              key={index}
              className={`border-l-4 pl-6 py-4 shadow-md rounded-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                darkMode
                  ? "border-pink-400 bg-gray-800"
                  : "border-indigo-500 bg-indigo-50"
              }`}
            >
              <h3
                className={`text-xl font-semibold transition-colors duration-300 group-hover:text-pink-500 ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}
              >
                {edu.school}
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {edu.degree}
              </p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} italic`}>
                {edu.year}
              </p>
              <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} font-medium`}>
                {lang === "tr" ? "Not Ortalaması" : "GPA"}: {edu.gpa}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`p-6 rounded-md shadow-md border-l-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${
            darkMode
              ? "bg-gray-800 border-pink-400"
              : "bg-indigo-50 border-pink-500"
          }`}
        >
          <h3
            className={`text-2xl font-semibold mb-4 ${
              darkMode ? "text-pink-400" : "text-pink-600"
            }`}
          >
            {lang === "tr" ? "🌍 Yabancı Dil" : "🌍 Foreign Languages"}
          </h3>
          {diller.map((langItem, i) => (
            <div key={i} className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <span className="font-medium">{langItem.name}:</span> {langItem.level}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}