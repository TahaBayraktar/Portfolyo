import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiExternalLink, FiFileText, FiImage, FiX } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";

// "Derso – Öğrenciler için ..." → { ad: "Derso", alt: "Öğrenciler için ..." }
function basligiAyir(baslik) {
  const [ad, ...kalan] = baslik.split(/\s[–-]\s/);
  return { ad, alt: kalan.join(" – ") };
}

function alanAdi(link) {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    return host === "github.com" ? null : host;
  } catch {
    return null;
  }
}

function ProjeLinkleri({ proje, kucuk = false }) {
  const { t } = useSite();
  const boyut = kucuk ? "px-3.5 py-2 text-xs" : "";
  return (
    <div className="flex flex-wrap gap-2">
      {proje.projeLink && (
        <a href={proje.projeLink} target="_blank" rel="noopener noreferrer" className={`buton-ana ${boyut}`}>
          <FiExternalLink /> {t.siteyiGor}
        </a>
      )}
      {proje.kaynakKodu && (
        <a href={proje.kaynakKodu} target="_blank" rel="noopener noreferrer" className={`buton-ikincil ${boyut}`}>
          <FaGithub /> {t.kaynakKodu}
        </a>
      )}
      {proje.detayDosyasi && (
        <a href={proje.detayDosyasi} target="_blank" rel="noopener noreferrer" className={`buton-ikincil ${boyut}`}>
          <FiFileText /> {t.detay}
        </a>
      )}
    </div>
  );
}

function ProjeModal({ proje, kapat }) {
  const { t } = useSite();
  const [index, setIndex] = useState(0);
  const [yon, setYon] = useState(1);
  const gorseller = proje.gorseller || [];
  const { ad, alt } = basligiAyir(proje.baslik);

  const git = useCallback(
    (adim) => {
      setYon(adim);
      setIndex((i) => (i + adim + gorseller.length) % gorseller.length);
    },
    [gorseller.length]
  );

  useEffect(() => {
    const tus = (e) => {
      if (e.key === "Escape") kapat();
      if (e.key === "ArrowRight") git(1);
      if (e.key === "ArrowLeft") git(-1);
    };
    window.addEventListener("keydown", tus);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tus);
      document.body.style.overflow = "";
    };
  }, [git, kapat]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={kapat}
      role="dialog"
      aria-modal="true"
      aria-label={ad}
    >
      <motion.div
        className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface sm:rounded-3xl"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={kapat}
          aria-label={t.kapat}
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
        >
          <FiX />
        </button>

        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-black">
          <AnimatePresence initial={false} custom={yon} mode="popLayout">
            <motion.img
              key={index}
              src={gorseller[index]}
              alt={`${ad} ${index + 1}`}
              custom={yon}
              variants={{
                gir: (y) => ({ x: `${y * 100}%`, opacity: 0 }),
                merkez: { x: 0, opacity: 1 },
                cik: (y) => ({ x: `${y * -100}%`, opacity: 0 }),
              }}
              initial="gir"
              animate="merkez"
              exit="cik"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, bilgi) => {
                if (bilgi.offset.x < -60) git(1);
                else if (bilgi.offset.x > 60) git(-1);
              }}
              className="absolute inset-0 h-full w-full cursor-grab object-contain active:cursor-grabbing"
              draggable={false}
            />
          </AnimatePresence>

          {gorseller.length > 1 && (
            <>
              {[
                { adim: -1, ikon: FiChevronLeft, ad: t.onceki, konum: "left-3" },
                { adim: 1, ikon: FiChevronRight, ad: t.sonraki, konum: "right-3" },
              ].map(({ adim, ikon: Ikon, ad: etiket, konum }) => (
                <button
                  key={adim}
                  onClick={() => git(adim)}
                  aria-label={etiket}
                  className={`absolute ${konum} top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-xl text-white backdrop-blur transition-colors hover:bg-black/70 sm:grid`}
                >
                  <Ikon />
                </button>
              ))}
              <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/50 px-2.5 py-1 font-mono text-xs text-white backdrop-blur">
                {index + 1} / {gorseller.length}
              </span>
            </>
          )}
        </div>

        <div className="overflow-y-auto">
          {gorseller.length > 1 && (
            <div className="scrollbar-yok flex gap-2 overflow-x-auto border-b border-line p-3">
              {gorseller.map((g, i) => (
                <button
                  key={g}
                  onClick={() => {
                    setYon(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`${i + 1}`}
                  className={`h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="p-5 sm:p-8">
            <h3 className="text-2xl font-bold sm:text-3xl">{ad}</h3>
            {alt && <p className="mt-1 text-accent">{alt}</p>}
            <p className="mt-4 leading-relaxed text-muted">{proje.aciklama}</p>
            <div className="mt-6">
              <ProjeLinkleri proje={proje} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjeKarti({ proje, sira, ac }) {
  const { t } = useSite();
  const { ad, alt } = basligiAyir(proje.baslik);
  const alan = alanAdi(proje.projeLink);
  const kapak = proje.gorseller?.[0];
  const ikinci = proje.gorseller?.[1];

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden hover:-translate-y-1">
      <button
        onClick={ac}
        className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg text-left"
        aria-label={`${ad} – ${t.incele}`}
      >
        {kapak && (
          <img
            src={kapak}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-105"
          />
        )}
        {ikinci && (
          <img
            src={ikinci}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 font-mono text-xs text-white backdrop-blur">
          <FiImage /> {proje.gorseller?.length || 0} {t.gorsel}
        </span>
        <span className="absolute right-3 top-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-accent text-lg text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <FiArrowUpRight />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-3 font-mono text-xs text-muted">
          <span className="text-accent">{String(sira).padStart(2, "0")}</span>
          {alan && <span className="truncate">{alan}</span>}
        </div>
        <h3 className="text-xl font-bold transition-colors group-hover:text-accent">{ad}</h3>
        {alt && <p className="mt-0.5 text-sm font-medium text-fg/80">{alt}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{proje.aciklama}</p>
        <div className="mt-auto pt-5">
          <ProjeLinkleri proje={proje} kucuk />
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function Projects() {
  const { veri, t } = useSite();
  const [secili, setSecili] = useState(null);
  const kapat = useCallback(() => setSecili(null), []);

  return (
    <section id="projeler" className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading no="04" baslik={t.projelerBaslik} alt={t.projelerAlt} />
        <div className="grid gap-5 md:grid-cols-2">
          {veri.projeler.map((proje, i) => (
            <Reveal key={proje.baslik} delay={(i % 2) * 0.08}>
              <ProjeKarti proje={proje} sira={i + 1} ac={() => setSecili(proje)} />
            </Reveal>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>{secili && <ProjeModal proje={secili} kapat={kapat} />}</AnimatePresence>,
        document.body
      )}
    </section>
  );
}
