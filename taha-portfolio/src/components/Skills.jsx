import { useEffect, useState } from "react";

export default function Skills({ darkMode, lang }) {
  const [yetenekler, setYetenekler] = useState([]);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const veri = await yanit.json();
        setYetenekler(veri.yetenekler);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    veriGetir();
  }, [lang]); // lang değişince tekrar fetch yapılır

  return (
    <section
      className={`py-16 px-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2
        className={`text-3xl font-bold text-center mb-10 ${
          darkMode ? "text-pink-300" : "text-indigo-800"
        }`}
      >
        {lang === "tr" ? "Yeteneklerim" : "My Skills"}
      </h2>

      <div className="max-w-3xl mx-auto space-y-8">
        {yetenekler.map((skill, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition ${
              darkMode ? "bg-gray-800" : "bg-indigo-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <span
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-indigo-800"
                }`}
              >
                {skill.name}
              </span>
            </div>

            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-sm ${
                    i < skill.level
                      ? darkMode
                        ? "bg-pink-400"
                        : "bg-indigo-500"
                      : darkMode
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}