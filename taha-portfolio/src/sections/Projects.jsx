import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiExternalLink,
  FiFileText,
  FiImage,
  FiMaximize,
  FiMinimize,
  FiRotateCcw,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
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

const MAKS_OLCEK = 5;
const CIFT_DOKUNUS_MS = 300;

// Ölçek ve kaydırmayı, görsel kutunun dışına taşmayacak şekilde uygular
function donusumUygula(d, olcek, x, y, yumusak) {
  const r = d.kutu.current.getBoundingClientRect();
  olcek = Math.min(MAKS_OLCEK, Math.max(1, olcek));
  const mx = (r.width * (olcek - 1)) / 2;
  const my = (r.height * (olcek - 1)) / 2;
  x = Math.max(-mx, Math.min(mx, x));
  y = Math.max(-my, Math.min(my, y));
  if (yumusak) {
    const ayar = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };
    animate(d.s, olcek, ayar);
    animate(d.tx, x, ayar);
    animate(d.ty, y, ayar);
  } else {
    d.s.set(olcek);
    d.tx.set(x);
    d.ty.set(y);
  }
  d.setYakin(olcek > 1.01);
}

// Ekrandaki bir noktayı sabit tutarak ölçekler (parmak/imleç altındaki yer kaymaz)
function noktadanOlcekle(d, clientX, clientY, yeniOlcek, yumusak) {
  const r = d.kutu.current.getBoundingClientRect();
  const px = clientX - (r.left + r.width / 2);
  const py = clientY - (r.top + r.height / 2);
  const k = Math.min(MAKS_OLCEK, Math.max(1, yeniOlcek)) / d.s.get();
  donusumUygula(d, yeniOlcek, px - (px - d.tx.get()) * k, py - (py - d.ty.get()) * k, yumusak);
}

// Modal görseli: iki parmak / tekerlek / çift dokunuş ile yakınlaştırma, yakınken kaydırarak gezinme,
// normal boyuttayken yana kaydırarak görsel değiştirme, tam ekran
function ZoomluGorsel({ gorseller, index, yon, git, ad }) {
  const { t } = useSite();
  const alan = useRef(null);
  const kutu = useRef(null);
  const s = useMotionValue(1);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const [yakin, setYakin] = useState(false);
  const [tamEkran, setTamEkran] = useState(false);
  const isaretler = useRef(new Map());
  const jest = useRef(null);
  const sonDokunus = useRef({ zaman: 0, x: 0, y: 0 });
  const d = { kutu, s, tx, ty, setYakin };
  const tamEkranDestekli = typeof document !== "undefined" && document.fullscreenEnabled;

  // Görsel değişince yakınlaştırmayı sıfırla
  useEffect(() => {
    s.set(1);
    tx.set(0);
    ty.set(0);
    setYakin(false);
  }, [index, s, tx, ty]);

  // Tekerlek: sayfa kaymasın diye pasif olmayan dinleyici gerekir
  useEffect(() => {
    const el = kutu.current;
    const tekerlek = (e) => {
      e.preventDefault();
      noktadanOlcekle({ kutu, s, tx, ty, setYakin }, e.clientX, e.clientY, s.get() * Math.exp(-e.deltaY * 0.002), false);
    };
    el.addEventListener("wheel", tekerlek, { passive: false });
    return () => el.removeEventListener("wheel", tekerlek);
  }, [s, tx, ty]);

  useEffect(() => {
    const degisti = () => setTamEkran(document.fullscreenElement === alan.current);
    document.addEventListener("fullscreenchange", degisti);
    return () => document.removeEventListener("fullscreenchange", degisti);
  }, []);

  const merkezdenOlcekle = (carpan) => {
    const r = kutu.current.getBoundingClientRect();
    noktadanOlcekle(d, r.left + r.width / 2, r.top + r.height / 2, s.get() * carpan, true);
  };

  useEffect(() => {
    const tus = (e) => {
      const r = kutu.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ctx = { kutu, s, tx, ty, setYakin };
      if (e.key === "+" || e.key === "=") noktadanOlcekle(ctx, cx, cy, s.get() * 1.6, true);
      if (e.key === "-") noktadanOlcekle(ctx, cx, cy, s.get() / 1.6, true);
      if (e.key === "0") donusumUygula(ctx, 1, 0, 0, true);
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [s, tx, ty]);

  const tamEkranDegistir = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else alan.current.requestFullscreen?.();
  };

  const bas = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isaretler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const noktalar = [...isaretler.current.values()];
    if (noktalar.length === 2) {
      const [a, b] = noktalar;
      jest.current = {
        tip: "kistir",
        mesafe: Math.hypot(a.x - b.x, a.y - b.y),
        olcek: s.get(),
        orta: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    } else if (noktalar.length === 1) {
      jest.current = { tip: s.get() > 1.01 ? "gez" : "kaydir", baslaX: e.clientX, baslaY: e.clientY, sonX: e.clientX, sonY: e.clientY };
    }
  };

  const hareket = (e) => {
    if (!isaretler.current.has(e.pointerId)) return;
    isaretler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const j = jest.current;
    if (!j) return;
    if (j.tip === "kistir" && isaretler.current.size >= 2) {
      const [a, b] = [...isaretler.current.values()];
      const orta = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      noktadanOlcekle(d, orta.x, orta.y, (j.olcek * Math.hypot(a.x - b.x, a.y - b.y)) / j.mesafe, false);
      donusumUygula(d, s.get(), tx.get() + orta.x - j.orta.x, ty.get() + orta.y - j.orta.y, false);
      j.orta = orta;
    } else if (j.tip === "gez") {
      donusumUygula(d, s.get(), tx.get() + e.clientX - j.sonX, ty.get() + e.clientY - j.sonY, false);
      j.sonX = e.clientX;
      j.sonY = e.clientY;
    }
  };

  const birak = (e) => {
    if (!isaretler.current.has(e.pointerId)) return;
    isaretler.current.delete(e.pointerId);
    const j = jest.current;
    if (!j) return;

    if (j.tip === "kistir") {
      // Bir parmak kaldıysa o parmakla gezinmeye devam et
      const kalan = [...isaretler.current.values()][0];
      jest.current = kalan ? { tip: "gez", baslaX: kalan.x, baslaY: kalan.y, sonX: kalan.x, sonY: kalan.y } : null;
      return;
    }
    if (isaretler.current.size > 0) return;
    jest.current = null;

    const dx = e.clientX - j.baslaX;
    const dy = e.clientY - j.baslaY;
    if (j.tip === "kaydir" && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      git(dx < 0 ? 1 : -1);
      return;
    }
    // Neredeyse hareketsiz dokunuş: çift dokunuş/tıklama ise yakınlaştır ya da sıfırla
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const once = sonDokunus.current;
      if (e.timeStamp - once.zaman < CIFT_DOKUNUS_MS && Math.hypot(e.clientX - once.x, e.clientY - once.y) < 30) {
        if (s.get() > 1.01) donusumUygula(d, 1, 0, 0, true);
        else noktadanOlcekle(d, e.clientX, e.clientY, 2.5, true);
        sonDokunus.current = { zaman: 0, x: 0, y: 0 };
      } else {
        sonDokunus.current = { zaman: e.timeStamp, x: e.clientX, y: e.clientY };
      }
    }
  };

  const iptal = (e) => {
    isaretler.current.delete(e.pointerId);
    if (isaretler.current.size === 0) jest.current = null;
  };

  const kontrolButonu = "grid h-8 w-8 place-items-center rounded-full bg-black/70 text-sm text-white sm:h-10 sm:w-10 sm:text-lg transition-colors hover:bg-black/90 disabled:opacity-40";

  return (
    <div
      ref={alan}
      className={`relative w-full shrink-0 overflow-hidden bg-black ${tamEkran ? "h-full" : "aspect-video"}`}
    >
      <div
        ref={kutu}
        onPointerDown={bas}
        onPointerMove={hareket}
        onPointerUp={birak}
        onPointerCancel={iptal}
        className={`absolute inset-0 touch-none select-none ${yakin ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
      >
        <AnimatePresence initial={false} custom={yon} mode="popLayout">
          <motion.div
            key={index}
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
            className="absolute inset-0"
          >
            <motion.img
              src={gorseller[index]}
              alt={`${ad} ${index + 1}`}
              draggable={false}
              style={{ x: tx, y: ty, scale: s }}
              className="h-full w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {gorseller.length > 1 && !yakin && (
        <>
          {[
            { adim: -1, ikon: FiChevronLeft, etiket: t.onceki, konum: "left-3" },
            { adim: 1, ikon: FiChevronRight, etiket: t.sonraki, konum: "right-3" },
          ].map(({ adim, ikon: Ikon, etiket, konum }) => (
            <button
              key={adim}
              onClick={() => git(adim)}
              aria-label={etiket}
              className={`absolute ${konum} top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-xl text-white transition-colors hover:bg-black/90 sm:grid`}
            >
              <Ikon />
            </button>
          ))}
        </>
      )}

      {gorseller.length > 1 && (
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/70 px-2.5 py-1 font-mono text-xs text-white">
          {index + 1} / {gorseller.length}
        </span>
      )}

      <div className="absolute bottom-2 right-2 z-10 flex gap-1.5 sm:bottom-3 sm:right-3 sm:gap-2">
        <button onClick={() => merkezdenOlcekle(1 / 1.6)} disabled={!yakin} aria-label={t.uzaklastir} title={t.uzaklastir} className={kontrolButonu}>
          <FiZoomOut />
        </button>
        <button onClick={() => merkezdenOlcekle(1.6)} aria-label={t.yakinlastir} title={t.yakinlastir} className={kontrolButonu}>
          <FiZoomIn />
        </button>
        {yakin && (
          <button onClick={() => donusumUygula(d, 1, 0, 0, true)} aria-label={t.sifirla} title={t.sifirla} className={kontrolButonu}>
            <FiRotateCcw />
          </button>
        )}
        {tamEkranDestekli && (
          <button onClick={tamEkranDegistir} aria-label={t.tamEkran} title={t.tamEkran} className={kontrolButonu}>
            {tamEkran ? <FiMinimize /> : <FiMaximize />}
          </button>
        )}
      </div>

      {!yakin && (
        <span className="pointer-events-none absolute left-1/2 top-3 z-10 hidden -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white/90 sm:block">
          {t.zoomIpucu}
        </span>
      )}
    </div>
  );
}

function ProjeModal({ proje, baslangic = 0, kapat }) {
  const { t } = useSite();
  const [index, setIndex] = useState(baslangic);
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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/85 sm:items-center sm:p-6"
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
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/70"
        >
          <FiX />
        </button>

        <ZoomluGorsel gorseller={gorseller} index={index} yon={yon} git={git} ad={ad} />

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

const GALERI_SURE = 4; // sn

// Kart kapağı: kendiliğinden geçen, kaydırılabilen galeri. Kaydırmadan dokununca modal açılır.
function KartGalerisi({ proje, ad, sira, duraklat, ac }) {
  const { t } = useSite();
  const gorseller = proje.gorseller || [];
  const [index, setIndex] = useState(0);
  const [yon, setYon] = useState(1);
  const [ustunde, setUstunde] = useState(false);
  const ref = useRef(null);
  const dokunus = useRef(null);
  const gorunur = useInView(ref, { amount: 0.4 });
  const azHareket = useReducedMotion();
  const otomatik = gorseller.length > 1 && !azHareket;
  const bekle = duraklat || ustunde || !gorunur;

  const git = useCallback(
    (adim) => {
      setYon(adim);
      setIndex((i) => (i + adim + gorseller.length) % gorseller.length);
    },
    [gorseller.length]
  );

  // Geçişte boş kare görünmesin diye sıradaki görseli önceden yükle
  useEffect(() => {
    const liste = proje.gorseller || [];
    if (liste.length > 1) new Image().src = liste[(index + 1) % liste.length];
  }, [index, proje.gorseller]);

  const bas = (e) => {
    dokunus.current = { x: e.clientX, y: e.clientY };
  };
  const birak = (e) => {
    const d = dokunus.current;
    dokunus.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) git(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) ac(index);
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`${ad} – ${t.incele}`}
      onPointerDown={bas}
      onPointerUp={birak}
      onPointerCancel={() => (dokunus.current = null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ac(index);
        }
      }}
      onMouseEnter={() => setUstunde(true)}
      onMouseLeave={() => setUstunde(false)}
      className="relative aspect-[16/10] w-full cursor-pointer touch-pan-y select-none overflow-hidden border-b border-line bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <AnimatePresence initial={false} custom={yon} mode="popLayout">
        <motion.img
          key={index}
          src={gorseller[index]}
          alt=""
          draggable={false}
          decoding="async"
          loading={index === 0 ? "lazy" : undefined}
          custom={yon}
          variants={{
            gir: (y) => ({ x: `${y * 100}%` }),
            merkez: { x: 0 },
            cik: (y) => ({ x: `${y * -100}%` }),
          }}
          initial="gir"
          animate="merkez"
          exit="cik"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {gorseller.length > 1 && (
        <>
          {[
            { adim: -1, ikon: FiChevronLeft, etiket: t.onceki, konum: "left-3" },
            { adim: 1, ikon: FiChevronRight, etiket: t.sonraki, konum: "right-3" },
          ].map(({ adim, ikon: Ikon, etiket, konum }) => (
            <button
              key={adim}
              aria-label={etiket}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                git(adim);
              }}
              className={`absolute ${konum} top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-lg text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 sm:grid`}
            >
              <Ikon />
            </button>
          ))}

          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {gorseller.map((g, i) => (
              <span
                key={g}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>

          {otomatik && (
            // Çubuk dolunca sonraki görsele geçilir; duraklatınca çubuk da durur
            <span
              key={index}
              onAnimationEnd={() => git(1)}
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-ilerle bg-accent"
              style={{
                animationDuration: `${GALERI_SURE}s`,
                animationDelay: index === 0 ? `${(sira - 1) * 0.7}s` : "0s",
                animationPlayState: bekle ? "paused" : "running",
              }}
            />
          )}
        </>
      )}

      <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 font-mono text-xs text-white">
        <FiImage /> {index + 1}/{gorseller.length}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-accent text-lg text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <FiArrowUpRight />
      </span>
    </div>
  );
}

function ProjeKarti({ proje, sira, duraklat, ac }) {
  const { ad, alt } = basligiAyir(proje.baslik);
  const alan = alanAdi(proje.projeLink);

  return (
    <SpotlightCard className="group flex h-full flex-col overflow-hidden hover:-translate-y-1">
      <KartGalerisi proje={proje} ad={ad} sira={sira} duraklat={duraklat} ac={ac} />

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

// Kapalıyken gösterilen proje sayısı (mobilde kartlar uzun olduğu için bir eksik)
const ILK_MASAUSTU = 4;
const ILK_MOBIL = 3;

export default function Projects() {
  const { veri, t } = useSite();
  const [secili, setSecili] = useState(null);
  const [hepsi, setHepsi] = useState(false);
  const kapat = useCallback(() => setSecili(null), []);
  const projeler = veri.projeler;
  const fazla = projeler.length > ILK_MOBIL;

  const degistir = () => {
    if (hepsi) document.getElementById("projeler")?.scrollIntoView({ behavior: "smooth" });
    setHepsi((h) => !h);
  };

  return (
    <section id="projeler" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="01" baslik={t.projelerBaslik} alt={t.projelerAlt} />
        <div className="grid gap-5 md:grid-cols-2">
          {(hepsi ? projeler : projeler.slice(0, ILK_MASAUSTU)).map((proje, i) => (
            <Reveal
              key={proje.baslik}
              delay={(i % 2) * 0.08}
              className={!hepsi && i >= ILK_MOBIL ? "max-md:hidden" : ""}
            >
              <ProjeKarti
                proje={proje}
                sira={i + 1}
                duraklat={!!secili}
                ac={(baslangic) => setSecili({ proje, baslangic })}
              />
            </Reveal>
          ))}
        </div>

        {fazla && (
          <div className="mt-8 flex justify-center">
            <button onClick={degistir} className="buton-ikincil" aria-expanded={hepsi}>
              {hepsi ? (
                <>
                  <FiChevronUp /> {t.dahaAz}
                </>
              ) : (
                <>
                  <FiChevronDown /> {t.tumProjeler}
                  {projeler.length > ILK_MOBIL && (
                    <span className="font-mono text-muted md:hidden">+{projeler.length - ILK_MOBIL}</span>
                  )}
                  {projeler.length > ILK_MASAUSTU && (
                    <span className="hidden font-mono text-muted md:inline">+{projeler.length - ILK_MASAUSTU}</span>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {secili && <ProjeModal proje={secili.proje} baslangic={secili.baslangic} kapat={kapat} />}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
