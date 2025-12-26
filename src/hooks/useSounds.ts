import { useCallback, useEffect, useRef, useState } from "react";

type AudioState = {
  muted: boolean;
  toggleMuted: () => void;
  click: () => void;
  glitch: () => void;
  unlock: () => void;
  rare: () => void;
};

const LS_MUTE = "button0_mute_v1";

/**
 * WebAudio, no external assets.
 * Designed for rapid presses: short envelopes, minimal nodes.
 */
export function useSound(): AudioState {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    const raw = localStorage.getItem(LS_MUTE);
    return raw ? raw === "1" : false;
  });

  useEffect(() => {
    localStorage.setItem(LS_MUTE, muted ? "1" : "0");
  }, [muted]);

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }, []);

  const click = useCallback(() => {
    if (muted) return;
    const ctx = ensure();
    const t0 = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t0);
    osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.03);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t0);
    osc.stop(t0 + 0.06);

    // Clean up after stop
    const cleanup = () => {
      try {
        gain.disconnect();
        osc.disconnect();
      } catch {}
    };
    osc.onended = cleanup;
  }, [ensure, muted]);

  const glitch = useCallback(() => {
    if (muted) return;
    const ctx = ensure();
    const t0 = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "square";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(520, t0);
    osc2.frequency.setValueAtTime(640, t0);
    osc2.detune.setValueAtTime(30, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t0);
    osc2.start(t0 + 0.005);
    osc1.stop(t0 + 0.12);
    osc2.stop(t0 + 0.13);

    const cleanup = () => {
      try {
        gain.disconnect();
        osc1.disconnect();
        osc2.disconnect();
      } catch {}
    };
    osc2.onended = cleanup;
  }, [ensure, muted]);

  const unlock = useCallback(() => {
    if (muted) return;
    const ctx = ensure();
    const t0 = ctx.currentTime;

    // multi-note riser: fuller and longer (≈700ms) with clean cleanup
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(0.36, t0 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.72);

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    oscA.type = "sawtooth";
    oscB.type = "sine";

    // schedule a riser across notes (three stages)
    oscA.frequency.setValueAtTime(220, t0);
    oscA.frequency.linearRampToValueAtTime(440, t0 + 0.18);
    oscA.frequency.linearRampToValueAtTime(720, t0 + 0.48);

    oscB.frequency.setValueAtTime(330, t0);
    oscB.frequency.linearRampToValueAtTime(660, t0 + 0.32);

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(ctx.destination);

    oscA.start(t0);
    oscB.start(t0 + 0.02);
    oscA.stop(t0 + 0.72);
    oscB.stop(t0 + 0.72);

    const cleanup = () => {
      try {
        gain.disconnect();
        oscA.disconnect();
        oscB.disconnect();
      } catch {}
    };
    oscB.onended = cleanup;
  }, [ensure, muted]);

  // alias for older usage
  const rare = useCallback(() => glitch(), [glitch]);

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMuted, click, glitch, unlock, rare };
}
