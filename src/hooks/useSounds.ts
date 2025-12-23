import { useCallback, useEffect, useRef, useState } from "react";

type AudioState = {
  muted: boolean;
  toggleMuted: () => void;
  click: () => void;
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

    // “mechanical tick” = short triangle + subtle noise-ish highpass
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
  }, [ensure, muted]);

  const rare = useCallback(() => {
    if (muted) return;
    const ctx = ensure();

    const t0 = ctx.currentTime;

    // “glitch blip” = two fast detuned square pulses
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "square";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(520, t0);
    osc2.frequency.setValueAtTime(640, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t0);
    osc2.start(t0 + 0.01);
    osc1.stop(t0 + 0.12);
    osc2.stop(t0 + 0.13);
  }, [ensure, muted]);

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMuted, click, rare };
}
