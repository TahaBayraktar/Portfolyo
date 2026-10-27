import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { metinler } from "../i18n";

const VERI_ADRESI = "https://raw.githubusercontent.com/TahaBayraktar/PortfoyJson/main";

const SiteContext = createContext(null);

function kayitliOku(anahtar, varsayilan) {
  try {
    return localStorage.getItem(anahtar) || varsayilan;
  } catch {
    return varsayilan;
  }
}

function kaydet(anahtar, deger) {
  try {
    localStorage.setItem(anahtar, deger);
  } catch {
    // gizli sekme vb. durumlarda localStorage kullanılamayabilir
  }
}

function baslangicDili() {
  const kayitli = kayitliOku("lang", null);
  if (kayitli === "tr" || kayitli === "en") return kayitli;
  return navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
}

// Her dil için JSON'lar bir kez çekilir ve bellekte tutulur
const onbellek = {};

async function veriCek(dil) {
  if (onbellek[dil]) return onbellek[dil];
  const surum = Date.now();
  const getir = (dosya) =>
    fetch(`${VERI_ADRESI}/${dosya}_${dil}.json?v=${surum}`).then((yanit) => {
      if (!yanit.ok) throw new Error(`${dosya} alınamadı (${yanit.status})`);
      return yanit.json();
    });
  const [profil, proje, iletisim] = await Promise.all([
    getir("KendiniTanit"),
    getir("Proje"),
    getir("Iletisim"),
  ]);
  onbellek[dil] = { profil, projeler: proje.projeler || [], iletisim };
  return onbellek[dil];
}

export function SiteProvider({ children }) {
  const [lang, setLang] = useState(baslangicDili);
  const [theme, setTheme] = useState(() => kayitliOku("theme", "system"));
  const [accent, setAccent] = useState(() => kayitliOku("accent", "cyan"));
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState(null);
  const [deneme, setDeneme] = useState(0);

  useEffect(() => {
    let iptal = false;
    setHata(null);
    veriCek(lang)
      .then((sonuc) => !iptal && setVeri(sonuc))
      .catch((err) => {
        console.error("Veri alınamadı:", err);
        if (!iptal) setHata(err);
      });
    return () => {
      iptal = true;
    };
  }, [lang, deneme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    kaydet("lang", lang);
  }, [lang]);

  useEffect(() => {
    const kok = document.documentElement;
    const medya = matchMedia("(prefers-color-scheme: dark)");
    const uygula = () => {
      const koyu = theme === "dark" || (theme === "system" && medya.matches);
      kok.classList.toggle("dark", koyu);
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", koyu ? "#09090b" : "#fafafa");
    };
    uygula();
    kaydet("theme", theme);
    medya.addEventListener("change", uygula);
    return () => medya.removeEventListener("change", uygula);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    kaydet("accent", accent);
  }, [accent]);

  const tekrarDene = useCallback(() => setDeneme((d) => d + 1), []);

  const deger = {
    lang,
    setLang,
    theme,
    setTheme,
    accent,
    setAccent,
    veri,
    hata,
    tekrarDene,
    t: metinler[lang],
  };

  return <SiteContext.Provider value={deger}>{children}</SiteContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSite() {
  return useContext(SiteContext);
}
