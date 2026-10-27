import { useState } from "react";
import { FiCheck, FiCopy, FiDownload, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useSite } from "../context/SiteContext";
import { Magnetic, Reveal, SectionHeading, SpotlightCard } from "../components/ui";

function profilAdi(link) {
  try {
    return new URL(link).pathname.split("/").filter(Boolean).pop();
  } catch {
    return link;
  }
}

export default function Contact() {
  const { veri, t } = useSite();
  const iletisim = veri.iletisim;
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(iletisim.email);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      window.location.href = `mailto:${iletisim.email}`;
    }
  };

  const kanallar = [
    { ikon: FaLinkedin, etiket: "LinkedIn", deger: profilAdi(iletisim.linkedin), href: iletisim.linkedin },
    { ikon: FaGithub, etiket: "GitHub", deger: `@${profilAdi(iletisim.github)}`, href: iletisim.github },
    { ikon: FiMapPin, etiket: t.konum, deger: iletisim.konum },
  ].filter((k) => k.deger);

  return (
    <section id="iletisim" className="py-24 md:py-32">
      <div className="container-site">
        <SectionHeading no="05" baslik={t.iletisimBaslik} alt={iletisim.aciklama || t.iletisimAlt} />

        <div className="grid gap-4 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <SpotlightCard className="relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-10">
              <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div>
                <p className="flex items-center gap-2 font-mono text-sm text-muted">
                  <FiMail className="text-accent" /> {t.eposta}
                </p>
                <a
                  href={`mailto:${iletisim.email}`}
                  className="mt-3 block break-all text-2xl font-bold transition-colors hover:text-accent sm:text-4xl"
                >
                  {iletisim.email}
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Magnetic>
                  <a href={`mailto:${iletisim.email}`} className="buton-ana">
                    <FiSend /> {t.mailGonder}
                  </a>
                </Magnetic>
                <button onClick={kopyala} className="buton-ikincil" aria-live="polite">
                  {kopyalandi ? <FiCheck className="text-accent" /> : <FiCopy />}
                  {kopyalandi ? t.kopyalandi : t.kopyala}
                </button>
                {iletisim.cvLink && (
                  <a href={iletisim.cvLink} target="_blank" rel="noopener noreferrer" download className="buton-ikincil">
                    <FiDownload /> {t.cvIndir}
                  </a>
                )}
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="grid gap-4 lg:col-span-2">
            {kanallar.map(({ ikon: Ikon, etiket, deger, href }, i) => {
              const icerik = (
                <>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-bg/60 text-xl text-accent transition-transform duration-300 group-hover:scale-110">
                    <Ikon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted">{etiket}</span>
                    <span className="block truncate font-medium">{deger}</span>
                  </span>
                </>
              );
              return (
                <Reveal key={etiket} delay={0.05 * (i + 1)}>
                  {href ? (
                    <SpotlightCard as="a" href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-5 hover:-translate-y-0.5">
                      {icerik}
                    </SpotlightCard>
                  ) : (
                    <SpotlightCard className="group flex items-center gap-4 p-5">{icerik}</SpotlightCard>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
