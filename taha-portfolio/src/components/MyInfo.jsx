import { useEffect, useState } from "react";

export default function MyInfo({ darkMode, lang }) {
  const [veri, setVeri] = useState(null);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${new Date().getTime()}`
        );
        const json = await yanit.json();
        setVeri(json.kisiselBilgiler);
      } catch (err) {
        console.error("Kişisel bilgi çekme hatası:", err);
      }
    };

    veriGetir();
  }, [lang]); // lang değiştiğinde yeniden veri çekilsin

  if (!veri) return null;

  return (
    <section
      className={`py-16 px-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-indigo-50 to-purple-100 text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl font-bold text-center mb-10 ${
            darkMode ? "text-pink-300" : "text-indigo-800"
          }`}
        >
          {lang === "tr" ? "🧍‍♂️ Kişisel Bilgiler" : "🧍‍♂️ Personal Info"}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-lg shadow-md hover:shadow-xl transition ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <p>
              <span className={`font-semibold ${darkMode ? "text-pink-400" : "text-indigo-700"}`}>
                {lang === "tr" ? "Ad:" : "Name:"}
              </span>{" "}
              {veri.ad}
            </p>
            <p>
              <span className={`font-semibold ${darkMode ? "text-pink-400" : "text-indigo-700"}`}>
                {lang === "tr" ? "Doğum Tarihi:" : "Date of Birth:"}
              </span>{" "}
              {veri.dogumTarihi}
            </p>
            <p>
              <span className={`font-semibold ${darkMode ? "text-pink-400" : "text-indigo-700"}`}>
                {lang === "tr" ? "Şehir:" : "City:"}
              </span>{" "}
              {veri.sehir}
            </p>
          </div>

          <div
            className={`p-6 rounded-lg shadow-md hover:shadow-xl transition ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <p>
              <span className={`font-semibold ${darkMode ? "text-pink-400" : "text-indigo-700"}`}>
                {lang === "tr" ? "Hobiler:" : "Hobbies:"}
              </span>{" "}
              {veri.hobiler}
            </p>
            <p>
              <span className={`font-semibold ${darkMode ? "text-pink-400" : "text-indigo-700"}`}>
                {lang === "tr" ? "Kariyer Hedefi:" : "Career Goal:"}
              </span>{" "}
              {veri.kariyerHedefi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}