import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const TIKLANABILIR = "a, button, [role='button'], input, textarea, select, label, [data-cursor='hover']";

// Nokta + takip eden halka + arka planda yumuşak ışık.
// Dokunmatik cihazlarda ve "azaltılmış hareket" tercihinde devre dışı kalır.
export default function Cursor() {
  const [aktif, setAktif] = useState(false);
  const [gorunur, setGorunur] = useState(false);
  const [hover, setHover] = useState(false);
  const [basili, setBasili] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const halkaX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const halkaY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });
  const isikX = useSpring(x, { stiffness: 60, damping: 20 });
  const isikY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const uygun = matchMedia("(hover: hover) and (pointer: fine)");
    const azHareket = matchMedia("(prefers-reduced-motion: reduce)");
    const kontrol = () => setAktif(uygun.matches && !azHareket.matches);
    kontrol();
    uygun.addEventListener("change", kontrol);
    azHareket.addEventListener("change", kontrol);
    return () => {
      uygun.removeEventListener("change", kontrol);
      azHareket.removeEventListener("change", kontrol);
    };
  }, []);

  useEffect(() => {
    if (!aktif) return;
    const kok = document.documentElement;
    kok.classList.add("cursor-ozel");

    const hareket = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setGorunur(true);
      setHover(!!e.target.closest?.(TIKLANABILIR));
    };
    const ayril = () => setGorunur(false);
    const bas = () => setBasili(true);
    const birak = () => setBasili(false);

    window.addEventListener("pointermove", hareket);
    document.addEventListener("pointerleave", ayril);
    window.addEventListener("pointerdown", bas);
    window.addEventListener("pointerup", birak);
    return () => {
      kok.classList.remove("cursor-ozel");
      window.removeEventListener("pointermove", hareket);
      document.removeEventListener("pointerleave", ayril);
      window.removeEventListener("pointerdown", bas);
      window.removeEventListener("pointerup", birak);
    };
  }, [aktif, x, y]);

  if (!aktif) return null;

  return (
    <>
      {/* Arka plan ışığı */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full"
        style={{
          x: isikX,
          y: isikY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgb(var(--accent) / 0.10), transparent 60%)",
          opacity: gorunur ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      />
      {/* Halka */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-accent"
        style={{ x: halkaX, y: halkaY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hover ? 56 : 32,
          height: hover ? 56 : 32,
          opacity: gorunur ? 1 : 0,
          scale: basili ? 0.8 : 1,
          backgroundColor: hover ? "rgb(var(--accent) / 0.12)" : "rgb(var(--accent) / 0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
      {/* Nokta */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: gorunur ? 1 : 0, scale: hover ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
