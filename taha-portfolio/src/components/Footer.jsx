import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { useSite } from "../context/SiteContext";

export default function Footer() {
  const { veri, t } = useSite();
  const footer = veri?.profil.footer || {};
  const isim = footer.isim || "Taha Bayraktar";
  // JSON'daki e-posta "mailto:" ile ya da düz yazılmış olabilir
  const mail = footer.email ? `mailto:${footer.email.replace(/^mailto:/, "")}` : null;

  const linkler = [
    { href: footer.github, ikon: FaGithub, ad: "GitHub" },
    { href: footer.linkedin, ikon: FaLinkedin, ad: "LinkedIn" },
    { href: mail, ikon: FaEnvelope, ad: "E-mail" },
    { href: footer.instagram, ikon: FaInstagram, ad: "Instagram" },
  ].filter((l) => l.href);

  return (
    <footer className="border-t border-line">
      <div className="container-site flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <p className="font-mono text-sm font-semibold">
            <span className="text-accent">~/</span>
            {isim.toLowerCase().replace(/\s+/g, "-")}
          </p>
          {footer.aciklama && <p className="mt-2 text-sm text-muted">{footer.aciklama}</p>}
        </div>

        <div className="flex items-center gap-2">
          {linkler.map(({ href, ikon: Ikon, ad }) => (
            <a
              key={ad}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={ad}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
            >
              <Ikon />
            </a>
          ))}
          <a
            href="#"
            aria-label={t.yukari}
            title={t.yukari}
            className="ml-2 grid h-10 w-10 place-items-center rounded-full bg-accent text-bg transition-transform hover:-translate-y-0.5"
          >
            <FiArrowUp />
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-site py-5 text-center font-mono text-xs text-muted md:text-left">
          © {new Date().getFullYear()} {isim}. {t.haklar}
        </p>
      </div>
    </footer>
  );
}
