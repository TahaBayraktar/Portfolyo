import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiMoon, FiSun, FiMenu, FiX, FiDroplet } from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { vurguRenkleri } from "../i18n";

const BOLUMLER = ["hakkimda", "yetenekler", "deneyim", "projeler", "iletisim"];

function useAktifBolum() {
  const [aktif, setAktif] = useState("");
  useEffect(() => {
    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        girdiler.forEach((g) => g.isIntersecting && setAktif(g.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    // Bölümler veri gelince render olduğu için kısa aralıklarla tekrar bağlan
    const bagla = () => BOLUMLER.forEach((id) => {
      const el = document.getElementById(id);
      if (el) gozlemci.observe(el);
    });
    bagla();
    const zamanlayici = setTimeout(bagla, 1500);
    return () => {
      clearTimeout(zamanlayici);
      gozlemci.disconnect();
    };
  }, []);
  return aktif;
}

function KirmiziIkon() {
  return <span className="block h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#f8485e] to-[#fb923c] ring-1 ring-white/70" />;
}

function TemaSecici() {
  const { theme, setTheme, t } = useSite();
  const secenekler = [
    { deger: "light", ikon: FiSun, ad: t.ayarlar.acik },
    { deger: "dark", ikon: FiMoon, ad: t.ayarlar.koyu },
    { deger: "red", ikon: KirmiziIkon, ad: t.ayarlar.kirmizi },
  ];
  return (
    <div className="flex rounded-full border border-line bg-surface/60 p-0.5" role="radiogroup" aria-label={t.ayarlar.tema}>
      {secenekler.map(({ deger, ikon: Ikon, ad }) => (
        <button
          key={deger}
          role="radio"
          aria-checked={theme === deger}
          title={ad}
          aria-label={ad}
          onClick={() => setTheme(deger)}
          className={`relative grid h-8 w-8 place-items-center rounded-full text-sm transition-colors ${
            theme === deger ? "text-bg" : "text-muted hover:text-fg"
          }`}
        >
          {theme === deger && (
            <motion.span layoutId="tema-secili" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          )}
          <span className="relative">
            <Ikon />
          </span>
        </button>
      ))}
    </div>
  );
}

function RenkSecici() {
  const { accent, setAccent, theme, t } = useSite();
  const [acik, setAcik] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!acik) return;
    const disTik = (e) => !ref.current?.contains(e.target) && setAcik(false);
    document.addEventListener("pointerdown", disTik);
    return () => document.removeEventListener("pointerdown", disTik);
  }, [acik]);

  // Kırmızı tema kendi vurgu rengini kullanır
  if (theme === "red") return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        aria-label={t.ayarlar.renk}
        aria-expanded={acik}
        title={t.ayarlar.renk}
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/60 text-accent transition-colors hover:border-accent/60"
      >
        <FiDroplet />
      </button>
      <AnimatePresence>
        {acik && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="kart absolute right-0 top-12 flex gap-2 bg-surface p-2 shadow-xl"
          >
            {vurguRenkleri.map(({ ad, renk }) => (
              <button
                key={ad}
                onClick={() => setAccent(ad)}
                aria-label={ad}
                title={ad}
                className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110 ${
                  accent === ad ? "ring-2 ring-fg" : ""
                }`}
                style={{ backgroundColor: renk }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DilSecici() {
  const { lang, setLang, t } = useSite();
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      aria-label={t.ayarlar.dil}
      title={t.ayarlar.dil}
      className="flex h-9 items-center gap-1 rounded-full border border-line bg-surface/60 px-3 font-mono text-xs font-semibold transition-colors hover:border-accent/60"
    >
      <span className={lang === "tr" ? "text-accent" : "text-muted"}>TR</span>
      <span className="text-line">/</span>
      <span className={lang === "en" ? "text-accent" : "text-muted"}>EN</span>
    </button>
  );
}

export default function Navbar() {
  const { veri, t } = useSite();
  const [kaydirildi, setKaydirildi] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);
  const aktif = useAktifBolum();

  useEffect(() => {
    const dinle = () => setKaydirildi(window.scrollY > 20);
    dinle();
    window.addEventListener("scroll", dinle, { passive: true });
    return () => window.removeEventListener("scroll", dinle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAcik ? "hidden" : "";
  }, [menuAcik]);

  const profil = veri?.profil;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        kaydirildi || menuAcik ? "border-b border-line/80 bg-bg/95" : "border-b border-transparent"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <a href="#" className="group flex items-center gap-3" onClick={() => setMenuAcik(false)}>
          {profil?.profilFoto && (
            <img
              src={profil.profilFoto}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-line transition-all group-hover:ring-accent"
            />
          )}
          <span className="font-mono text-sm font-semibold">
            <span className="text-accent">~/</span>
            {(profil?.adSoyad || "Taha Bayraktar").toLowerCase().replace(/\s+/g, "-")}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {BOLUMLER.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                aktif === id ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {aktif === id && (
                <motion.span layoutId="nav-aktif" className="absolute inset-0 -z-10 rounded-full bg-surface ring-1 ring-line" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <TemaSecici />
            <RenkSecici />
          </div>
          <DilSecici />
          <button
            onClick={() => setMenuAcik((a) => !a)}
            aria-label={t.ayarlar.menu}
            aria-expanded={menuAcik}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/60 text-lg lg:hidden"
          >
            {menuAcik ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuAcik && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <nav className="container-site flex flex-col gap-1 pt-6">
              {BOLUMLER.map((id, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuAcik(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  className="flex items-baseline gap-3 border-b border-line py-4 text-2xl font-semibold"
                >
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  {t.nav[id]}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex items-center gap-3 sm:hidden"
              >
                <TemaSecici />
                <RenkSecici />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
