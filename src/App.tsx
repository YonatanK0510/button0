import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonCore } from "./components/ButtonCore";
import { useSound } from "./hooks/useSounds";
import { StatusBar } from "./components/StatusBar";
import { usePressEngine } from "./hooks/usePressEngine";
import type { Button0Event } from "./hooks/usePressEngine";

export default function App() {
  const {
    deviceId,
    myClicks,
    unlocked,
    selected,
    allCosmetics,
    press,
    selectCosmetic,
    lastEvent,
    clearEvent,
    devSimulateGlitch,
    devSimulateUnlockUltra,
  } = usePressEngine();
  const sound = useSound();

  const [toast, setToast] = useState<Button0Event | null>(null);
  const hideRef = useRef<number | null>(null);

  useEffect(() => {
    // Ensure only one toast at a time; clear previous timeout before scheduling a new one.
    if (lastEvent.kind !== "none") {
      if (hideRef.current) {
        window.clearTimeout(hideRef.current);
        hideRef.current = null;
      }

      // show current event as the single toast
      setToast(lastEvent);

      // play appropriate sound
      if (lastEvent.kind === "glitch") sound.glitch();
      else if (lastEvent.kind === "unlock") sound.unlock();

      hideRef.current = window.setTimeout(() => {
        setToast(null);
        clearEvent();
        hideRef.current = null;
      }, 1500);

      return () => {
        if (hideRef.current) {
          window.clearTimeout(hideRef.current);
          hideRef.current = null;
        }
      };
    }
    // if no event, ensure toast cleared
    setToast(null);
    return undefined;
  }, [lastEvent, clearEvent]);

  const onPress = () => {
    // user interaction: ensure sound resumes/starts and play click
    sound.click();
    press();
  };

  const DEV_CHEATS = false; // Set to false to disable dev keybinds
  // Attach dev key bindings only when DEV_CHEATS is true
  useEffect(() => {
    if (!DEV_CHEATS) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "g" || e.key === "G") {
        console.log("DEV: simulate GLITCH");
        devSimulateGlitch();
      } else if (e.key === "u" || e.key === "U") {
        console.log("DEV: simulate UNLOCK ULTRA");
        devSimulateUnlockUltra();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [devSimulateGlitch, devSimulateUnlockUltra]);

  return (
    <div className="b0-bg relative h-full w-full text-b0-fg">
      <div className="b0-scanlines animate-flicker" />
      <div className="b0-noise animate-noiseShift" />
      <div className="b0-vignette" />

      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center pt-8">
        <div className="flex items-baseline gap-3">
          <div className="font-mono text-xs tracking-[0.52em] text-white/55">BUTTON0</div>
          <div className="font-mono text-[11px] tracking-[0.28em] text-white/35">button-zero</div>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <ButtonCore cosmetic={selected} onPress={onPress} glitchPulse={lastEvent.kind !== "none" ? lastEvent.at : 0} />

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-6 flex flex-col items-center gap-2">
          <div className="font-mono text-[11px] tracking-[0.34em] text-white/45">MOST OF THE TIME, NOTHING HAPPENS.</div>
        </motion.div>
      </div>

      <StatusBar
        myClicks={myClicks}
        deviceId={deviceId}
        selected={selected}
        unlocked={unlocked}
        cosmetics={allCosmetics}
        onSelect={(id) => selectCosmetic(id)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            key={String((toast as any)?.at ?? Date.now())}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="rounded-lg border border-white/10 bg-black/75 px-4 py-2 font-mono text-sm text-white/90 backdrop-blur pointer-events-none">
              <div className="font-semibold">
                {toast.kind === "glitch" ? "GLITCH DETECTED" : toast.kind === "unlock" ? "COSMETIC UNLOCKED" : ""}
              </div>
              {toast.kind !== "none" && (toast as any).flavor && (
                <div className="text-[10px] tracking-[0.22em] text-white/60">
                  {(toast as any).flavor}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}