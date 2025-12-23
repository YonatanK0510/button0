import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ButtonCore } from "./components/ButtonCore";
import { Overlay } from "./components/Overlay";
import { StatusBar } from "./components/StatusBar";
import { usePressEngine } from "./hooks/usePressEngine";
import { useSound } from "./hooks/useSounds";

export default function App() {
  const { globalCount, unlocked, active, press, setCosmetic } = usePressEngine();
  const { muted, toggleMuted, click, rare } = useSound();

  // Overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("SIGNAL");
  const [overlayBody, setOverlayBody] = useState("");
  const [overlayAccent, setOverlayAccent] = useState<"g" | "y" | "r">("g");

  // For glitch flashes (incrementing key triggers an animation)
  const [glitchPulse, setGlitchPulse] = useState(0);

  // Subtle system status microtext
  const statusBase = useMemo(
    () => ["SYS: IDLE", "SYS: LISTENING", "SYS: STABLE", "SYS: READY", "SYS: NOMINAL"],
    []
  );
  const [statusText, setStatusText] = useState(statusBase[0]);

  // Rapid press handling:
  // - Don’t block clicks with overlay.
  // - Keep press feedback immediate.
  // - Use a small “cooldown” only for overlay spam.
  const lastOverlayAt = useRef<number>(0);

  const openOverlay = (title: string, body: string, accent: "g" | "y" | "r") => {
    const now = Date.now();
    // prevent overlay spam if user is machine-gunning clicks
    if (now - lastOverlayAt.current < 900) return;
    lastOverlayAt.current = now;

    setOverlayTitle(title);
    setOverlayBody(body);
    setOverlayAccent(accent);
    setOverlayOpen(true);
  };

  const onPress = () => {
    // Immediate satisfying click feedback
    click();

    // Glitch pulse every press (subtle) — this is what makes spam-clicking feel good
    setGlitchPulse((p) => p + 1);

    const res = press();

    // Update micro status occasionally for flavor
    if (res.event.type !== "none") {
      setStatusText("SYS: SIGNAL DETECTED");
      window.setTimeout(() => setStatusText(statusBase[Math.floor(Math.random() * statusBase.length)]), 1000);
    } else if (Math.random() < 0.06) {
      setStatusText(statusBase[Math.floor(Math.random() * statusBase.length)]);
    }

    if (res.event.type === "message") {
      if (res.event.rarity === "rare") {
        rare();
        openOverlay("RARE SIGNAL", res.event.message, "g");
      } else {
        openOverlay("SIGNAL", res.event.message, "g");
      }
    }

    if (res.event.type === "cosmetic") {
      // stronger sound + overlay
      rare();
      const accent = res.event.cosmetic === "hazard" ? "y" : "g";
      openOverlay("UNLOCK", res.event.message, accent);
    }
  };

  return (
    <div className="b0-bg relative h-full w-full text-b0-fg">
      {/* overlays */}
      <div className="b0-scanlines animate-flicker" />
      <div className="b0-noise animate-noiseShift" />
      <div className="b0-vignette" />

      {/* moving scan bar (very subtle) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen">
        <div className="absolute left-0 right-0 top-0 h-[22%] bg-gradient-to-b from-white/30 to-transparent blur-2xl animate-scan" />
      </div>

      {/* Title / top micro UI */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center pt-8">
        <div className="flex items-baseline gap-3">
          <div className="font-mono text-xs tracking-[0.52em] text-white/55">BUTTON0</div>
          <div className="font-mono text-[11px] tracking-[0.28em] text-white/35">button-zero</div>
        </div>
      </div>

      {/* Main center */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <ButtonCore cosmetic={active} onPress={onPress} glitchPulse={glitchPulse} />

        <motion.div
          className="mt-6 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="font-mono text-[11px] tracking-[0.34em] text-white/45">
            GLOBAL PRESSES:{" "}
            <span className={active === "hazard" ? "text-b0-y" : "text-b0-g"}>{globalCount.toLocaleString()}</span>
          </div>

          {/* Cosmetic row (only shows what’s unlocked; very subtle, not “menu-y”) */}
          <div className="flex items-center gap-2">
            {unlocked.map((c) => (
              <button
                key={c}
                onClick={() => setCosmetic(c)}
                className={[
                  "rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.24em] transition",
                  "bg-black/35 backdrop-blur",
                  c === active ? "border-white/20 text-white/75" : "border-white/10 text-white/45 hover:text-white/65",
                  c === "neon" && c === active ? "shadow-neonG" : "",
                  c === "hazard" && c === active ? "shadow-neonY" : "",
                ].join(" ")}
                title="Cosmetic"
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-2 font-mono text-[10px] tracking-[0.28em] text-white/25">
            MOST OF THE TIME, NOTHING HAPPENS.
          </div>
        </motion.div>
      </div>

      <StatusBar text={statusText} muted={muted} onToggleMute={toggleMuted} />

      <Overlay
        open={overlayOpen}
        title={overlayTitle}
        body={overlayBody}
        accent={overlayAccent}
        onClose={() => setOverlayOpen(false)}
      />
    </div>
  );
}
