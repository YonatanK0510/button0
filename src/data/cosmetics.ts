export type CosmeticTier = "normal" | "ultra";

export type CosmeticMeta = {
  id: string;
  name: string;
  tier: CosmeticTier;
  description: string;
  // UI tokens (tailwind classes / small data)
  tokens: {
    accentClass?: string;
    ringClass?: string;
    auraStyle?: string;
    extra?: string;
  };
};

export const COSMETICS: CosmeticMeta[] = [
  {
    id: "default",
    name: "MATTE",
    tier: "normal",
    description: "Baseline matte finish",
    tokens: { accentClass: "text-white/85", ringClass: "", auraStyle: "" },
  },
  {
    id: "neon",
    name: "NEON",
    tier: "normal",
    description: "Sharp neon outline",
    tokens: { accentClass: "text-b0-g", ringClass: "shadow-neonG", auraStyle: "radial-gradient(closest-side, rgba(45,255,122,0.09), transparent 70%)" },
  },
  {
    id: "amber",
    name: "AMBER",
    tier: "normal",
    description: "Warm amber glow",
    tokens: { accentClass: "text-amber-300", ringClass: "shadow-neonY", auraStyle: "radial-gradient(closest-side, rgba(245,158,11,0.08), transparent 70%)" },
  },
  {
    id: "violet",
    name: "VIOLET",
    tier: "normal",
    description: "Soft violet sheen",
    tokens: { accentClass: "text-violet-400", ringClass: "", auraStyle: "radial-gradient(closest-side, rgba(139,92,246,0.06), transparent 70%)" },
  },
  {
    id: "cyan",
    name: "CYAN",
    tier: "normal",
    description: "Cool cyan tint",
    tokens: { accentClass: "text-cyan-300", ringClass: "", auraStyle: "radial-gradient(closest-side, rgba(6,182,212,0.06), transparent 70%)" },
  },
  {
    id: "ember",
    name: "EMBER",
    tier: "normal",
    description: "Smoldering ember edge",
    tokens: { accentClass: "text-rose-400", ringClass: "", auraStyle: "radial-gradient(closest-side, rgba(255,94,94,0.06), transparent 70%)" },
  },

  // Ultra cosmetics
  {
    id: "hazard",
    name: "HAZARD",
    tier: "ultra",
    description: "Stripes + high intensity",
    tokens: { accentClass: "text-b0-y", ringClass: "shadow-neonY", auraStyle: "repeating-linear-gradient(90deg, rgba(214,255,0,0.20) 0 8px, transparent 8px 16px)" },
  },
  {
    id: "prism",
    name: "PRISM",
    tier: "ultra",
    description: "Animated chromatic sweep",
    tokens: { accentClass: "text-white/85", ringClass: "shadow-neonG", auraStyle: "linear-gradient(90deg, rgba(255,46,46,0.12), rgba(45,255,122,0.12), rgba(214,255,0,0.12))" },
  },
  {
    id: "specter",
    name: "SPECTER",
    tier: "ultra",
    description: "Chromatic offset + flicker",
    tokens: { accentClass: "text-white/85", ringClass: "shadow-neonG", auraStyle: "radial-gradient(closest-side, rgba(45,255,122,0.16), transparent 60%)" },
  },
];

export function getCosmetic(id: string) {
  return COSMETICS.find((c) => c.id === id);
}