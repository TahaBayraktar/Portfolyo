import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { Magnetic } from "../components/ui";

function useDaktilo(metin, hiz = 55) {
  const [yazilan, setYazilan] = useState("");
  useEffect(() => {
    setYazilan("");
    if (!metin) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setYazilan(metin.slice(0, i));
      if (i >= metin.length) clearInterval(id);
    }, hiz);
    return () => clearInterval(id);
  }, [metin, hiz]);
  return yazilan;
}

const giris = (gecikme) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: gecikme, ease: [0.22, 1, 0.36, 1] },
});

function KodKarti({ profil }) {
  const yiginlar = (profil.sliderYetenekler || []).slice(0, 3).map((y) => `"${y.name}"`);
  const satirlar = [
    [<span key="k" className="text-accent-2">const</span>, " developer = {"],
    ["  name: ", <span key="n" className="text-accent">&quot;{profil.adSoyad}&quot;</span>, ","],
    ["  role: ", <span key="r" className="text-accent">&quot;{profil.unvan}&quot;</span>, ","],
    ["  stack: [", <span key="s" className="text-accent">{yiginlar.join(", ")}</span>, "],"],
    ["  location: ", <span key="l" className="text-accent">&quot;{profil.kisiselBilgiler?.sehir}&quot;</span>, ","],
    ["  available: ", <span key="a" className="text-accent-2">true</span>],
    ["};"],
  ];
  return (
    <div className="kart overflow-hidden shadow-2xl shadow-accent/5">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-muted">developer.js</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 sm:p-5 sm:text-sm">
        {satirlar.map((satir, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="flex"
          >
            <span className="mr-4 w-4 select-none text-right text-muted/50">{i + 1}</span>
            <span className="whitespace-pre">{satir}</span>
          </motion.div>
        ))}
      </pre>
    </div>
  );
}

export default function Hero() {
  const { veri, t } = useSite();
  const profil = veri.profil;
  const unvan = useDaktilo(profil.unvan);

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
        href="#hakkimda"
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
