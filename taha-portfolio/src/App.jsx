import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // 🌍 Dil durumu - localStorage ile kalıcı
  const [lang, setLang] = useState("tr");

  // Sayfa ilk yüklendiğinde localStorage'dan dil al
  useEffect(() => {
    const kayitliDil = localStorage.getItem("lang");
    if (kayitliDil) {
      setLang(kayitliDil);
    }
  }, []);

  // Dil değiştiğinde localStorage'a yaz
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          lang={lang}
          setLang={setLang}
        />

        <main
          className={`flex-grow transition-colors duration-500 ${
            darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={<Home darkMode={darkMode} lang={lang} />}
            />
            <Route
              path="/projects"
              element={<Projects darkMode={darkMode} lang={lang} />}
            />
            <Route
              path="/contact"
              element={<Contact darkMode={darkMode} lang={lang} />}
            />
          </Routes>
        </main>

        <Footer darkMode={darkMode} lang={lang} />
      </Router>
    </div>
  );
}