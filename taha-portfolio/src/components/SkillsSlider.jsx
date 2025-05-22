import { useEffect, useState } from "react";

export default function SkillsSlider({ darkMode, lang }) {
  const [sliderYetenekler, setSliderYetenekler] = useState([]);

  useEffect(() => {
    const getir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const veri = await yanit.json();
        setSliderYetenekler(veri.sliderYetenekler || []);
      } catch (e) {
        console.error("Slider yetenek verisi alınamadı:", e);
      }
    };

    getir();
  }, [lang]);

  const tekrarli = [...sliderYetenekler, ...sliderYetenekler, ...sliderYetenekler];

  return (
    <div
      className={`overflow-hidden py-8 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-800"
          : "bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200"
      }`}
    >
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {tekrarli.map((tool, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 min-w-max hover:scale-105 transition-transform duration-300"
          >
            <img
              src={tool.logo}
              alt={tool.name}
              className="h-10 w-10 object-contain"
            />
            <span
              className={`font-semibold text-md ${
                darkMode ? "text-white" : "text-indigo-800"
              }`}
            >
              {tool.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}