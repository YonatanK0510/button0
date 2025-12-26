export function getOrCreateDeviceId(): string {
  const KEY = "button0_device_id_v1";
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    // Prefer crypto.randomUUID if available
    const id = (crypto as any)?.randomUUID?.() ?? generateFallbackUUID();
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return generateFallbackUUID();
  }
}

function generateFallbackUUID() {
  // simple RFC4122 v4-like fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-mixed-operators
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}