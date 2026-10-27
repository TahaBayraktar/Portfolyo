import { FiBookOpen, FiGlobe, FiUser, FiTarget } from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { Reveal, SectionHeading, SpotlightCard } from "../components/ui";

function KartBaslik({ ikon: Ikon, children }) {
  return (
    <h3 className="mb-5 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted">
      <Ikon className="text-accent" />
      {children}
    </h3>
  );
}

export default function About() {
  const { veri, t } = useSite();
  const { egitimler = [], diller = [], kisiselBilgiler: kisisel = {} } = veri.profil;

  const bilgiler = [
    { etiket: t.ad, deger: kisisel.ad },
    { etiket: t.dogum, deger: kisisel.dogumTarihi },
    { etiket: t.sehir, deger: kisisel.sehir },
    { etiket: t.hobiler, deger: kisisel.hobiler },
  ].filter((b) => b.deger);

  return (
    <section id="hakkimda" className="py-16 md:py-24">
      <div className="container-site">
        <SectionHeading no="04" baslik={t.hakkimdaBaslik} alt={t.hakkimdaAlt} />

        <div className="grid gap-4 md:grid-cols-6">
          {kisisel.kariyerHedefi && (
            <Reveal className="md:col-span-6">
              <SpotlightCard className="p-6 sm:p-8">
                <KartBaslik ikon={FiTarget}>{t.hedef}</KartBaslik>
                <p className="text-xl font-medium leading-relaxed sm:text-2xl">
                  &ldquo;{kisisel.kariyerHedefi}&rdquo;
                </p>
              </SpotlightCard>
            </Reveal>
          )}

          <Reveal className="md:col-span-4" delay={0.05}>
            <SpotlightCard className="h-full p-6 sm:p-8">
              <KartBaslik ikon={FiBookOpen}>{t.egitim}</KartBaslik>
              <ol className="relative space-y-6 border-l border-line pl-6">
                {[...egitimler].reverse().map((egitim) => (
                  <li key={egitim.school} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
                    <p className="font-mono text-xs text-accent">{egitim.year}</p>
                    <p className="mt-1 text-lg font-semibold">{egitim.school}</p>
                    <p className="text-muted">{egitim.degree}</p>
                    {egitim.gpa && <span className="etiket mt-2">{t.not}: {egitim.gpa}</span>}
                  </li>
                ))}
              </ol>
            </SpotlightCard>
          </Reveal>

          <div className="grid gap-4 md:col-span-2">
            <Reveal delay={0.1}>
              <SpotlightCard className="h-full p-6">
                <KartBaslik ikon={FiUser}>{t.kisisel}</KartBaslik>
                <dl className="space-y-3 text-sm">
                  {bilgiler.map((b) => (
                    <div key={b.etiket}>
                      <dt className="text-muted">{b.etiket}</dt>
                      <dd className="font-medium">{b.deger}</dd>
                    </div>
                  ))}
                </dl>
              </SpotlightCard>
            </Reveal>
            {diller.length > 0 && (
              <Reveal delay={0.15}>
                <SpotlightCard className="h-full p-6">
                  <KartBaslik ikon={FiGlobe}>{t.diller}</KartBaslik>
                  {diller.map((d) => (
                    <div key={d.name} className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium">{d.name}</span>
                      <span className="etiket">{d.level}</span>
                    </div>
                  ))}
                </SpotlightCard>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
