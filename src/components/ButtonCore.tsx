import { motion } from "framer-motion";
import { COSMETICS } from "../data/cosmetics";
import type { CosmeticMeta } from "../data/cosmetics";

function getMeta(id: string): CosmeticMeta {
  return COSMETICS.find((c) => c.id === id) ?? COSMETICS[0];
}

export function ButtonCore({
  cosmetic,
  onPress,
  glitchPulse,
}: {
  cosmetic: string;
  onPress: () => void;
  glitchPulse: number;
}) {
  const meta = getMeta(cosmetic);
  const theme = {
    ring: meta.tokens.ringClass ?? "",
    accent: meta.tokens.accentClass ?? "text-white/85",
    sub: meta.tokens.ringClass ? `${meta.tokens.ringClass}/20` : "border-white/12",
  };

  return (
    <div className="relative">
      {/* Ultra-specific decorative layers */}
      {meta.id === "prism" && (
        <div className="pointer-events-none absolute inset-0 -z-6 overflow-hidden rounded-[36px]">
          <div className="absolute inset-0 opacity-70 blur-[8px] animate-prism-sweep" style={{ background: meta.tokens.auraStyle, mixBlendMode: "screen" }} />
          <div className="absolute inset-0 -z-2" style={{ backdropFilter: "hue-rotate(8deg)" }} />
        </div>
      )}

      {meta.id === "specter" && (
        <div className="pointer-events-none absolute inset-0 -z-6">
          <div className="absolute inset-0 -translate-x-2 opacity-50" style={{ background: meta.tokens.auraStyle, mixBlendMode: "screen", filter: "blur(6px)", animation: "specter-flicker 2.6s infinite" }} />
          <div className="absolute inset-0 translate-x-2 opacity-40" style={{ background: meta.tokens.auraStyle, mixBlendMode: "screen", filter: "blur(6px) contrast(0.9)", animation: "specter-flicker 2.1s infinite" }} />
        </div>
      )}

      {meta.id === "hazard" && (
        <div className="pointer-events-none absolute inset-0 -z-6 rounded-[36px] overflow-hidden">
          <div className="absolute inset-0 opacity-70 animate-hazard-stripes" style={{ background: "repeating-linear-gradient(90deg, rgba(214,255,0,0.14) 0 8px, transparent 8px 16px)" }} />
        </div>
      )}

      {/* Glitch flash layer (keyed by glitchPulse) */}
      <motion.div
        key={String(glitchPulse)}
        className="pointer-events-none absolute inset-[-40px] -z-10 rounded-[44px] opacity-0"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: [0, 0.35, 0], scale: [0.98, 1.02, 1.0] }}
        transition={{ duration: 0.28 }}
        style={{
          background: meta.tokens.auraStyle || (meta.tier === "ultra" ? "radial-gradient(closest-side, rgba(214,255,0,0.18), transparent 70%)" : "radial-gradient(closest-side, rgba(45,255,122,0.12), transparent 70%)"),
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

        {/* Ultra cosmetic extra detail */}
        {meta.tier === "ultra" && (
          <div className="pointer-events-none absolute inset-0 -z-5 rounded-[40px] opacity-60">
            <motion.div
              animate={{ rotate: [0, 2, -1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-[40px]"
              style={{ background: meta.tokens.auraStyle, mixBlendMode: "screen", filter: "blur(10px)" }}
            />
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
          background: meta.tokens.auraStyle || (meta.tier === "ultra" ? "radial-gradient(closest-side, rgba(214,255,0,0.10), transparent 70%)" : "radial-gradient(closest-side, rgba(45,255,122,0.09), transparent 70%)"),
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
