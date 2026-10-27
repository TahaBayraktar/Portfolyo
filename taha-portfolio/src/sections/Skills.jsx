import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading } from "../components/ui";

function Marquee({ ogeler, ters = false }) {
  // Sonsuz kayma için liste iki kez yazılır, animasyon %50'de başa döner.
  // Kısa listeler (ör. 4 araç) geniş ekranı doldursun diye önce çoğaltılır.
  const yarim = Array.from({ length: Math.ceil(10 / ogeler.length) }, () => ogeler).flat();
  const cift = [...yarim, ...yarim];
  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused] sm:gap-4 ${
          ters ? "[animation-direction:reverse]" : ""
        }`}
      >
        {cift.map((oge, i) => (
          <div
            key={i}
            aria-hidden={i >= ogeler.length}
            className="flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 transition-colors hover:border-accent/50"
          >
            {/* Logoların arka planları farklı olduğu için hepsi aynı açık çerçeveye alınır */}
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
              <img src={oge.logo} alt="" loading="lazy" className="h-6 w-6 object-contain" />
            </span>
            <span className="whitespace-nowrap text-sm font-medium">{oge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { veri, t } = useSite();
  const { sliderYetenekler = [], araclar = [] } = veri.profil;

  return (
    <section id="yetenekler" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="02" baslik={t.yeteneklerBaslik} alt={t.yeteneklerAlt} />
      </div>

      <Reveal className="space-y-3 sm:space-y-4">
        {sliderYetenekler.length > 0 && (
          <div>
            <p className="container-site mb-2 font-mono text-xs uppercase tracking-wider text-muted">{t.teknolojiler}</p>
            <Marquee ogeler={sliderYetenekler} />
          </div>
        )}
        {araclar.length > 0 && (
          <div>
            <p className="container-site mb-2 mt-4 font-mono text-xs uppercase tracking-wider text-muted">{t.araclar}</p>
            <Marquee ogeler={araclar} ters />
          </div>
        )}
      </Reveal>
    </section>
  );
}
