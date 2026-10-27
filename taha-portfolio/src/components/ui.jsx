import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

// Görünür alana girince yumuşakça beliren sarmalayıcı.
// Alt kenardaki pozitif pay sayesinde içerik ekrana girmeden hemen önce belirir, kaydırırken boş ekran kalmaz.
export function Reveal({ children, delay = 0, y = 24, className = "", as = "div" }) {
  const Etiket = motion[as];
  return (
    <Etiket
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 15% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Etiket>
  );
}

export function SectionHeading({ no, baslik, alt }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="mb-3 font-mono text-sm text-accent">
        <span className="text-muted">{"//"}</span> {no}
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{baslik}</h2>
      {alt && <p className="mt-3 max-w-xl text-muted">{alt}</p>}
    </Reveal>
  );
}

// İmlecin konumunu CSS değişkenine yazar; .spotlight sınıfı ışığı çizer
export function SpotlightCard({ children, className = "", as = "div", ...props }) {
  const Etiket = as;
  const izle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Etiket
      onMouseMove={izle}
      className={`kart spotlight transition-[border-color,transform] duration-300 hover:border-accent/40 ${className}`}
      {...props}
    >
      {children}
    </Etiket>
  );
}

// İmlece doğru hafifçe çekilen buton/link
export function Magnetic({ children, guc = 0.3 }) {
  const ref = useRef(null);
  const azHareket = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const hareket = (e) => {
    if (azHareket) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * guc);
    y.set((e.clientY - (r.top + r.height / 2)) * guc);
  };
  const sifirla = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={hareket} onMouseLeave={sifirla} className="inline-block">
      {children}
    </motion.div>
  );
}
