import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode, lang, setLang }) {
  const [veri, setVeri] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const yanit = await fetch(
          `https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main/KendiniTanit_${lang}.json?timestamp=${Date.now()}`
        );
        const veri = await yanit.json();
        setVeri(veri);
      } catch (hata) {
        console.error("Navbar verisi alınamadı:", hata);
      }
    };

    veriGetir();
  }, [lang]);

  const menuItems = [
    { path: "/", label: lang === "tr" ? "Anasayfa" : "Home" },
    { path: "/projects", label: lang === "tr" ? "Projeler" : "Projects" },
    { path: "/contact", label: lang === "tr" ? "İletişim" : "Contact" }
  ];

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-colors duration-500
      ${darkMode 
        ? "bg-gray-800/90 backdrop-blur-md border-b border-gray-700 text-white" 
        : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white bg-[length:200%_200%] animate-gradient-x"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo + İsim */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <img
                src={veri?.profilFoto || "/Taha.jpeg"}
                alt="Profil"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-white text-lg font-semibold tracking-wide group-hover:tracking-wider transition-all duration-300">
              {veri?.adSoyad || "Taha Bayraktar"}
            </span>
          </Link>

          {/* Menü & Butonlar */}
          <div className="flex items-center space-x-3">
            
            {/* Masaüstü Menü */}
            <nav className="hidden lg:flex space-x-6 text-lg">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-yellow-300 transition hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition duration-500 hover:brightness-110
                ${darkMode 
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient-x bg-[length:200%_200%]"
                }`}
            >
              {darkMode
                ? `☀️ ${lang === "tr" ? "Gündüz" : "Light"}`
                : `🌙 ${lang === "tr" ? "Karanlık" : "Dark"}`}
            </button>

            {/* Dil Değiştirici */}
            <button
  onClick={() => setLang(lang === "tr" ? "en" : "tr")}
  className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-md transition duration-300 border
    ${darkMode
      ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
      : "bg-transparent text-white border-white hover:bg-white hover:text-black"
    }`}
>
  {lang === "tr" ? "🇹🇷 TR" : "🇬🇧 EN"}
</button>

            {/* Hamburger Menü Butonu */}
            <div className="lg:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü */}
        {isOpen && (
          <div className="lg:hidden flex flex-col space-y-4 mt-2 pb-4 text-center">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="hover:text-yellow-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}