import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";

function Marquee({ ogeler }) {
  // Sonsuz kayma için liste iki kez yazılır, animasyon %50'de başa döner
  const cift = [...ogeler, ...ogeler];
  return (
    <div className="group relative overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {cift.map((oge, i) => (
          <div
            key={i}
            aria-hidden={i >= ogeler.length}
            className="flex items-center gap-3 rounded-full border border-line bg-surface/60 px-5 py-2.5 transition-colors hover:border-accent/50"
          >
            <img src={oge.logo} alt="" loading="lazy" className="h-6 w-6 object-contain" />
            <span className="whitespace-nowrap text-sm font-medium">{oge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { veri, t } = useSite();
  const { yetenekler = [], sliderYetenekler = [] } = veri.profil;

  return (
    <section id="yetenekler" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="02" baslik={t.yeteneklerBaslik} alt={t.yeteneklerAlt} />
      </div>

      {sliderYetenekler.length > 0 && (
        <Reveal className="mb-12">
          <p className="sr-only">{t.teknolojiler}</p>
          <Marquee ogeler={sliderYetenekler} />
        </Reveal>
      )}

      <div className="container-site grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {yetenekler.map((yetenek, i) => (
          <Reveal key={yetenek.name} delay={i * 0.04}>
            <SpotlightCard className="group flex h-full flex-col p-4 hover:-translate-y-1 sm:p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-bg/60 p-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <img src={yetenek.logo} alt="" loading="lazy" className="h-full w-full object-contain" />
                </div>
                <span className="font-mono text-xs text-muted">{yetenek.level}/5</span>
              </div>
              <p className="font-semibold">{yetenek.name}</p>
              <p className="mb-3 text-xs text-muted">{t.seviye[yetenek.level]}</p>
              <div className="mt-auto flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    {n <= yetenek.level && (
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + n * 0.08, duration: 0.4 }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
