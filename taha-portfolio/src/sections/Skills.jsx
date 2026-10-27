import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading } from "../components/ui";

const OTOMATIK_HIZ = 40; // px/sn

// Kendiliğinden kayan, fare veya parmakla sağa sola sürüklenebilen sonsuz şerit
function Marquee({ ogeler, ters = false }) {
  // Liste iki kez yazılır; konum ilk yarının genişliğinde başa sarılır.
  // Kısa listeler (ör. 3 araç) geniş ekranı doldursun diye önce çoğaltılır.
  const yarim = Array.from({ length: Math.ceil(10 / ogeler.length) }, () => ogeler).flat();
  const cift = [...yarim, ...yarim];

  const izRef = useRef(null);
  const x = useMotionValue(0);
  const azHareket = useReducedMotion();
  const durum = useRef({ surukleniyor: false, ustunde: false, sonX: 0, sonZaman: 0, hiz: 0 });

  // Konumu [-yarımGenişlik, 0) aralığında tutar
  const sar = (deger) => {
    const yarimGenislik = izRef.current ? izRef.current.scrollWidth / 2 : 0;
    if (!yarimGenislik) return deger;
    return ((deger % yarimGenislik) - yarimGenislik) % yarimGenislik;
  };

  useAnimationFrame((_, delta) => {
    const d = durum.current;
    if (d.surukleniyor) return;
    let adim = 0;
    if (Math.abs(d.hiz) > 0.02) {
      // Bırakıldıktan sonraki atalet
      adim = d.hiz * delta;
      d.hiz *= 0.94;
    } else {
      d.hiz = 0;
      if (!d.ustunde && !azHareket) adim = ((ters ? 1 : -1) * OTOMATIK_HIZ * delta) / 1000;
    }
    if (adim) x.set(sar(x.get() + adim));
  });

  const bas = (e) => {
    const d = durum.current;
    d.surukleniyor = true;
    d.sonX = e.clientX;
    d.sonZaman = e.timeStamp;
    d.hiz = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const hareket = (e) => {
    const d = durum.current;
    if (!d.surukleniyor) return;
    const dx = e.clientX - d.sonX;
    const dt = Math.max(e.timeStamp - d.sonZaman, 1);
    d.hiz = dx / dt;
    d.sonX = e.clientX;
    d.sonZaman = e.timeStamp;
    x.set(sar(x.get() + dx));
  };
  const birak = (e) => {
    const d = durum.current;
    if (!d.surukleniyor) return;
    d.surukleniyor = false;
    // Parmak bir süre durup sonra kaldırıldıysa atalet verme
    if (e.timeStamp - d.sonZaman > 100) d.hiz = 0;
  };

  return (
    <div
      data-cursor="hover"
      onPointerDown={bas}
      onPointerMove={hareket}
      onPointerUp={birak}
      onPointerCancel={birak}
      onMouseEnter={() => (durum.current.ustunde = true)}
      onMouseLeave={() => (durum.current.ustunde = false)}
      className="relative cursor-grab touch-pan-y select-none overflow-hidden py-2 active:cursor-grabbing [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.div ref={izRef} style={{ x }} className="flex w-max gap-3 sm:gap-4">
        {cift.map((oge, i) => (
          <div
            key={i}
            aria-hidden={i >= ogeler.length}
            className="flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 transition-colors hover:border-accent/50"
          >
            {/* Logoların arka planları farklı olduğu için hepsi aynı açık çerçeveye alınır */}
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
              <img src={oge.logo} alt="" loading="lazy" draggable={false} className="h-6 w-6 object-contain" />
            </span>
            <span className="whitespace-nowrap text-sm font-medium">{oge.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const { veri, t } = useSite();
  const { sliderYetenekler = [], araclar = [], yapayZeka = [] } = veri.profil;

  const seritler = [
    { baslik: t.teknolojiler, ogeler: sliderYetenekler },
    { baslik: t.araclar, ogeler: araclar, ters: true },
    { baslik: t.yapayZeka, ogeler: yapayZeka },
  ].filter((s) => s.ogeler.length > 0);

  return (
    <section id="yetenekler" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="02" baslik={t.yeteneklerBaslik} alt={t.yeteneklerAlt} />
      </div>

      <Reveal className="space-y-5">
        {seritler.map(({ baslik, ogeler, ters }, i) => (
          <div key={baslik}>
            <div className="container-site mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted">
              <span>{baslik}</span>
              {i === 0 && <span className="normal-case tracking-normal text-muted/70">{t.surukle}</span>}
            </div>
            <Marquee ogeler={ogeler} ters={ters} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
