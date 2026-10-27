import { useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useSite } from "./context/SiteContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

// Eski sayfa adresleri (/projects, /contact) tek sayfadaki bölümlere yönlendirilir
const ESKI_ADRESLER = { "/projects": "projeler", "/contact": "iletisim" };

function IlerlemeCubugu() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-accent to-accent-2"
      style={{ scaleX }}
    />
  );
}

function Yukleniyor() {
  const { hata, tekrarDene, t } = useSite();
  return (
    <div className="grid min-h-[100svh] place-items-center px-4">
      {hata ? (
        <div className="text-center">
          <p className="text-muted">{t.hata}</p>
          <button onClick={tekrarDene} className="buton-ana mt-4">
            {t.tekrarDene}
          </button>
        </div>
      ) : (
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> {t.yukleniyor}
          <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent" />
        </p>
      )}
    </div>
  );
}

export default function App() {
  const { veri } = useSite();

  useEffect(() => {
    const hedef = ESKI_ADRESLER[window.location.pathname];
    if (hedef) window.history.replaceState(null, "", `/#${hedef}`);
  }, []);

  // Veri geldikten sonra adres çubuğundaki bölüme kaydır
  useEffect(() => {
    if (!veri || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    el?.scrollIntoView();
  }, [veri]);

  return (
    <>
      <IlerlemeCubugu />
      <Cursor />
      <Navbar />
      <main className="relative z-10">
        {veri ? (
          <>
            <Hero />
            <Projects />
            <Experience />
            <Skills />
            <About />
            <Contact />
          </>
        ) : (
          <Yukleniyor />
        )}
      </main>
      {veri && <Footer />}
    </>
  );
}
