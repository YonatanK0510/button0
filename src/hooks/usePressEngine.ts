import { useCallback, useEffect, useMemo, useState } from "react";
import { getOrCreateDeviceId } from "./persistence";
import { COSMETICS } from "../data/cosmetics";

export type CosmeticId = (typeof COSMETICS[number])["id"];

export type Button0Event =
  | { kind: "none" }
  | { kind: "glitch"; title: string; flavor: string; at: number }
  | {
      kind: "unlock";
      title: string;
      flavor: string;
      unlockedId?: CosmeticId;
      unlockedName?: string;
      tier?: "normal" | "ultra";
      at: number;
    };

const LS_KEY = "button0_state_v1";

type PersistState = {
  myClicks: number;
  unlocked: CosmeticId[];
  selected: CosmeticId;
};

const GLITCH_P = 0.005;  // reduced from 0.05
const UNLOCK_P = 0.0005; // reduced from 0.005

const glitchFlavors = [
  "SYSTEM SKINNY.",
  "SURFACE FOLDS.",
  "ECHOES REVERBERATE.",
  "UNSTABLE HANDSHAKE.",
  "TRACE: FLICKER.",
  "NOISE: SYNTH.",
];

const unlockFlavors = [
  "SIGNAL ACQUIRED.",
  "HANDSHAKE SUCCEEDED.",
  "THE SURFACE GIVES.",
  "CREDENTIALS: AWAKENED.",
  "PHASE: COMPLETE.",
  "NOISE: PATTERN LOCKED.",
];

const DEFAULT_STATE: PersistState = { myClicks: 0, unlocked: ["default"], selected: "default" };

function readState(): PersistState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistState> | null;
    if (!parsed) return DEFAULT_STATE;
    const myClicks = typeof parsed.myClicks === "number" && Number.isFinite(parsed.myClicks) ? parsed.myClicks : 0;
    const unlocked = Array.isArray(parsed.unlocked) ? (parsed.unlocked as CosmeticId[]) : ["default"];
    const selected = typeof parsed.selected === "string" ? parsed.selected : "default";
    return { myClicks, unlocked, selected };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: PersistState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function usePressEngine() {
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  const initial = useMemo(() => readState(), []);
  const [myClicks, setMyClicks] = useState<number>(initial.myClicks);
  const [unlocked, setUnlocked] = useState<CosmeticId[]>(initial.unlocked);
  const [selected, setSelected] = useState<CosmeticId>(initial.selected);

  const [lastEvent, setLastEvent] = useState<Button0Event>({ kind: "none" });

  useEffect(() => {
    writeState({ myClicks, unlocked, selected });
  }, [myClicks, unlocked, selected]);

  useEffect(() => {
    if (lastEvent.kind === "none") return;
    const t = window.setTimeout(() => setLastEvent({ kind: "none" }), 2600);
    return () => clearTimeout(t);
  }, [lastEvent]);

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const press = useCallback(() => {
    const nextClicks = myClicks + 1;
    setMyClicks(nextClicks);

    // RNG
    const roll = Math.random();
    let event: Button0Event = { kind: "none" };

    if (roll < UNLOCK_P) {
      // unlock flow
      const tierRoll = Math.random();
      const tryTier: ("normal" | "ultra")[] = tierRoll < 0.8 ? ["normal", "ultra"] : ["ultra", "normal"];
      let unlockedId: CosmeticId | undefined;
      let pickedTier: "normal" | "ultra" | undefined;

      for (const tier of tryTier) {
        const candidates = COSMETICS.filter((c) => c.tier === tier && !unlocked.includes(c.id)).map((c) => c.id);
        if (candidates.length) {
          unlockedId = candidates[Math.floor(Math.random() * candidates.length)];
          pickedTier = tier;
          break;
        }
      }

      if (!unlockedId) {
        event = { kind: "unlock", title: "RARE EVENT: NULL", flavor: "NO FURTHER SIGNALS.", at: Date.now() };
      } else {
        const cosmetic = COSMETICS.find((c) => c.id === unlockedId)!;
        setUnlocked((u) => {
          const next = [...u, unlockedId!] as CosmeticId[];
          writeState({ myClicks: nextClicks, unlocked: next, selected });
          return next;
        });
        // Auto-select ultra cosmetics (makes reward feel good)
        if (COSMETICS.find((c) => c.id === unlockedId)!.tier === "ultra") {
          setSelected(unlockedId);
        }
        event = {
          kind: "unlock",
          title: "ULTRA RARE: COSMETIC UNLOCKED",
          flavor: pick(unlockFlavors),
          unlockedId,
          unlockedName: cosmetic.name,
          tier: pickedTier,
          at: Date.now(),
        };
      }
    } else if (roll < UNLOCK_P + GLITCH_P) {
      // glitch
      event = { kind: "glitch", title: "RARE EVENT: GLITCH", flavor: pick(glitchFlavors), at: Date.now() };
    } else {
      event = { kind: "none" };
    }

    setLastEvent(event);
    return { myClicks: nextClicks, event, unlocked, selected };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myClicks, selected, unlocked]);

  const selectCosmetic = useCallback(
    (id: CosmeticId) => {
      if (!unlocked.includes(id)) return;
      setSelected(id);
      writeState({ myClicks, unlocked, selected: id });
    },
    [myClicks, unlocked]
  );

  const clearEvent = useCallback(() => setLastEvent({ kind: "none" }), []);

  // Dev helpers (safe: just expose functions; they are inert unless used)
  const devSimulateGlitch = useCallback(() => {
    setLastEvent({ kind: "glitch", title: "GLITCH DETECTED", flavor: pick(glitchFlavors), at: Date.now() });
  }, []);

  const devSimulateUnlockUltra = useCallback(() => {
    // try to unlock one ultra cosmetic that is currently locked
    const candidates = COSMETICS.filter((c) => c.tier === "ultra" && !unlocked.includes(c.id)).map((c) => c.id);
    if (candidates.length === 0) {
      setLastEvent({ kind: "unlock", title: "COSMETIC UNLOCKED", flavor: "NO FURTHER SIGNALS.", at: Date.now() });
      return;
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const cosmetic = COSMETICS.find((c) => c.id === chosen)!;
    setUnlocked((u) => {
      const next = [...u, chosen];
      // auto-select ultras
      setSelected(chosen);
      writeState({ myClicks, unlocked: next, selected: chosen });
      return next;
    });
    setLastEvent({
      kind: "unlock",
      title: "COSMETIC UNLOCKED",
      flavor: pick(unlockFlavors),
      unlockedId: chosen,
      unlockedName: cosmetic.name,
      tier: "ultra",
      at: Date.now(),
    });
  }, [myClicks, unlocked]);

  return {
    deviceId,
    myClicks,
    unlocked,
    selected,
    press,
    selectCosmetic,
    lastEvent,
    clearEvent,
    // dev helpers
    devSimulateGlitch,
    devSimulateUnlockUltra,
    allCosmetics: COSMETICS,
  };
}
