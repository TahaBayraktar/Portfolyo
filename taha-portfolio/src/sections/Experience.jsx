import { FiBriefcase } from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";

export default function Experience() {
  const { veri, t } = useSite();
  const deneyimler = veri.profil.deneyimler || [];
  if (deneyimler.length === 0) return null;

  return (
    <section id="deneyim" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="03" baslik={t.deneyimBaslik} alt={t.deneyimAlt} />

        <ol className="relative space-y-6 md:ml-4 md:border-l md:border-line md:pl-10">
          {deneyimler.map((deneyim, i) => (
            <Reveal as="li" key={deneyim.sirket + deneyim.tarih} delay={i * 0.08} className="relative">
              <span className="absolute -left-[3.3rem] top-7 hidden h-6 w-6 place-items-center rounded-full border border-accent bg-bg text-xs text-accent md:grid">
                <FiBriefcase />
              </span>
              <SpotlightCard className="p-6 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <h3 className="text-xl font-semibold">{deneyim.pozisyon}</h3>
                    <p className="text-accent">{deneyim.sirket}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-muted">{deneyim.tarih}</span>
                </div>
                <p className="mt-4 leading-relaxed text-muted">{deneyim.aciklama}</p>
                {deneyim.teknolojiler?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {deneyim.teknolojiler.map((tek) => (
                      <span key={tek} className="etiket">{tek}</span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
