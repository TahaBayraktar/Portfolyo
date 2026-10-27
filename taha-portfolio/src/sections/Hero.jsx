import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowDown, FiArrowRight, FiCheck } from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { Magnetic } from "../components/ui";

// Roller arasında döner: yaz → bekle → sil → sonraki
function useDaktiloDongu(roller, yazmaHizi = 60, silmeHizi = 30, bekleme = 1800) {
  const [yazilan, setYazilan] = useState("");
  const azHareket = useReducedMotion();
  const anahtar = roller.join("|");

  useEffect(() => {
    const liste = anahtar.split("|").filter(Boolean);
    if (liste.length === 0) return;
    if (azHareket) {
      setYazilan(liste.join(" · "));
      return;
    }
    let rol = 0;
    let uzunluk = 0;
    let siliyor = false;
    let zamanlayici;
    const adim = () => {
      const metin = liste[rol];
      if (!siliyor) {
        uzunluk += 1;
        setYazilan(metin.slice(0, uzunluk));
        if (uzunluk >= metin.length) {
          if (liste.length === 1) return;
          siliyor = true;
          zamanlayici = setTimeout(adim, bekleme);
          return;
        }
        zamanlayici = setTimeout(adim, yazmaHizi);
      } else {
        uzunluk -= 1;
        setYazilan(metin.slice(0, uzunluk));
        if (uzunluk <= 0) {
          siliyor = false;
          rol = (rol + 1) % liste.length;
        }
        zamanlayici = setTimeout(adim, silmeHizi);
      }
    };
    setYazilan("");
    zamanlayici = setTimeout(adim, 400);
    return () => clearTimeout(zamanlayici);
  }, [anahtar, yazmaHizi, silmeHizi, bekleme, azHareket]);

  return yazilan;
}

const giris = (gecikme) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: gecikme, ease: [0.22, 1, 0.36, 1] },
});

// ["Java", "Python"] → "Java", "Python" (vurgulu)
function Dizi({ ogeler }) {
  return (
    <>
      [
      {ogeler.map((oge, i) => (
        <span key={oge}>
          <span className="text-accent">&quot;{oge}&quot;</span>
          {i < ogeler.length - 1 && ", "}
        </span>
      ))}
      ]
    </>
  );
}

const DEPLOY_YML = [
  [<span key="a" className="text-accent-2">name</span>, ": deploy"],
  [<span key="a" className="text-accent-2">on</span>, ": [push]"],
  [<span key="a" className="text-accent-2">jobs</span>, ":"],
  ["  ship:"],
  ["    steps:"],
  ["      - run: ", <span key="b" className="text-accent">docker build -t api .</span>],
  ["      - run: ", <span key="b" className="text-accent">docker push $REG/api</span>],
  ["      - run: ", <span key="b" className="text-accent">ssh prod compose up -d</span>],
];

const PIPELINE = ["build", "test", "docker", "deploy"];

// build → test → docker → deploy aşamaları sırayla tamamlanır, "live" olunca baştan başlar
function Pipeline() {
  const azHareket = useReducedMotion();
  const [adim, setAdim] = useState(azHareket ? PIPELINE.length : 0);

  useEffect(() => {
    if (azHareket) return;
    const sure = adim >= PIPELINE.length ? 2200 : 850;
    const id = setTimeout(() => setAdim((a) => (a >= PIPELINE.length ? 0 : a + 1)), sure);
    return () => clearTimeout(id);
  }, [adim, azHareket]);

  const canli = adim >= PIPELINE.length;
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-t border-line px-3 py-3 font-mono text-[11px] sm:px-5 sm:text-xs">
      {PIPELINE.map((asama, i) => {
        const bitti = i < adim;
        const calisiyor = i === adim;
        return (
          <span key={asama} className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 transition-colors duration-300 ${
                canli
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : bitti
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : calisiyor
                    ? "border-accent-2/50 text-fg"
                    : "border-line text-muted"
              }`}
            >
              {bitti ? (
                <FiCheck className="h-3 w-3" />
              ) : (
                <span className={`h-1.5 w-1.5 rounded-full ${calisiyor ? "animate-pulse bg-accent-2" : "bg-line"}`} />
              )}
              {asama}
            </span>
            {i < PIPELINE.length - 1 && <span className="text-muted/50">→</span>}
          </span>
        );
      })}
      <span
        className={`ml-auto hidden items-center gap-1.5 rounded-full px-2 py-0.5 transition-all duration-300 sm:flex ${
          canli ? "bg-emerald-500/15 text-emerald-400 opacity-100" : "opacity-0"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> live
      </span>
    </div>
  );
}

function KodKarti({ profil }) {
  // Kartın içeriği JSON'daki "kodKarti" alanından gelir; alan hiç yoksa yetenek listesinden türetilir.
  // kodKarti içinde olmayan satırlar (ör. stack) gösterilmez.
  const kart = profil.kodKarti || {};
  const yigin = profil.kodKarti ? kart.stack : (profil.sliderYetenekler || []).slice(0, 3).map((y) => y.name);
  const deger = (metin) => <span className="text-accent">&quot;{metin}&quot;</span>;
  const developerJs = [
    [<span key="k" className="text-accent-2">const</span>, " developer = {"],
    ["  name: ", deger(profil.adSoyad), ","],
    ["  role: ", kart.rol ? <Dizi ogeler={kart.rol} /> : deger(profil.unvan), ","],
    ...(yigin?.length ? [["  stack: ", <Dizi key="s" ogeler={yigin} />, ","]] : []),
    ...(kart.devops ? [["  devops: ", <Dizi key="d" ogeler={kart.devops} />, ","]] : []),
    ["  location: ", deger(profil.kisiselBilgiler?.sehir), ","],
    ["  available: ", <span key="a" className="text-accent-2">true</span>],
    ["};"],
  ];
  const sekmeler = [
    { ad: "developer.js", satirlar: developerJs },
    { ad: "deploy.yml", satirlar: DEPLOY_YML },
  ];
  const azHareket = useReducedMotion();
  const [aktif, setAktif] = useState(0);
  const [elle, setElle] = useState(false);

  // Kullanıcı sekmeye tıklayana kadar iki dosya arasında kendiliğinden geçiş
  useEffect(() => {
    if (elle || azHareket) return;
    const id = setTimeout(() => setAktif((a) => (a + 1) % 2), aktif === 0 ? 6500 : 5000);
    return () => clearTimeout(id);
  }, [aktif, elle, azHareket]);

  return (
    <div className="kart overflow-hidden shadow-2xl shadow-accent/5">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-2 flex gap-1" role="tablist">
          {sekmeler.map((sekme, i) => (
            <button
              key={sekme.ad}
              role="tab"
              aria-selected={aktif === i}
              onClick={() => {
                setAktif(i);
                setElle(true);
              }}
              className={`rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                aktif === i ? "bg-bg/80 text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {sekme.ad}
            </button>
          ))}
        </div>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-6 sm:p-5 sm:text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={aktif} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {sekmeler[aktif].satirlar.map((satir, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="flex"
              >
                <span className="mr-3 w-4 shrink-0 select-none text-right text-muted/50 sm:mr-4">{i + 1}</span>
                <span className="whitespace-pre">{satir}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </pre>
      <Pipeline />
    </div>
  );
}

export default function Hero() {
  const { veri, t } = useSite();
  const profil = veri.profil;
  const unvan = useDaktiloDongu(profil.roller?.length ? profil.roller : [profil.unvan]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
      <div aria-hidden className="izgara-arka absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgb(var(--accent)/0.18),transparent)]" />

      <div className="container-site grid items-center gap-12 [&>*]:min-w-0 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <motion.div {...giris(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.musait}
          </motion.div>

          <motion.p {...giris(0.1)} className="mb-2 text-lg text-muted">
            {t.merhaba}
          </motion.p>
          <motion.h1 {...giris(0.15)} className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="gradient-yazi">{profil.adSoyad}</span>
          </motion.h1>

          <motion.p {...giris(0.25)} className="mt-4 h-8 font-mono text-lg text-fg sm:text-xl">
            <span className="text-accent">$</span> {unvan}
            <span className="ml-0.5 inline-block h-5 w-2 translate-y-0.5 animate-blink bg-accent" />
          </motion.p>

          <motion.p {...giris(0.35)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profil.aciklama}
          </motion.p>

          <motion.div {...giris(0.45)} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#projeler" className="buton-ana group">
                {t.projelerim}
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#iletisim" className="buton-ikincil">
                {t.iletisimeGec}
              </a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              {[
                { href: profil.github, ikon: FaGithub, ad: "GitHub" },
                { href: profil.linkedin, ikon: FaLinkedin, ad: "LinkedIn" },
              ].map(({ href, ikon: Ikon, ad }) => (
                <Magnetic key={ad} guc={0.5}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ad}
                    className="grid h-11 w-11 place-items-center rounded-full text-xl text-muted transition-colors hover:bg-surface hover:text-accent"
                  >
                    <Ikon />
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative z-10 mx-auto mb-[-3rem] h-32 w-32 sm:h-40 sm:w-40 lg:absolute lg:-right-4 lg:-top-20 lg:mb-0">
            <div aria-hidden className="absolute -inset-1 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,rgb(var(--accent)),rgb(var(--accent-2)),transparent,rgb(var(--accent)))]" />
            <img
              src={profil.profilFoto}
              alt={profil.adSoyad}
              className="relative h-full w-full rounded-full border-4 border-bg object-cover"
            />
          </div>
          <div className="pt-14 lg:pt-0">
            <KodKarti profil={profil} />
          </div>
        </motion.div>
      </div>

      <a
        href="#projeler"
        aria-label={t.asagi}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted transition-colors hover:text-accent md:flex"
      >
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <FiArrowDown />
        </motion.span>
      </a>
    </section>
  );
}
