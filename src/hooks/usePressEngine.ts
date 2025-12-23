import { useCallback, useMemo, useState } from "react";

export type Cosmetic = "default" | "neon" | "hazard";

export type PressEvent =
  | { type: "none" }
  | { type: "message"; message: string; rarity: "common" | "rare" }
  | { type: "cosmetic"; cosmetic: Cosmetic; message: string };

type PressResponse = {
  globalCount: number;
  event: PressEvent;
  unlocked: Cosmetic[];
  active: Cosmetic;
};

const LS_KEY = "button0_state_v1";

/**
 * Mock “/press” engine:
 * - Designed for rapid clicking: minimal work, deterministic state updates.
 * - Rare event rates can be tuned later; for now:
 *   - message: ~0.9%
 *   - rare message: within message bucket
 *   - cosmetic: very rare
 */
export function usePressEngine() {
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as { globalCount: number; unlocked: Cosmetic[]; active: Cosmetic };
    } catch {
      return null;
    }
  }, []);

  const [globalCount, setGlobalCount] = useState<number>(initial?.globalCount ?? 0);
  const [unlocked, setUnlocked] = useState<Cosmetic[]>(initial?.unlocked ?? ["default"]);
  const [active, setActive] = useState<Cosmetic>(initial?.active ?? "default");

  const messagesCommon = useMemo(
    () => [
      "ACK.",
      "RECORDED.",
      "YOU PRESSED IT.",
      "SIGNAL CONFIRMED.",
      "NO RESPONSE.",
      "STAY HERE.",
      "AGAIN.",
      "EVENT: NULL",
      "COUNTER MOVED.",
      "SYSTEM LISTENS.",
    ],
    []
  );

  const messagesRare = useMemo(
    () => [
      "YOU WERE NOT SUPPOSED TO SEE THIS.",
      "THE BUTTON REMEMBERS.",
      "SOMEONE IS COUNTING WITH YOU.",
      "THE SURFACE IS NOT THE SYSTEM.",
      "A LOW-FREQUENCY HANDSHAKE COMPLETED.",
      "THE ROOM SHIFTED. DID YOU FEEL IT?",
      "THIS LOOKS LIKE NOTHING. IT ISN’T.",
    ],
    []
  );

  const cosmeticLines: Record<Cosmetic, string> = useMemo(
    () => ({
      default: "COSMETIC: MATTE / BASELINE",
      neon: "COSMETIC UNLOCKED: NEON OUTLINE",
      hazard: "COSMETIC UNLOCKED: HAZARD STRIPE",
    }),
    []
  );

  const persist = useCallback(
    (next: { globalCount: number; unlocked: Cosmetic[]; active: Cosmetic }) => {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    },
    []
  );

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const press = useCallback((): PressResponse => {
    // Increment count first (feels responsive)
    const nextCount = globalCount + 1;

    // Probabilities tuned for “sometimes something happens”
    const roll = Math.random();

    // 0.9%: message events
    const MESSAGE_P = 0.009;

    // 0.06%: cosmetic unlock (ultra rare)
    const COSMETIC_P = 0.0006;

    let event: PressEvent = { type: "none" };

    let nextUnlocked = unlocked;
    let nextActive = active;

    // Cosmetic roll (super rare), but don’t unlock duplicates
    if (roll < COSMETIC_P) {
      const candidates: Cosmetic[] = (["neon", "hazard"] as Cosmetic[]).filter((c) => !unlocked.includes(c));
      const cosmetic: Cosmetic = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : "default";
      event = { type: "cosmetic", cosmetic, message: cosmeticLines[cosmetic] };

      if (cosmetic !== "default" && !unlocked.includes(cosmetic)) {
        nextUnlocked = [...unlocked, cosmetic];
      }
      // auto-apply the unlocked cosmetic (feels rewarding)
      nextActive = cosmetic === "default" ? nextActive : cosmetic;
    } else if (roll < COSMETIC_P + MESSAGE_P) {
      // Message roll
      const rare = Math.random() < 0.14; // 14% of messages are “rare”
      const message = rare ? pick(messagesRare) : pick(messagesCommon);
      event = { type: "message", message, rarity: rare ? "rare" : "common" };
    }

    // Update state
    setGlobalCount(nextCount);
    setUnlocked(nextUnlocked);
    setActive(nextActive);

    persist({ globalCount: nextCount, unlocked: nextUnlocked, active: nextActive });

    return {
      globalCount: nextCount,
      event,
      unlocked: nextUnlocked,
      active: nextActive,
    };
  }, [active, cosmeticLines, globalCount, messagesCommon, messagesRare, persist, unlocked]);

  const setCosmetic = useCallback(
    (c: Cosmetic) => {
      if (!unlocked.includes(c)) return;
      setActive(c);
      persist({ globalCount, unlocked, active: c });
    },
    [globalCount, persist, unlocked]
  );

  return {
    globalCount,
    unlocked,
    active,
    press,
    setCosmetic,
  };
}
