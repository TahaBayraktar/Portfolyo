import { useEffect, useState } from "react";

export default function Project({ darkMode, lang }) {
  const [projeler, setProjeler] = useState([]);
  const [aktifGorsel, setAktifGorsel] = useState(null);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/Proje_${lang}.json?timestamp=${Date.now()}`
        );
        const data = await yanit.json();
        setProjeler(data.projeler || []);
      } catch (error) {
        console.error("Proje verileri alınamadı:", error);
      }
    };

    veriGetir();
  }, [lang]);

  return (
    <section
      className={`py-16 px-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-white via-indigo-50 to-purple-100 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-800 dark:text-indigo-300 mb-12">
          {lang === "tr" ? "🚀 Projelerim" : "🚀 My Projects"}
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {projeler.map((proje, index) => (
            <CarouselCard
              key={index}
              proje={proje}
              onImageClick={(img) => setAktifGorsel(img)}
              darkMode={darkMode}
              lang={lang}
            />
          ))}
        </div>

        {aktifGorsel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setAktifGorsel(null)}
          >
            <img
              src={aktifGorsel}
              alt="Büyük görsel"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function CarouselCard({ proje, onImageClick, darkMode, lang }) {
  const [aktifIndex, setAktifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAktifIndex((prev) => (prev + 1) % proje.gorseller.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [proje.gorseller]);

  const ileri = () => {
    setAktifIndex((prev) => (prev + 1) % proje.gorseller.length);
  };

  const geri = () => {
    setAktifIndex((prev) =>
      prev === 0 ? proje.gorseller.length - 1 : prev - 1
    );
  };

  return (
    <div
      className={`w-[320px] rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300 flex flex-col relative ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <div className="w-full h-48 overflow-hidden rounded-md mb-4 relative group">
        <img
          src={proje.gorseller[aktifIndex]}
          onClick={() => onImageClick(proje.gorseller[aktifIndex])}
          alt={`Görsel ${aktifIndex + 1}`}
          className="object-cover w-full h-full transition-all duration-700 hover:scale-105 cursor-pointer"
        />
        <button
          onClick={geri}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1 rounded-full shadow hover:bg-opacity-100 transition z-10"
        >
          ◀
        </button>
        <button
          onClick={ileri}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-80 p-1 rounded-full shadow hover:bg-opacity-100 transition z-10"
        >
          ▶
        </button>
      </div>

      <h3 className={`text-xl font-bold mt-1 mb-1 ${darkMode ? "text-white" : "text-black"}`}>
        {proje.baslik}
      </h3>
      <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-800"} mt-2 mb-4`}>
        {proje.aciklama}
      </p>

      <div className="flex gap-3 mt-auto flex-wrap">
        {proje.projeLink && (
          <a
            href={proje.projeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            {lang === "tr" ? "Siteyi Gör" : "Visit Site"}
          </a>
        )}
        {proje.kaynakKodu && (
          <a
            href={proje.kaynakKodu}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {lang === "tr" ? "Kaynak Kodu" : "Source Code"}
          </a>
        )}
        {proje.detayDosyasi && (
          <a
            href={proje.detayDosyasi}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-pink-100 dark:bg-pink-800 dark:text-white text-pink-800 px-4 py-2 rounded-full hover:bg-pink-200 dark:hover:bg-pink-700 transition"
          >
            {lang === "tr" ? "Detaylı Bilgi 📄" : "Details 📄"}
          </a>
        )}
      </div>
    </div>
  );
}