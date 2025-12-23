import { motion } from "framer-motion";
import type { Cosmetic } from "../hooks/usePressEngine";

function cosmeticClasses(c: Cosmetic) {
  switch (c) {
    case "neon":
      return {
        ring: "shadow-neonG",
        accent: "text-b0-g",
        sub: "border-b0-g/35",
      };
    case "hazard":
      return {
        ring: "shadow-neonY",
        accent: "text-b0-y",
        sub: "border-b0-y/35",
      };
    default:
      return {
        ring: "",
        accent: "text-white/85",
        sub: "border-white/12",
      };
  }
}

export function ButtonCore({
  cosmetic,
  onPress,
  glitchPulse,
}: {
  cosmetic: Cosmetic;
  onPress: () => void;
  glitchPulse: number;
}) {
  const theme = cosmeticClasses(cosmetic);

  return (
    <div className="relative">
      {/* Glitch flash layer (keyed by glitchPulse) */}
      <motion.div
        key={glitchPulse}
        className="pointer-events-none absolute inset-[-40px] -z-10 rounded-[44px] opacity-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: [0, 0.35, 0], scale: [0.98, 1.02, 1.0] }}
        transition={{ duration: 0.28 }}
        style={{
          background:
            cosmetic === "hazard"
              ? "radial-gradient(closest-side, rgba(214,255,0,0.25), transparent 70%)"
              : "radial-gradient(closest-side, rgba(45,255,122,0.22), transparent 70%)",
          filter: "contrast(1.2) saturate(1.2)",
          mixBlendMode: "screen",
        }}
      />

      <motion.button
        onPointerDown={onPress}
        className={[
          "group relative select-none rounded-[36px] border bg-black/55 px-10 py-8",
          "shadow-deep backdrop-blur-md",
          "outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          theme.sub,
        ].join(" ")}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.985, rotate: 0.12 }}
        transition={{ type: "spring", stiffness: 560, damping: 28 }}
        aria-label="Button0"
      >
        {/* Inner plate */}
        <div
          className={[
            "absolute inset-[10px] rounded-[28px] border border-white/10",
            "bg-gradient-to-b from-white/5 to-black/40",
          ].join(" ")}
        />

        {/* Cosmetic ring */}
        <div
          className={[
            "absolute inset-0 rounded-[36px] opacity-70 transition-opacity duration-200",
            "group-hover:opacity-90",
            theme.ring,
          ].join(" ")}
        />

        {/* Hazard stripe detail */}
        {cosmetic === "hazard" && (
          <div className="pointer-events-none absolute left-4 top-4 h-10 w-24 rotate-[-12deg] rounded-xl border border-b0-y/30 bg-b0-y/10">
            <div className="h-full w-full rounded-xl bg-[repeating-linear-gradient(90deg,rgba(214,255,0,0.35)_0px,rgba(214,255,0,0.35)_8px,transparent_8px,transparent_16px)] opacity-70" />
          </div>
        )}

        {/* Text */}
        <div className="relative flex flex-col items-center justify-center gap-2">
          <motion.div
            className="font-mono text-[11px] tracking-[0.34em] text-white/50"
            animate={{ opacity: [0.65, 0.85, 0.65] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            PRESS TO SIGNAL
          </motion.div>

          <div className={["text-3xl sm:text-4xl font-semibold tracking-tight", theme.accent].join(" ")}>
            THE BUTTON
          </div>

          <div className="font-mono text-[11px] tracking-[0.28em] text-white/45">
            BUTTON0 // INTERFACE
          </div>
        </div>
      </motion.button>

      {/* “breathing” aura */}
      <motion.div
        className="pointer-events-none absolute inset-[-22px] -z-20 rounded-[46px] opacity-30"
        animate={{ opacity: [0.16, 0.28, 0.16], scale: [0.995, 1.01, 0.995] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            cosmetic === "hazard"
              ? "radial-gradient(closest-side, rgba(214,255,0,0.10), transparent 70%)"
              : "radial-gradient(closest-side, rgba(45,255,122,0.09), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
