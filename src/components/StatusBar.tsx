export function StatusBar({
  text,
  muted,
  onToggleMute,
}: {
  text: string;
  muted: boolean;
  onToggleMute: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-4 z-20 flex items-center gap-3">
      <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] tracking-[0.22em] text-white/55 backdrop-blur">
        {text}
      </div>
      <button
        onClick={onToggleMute}
        className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] tracking-[0.22em] text-white/55 hover:bg-white/5 backdrop-blur"
        aria-label="Toggle mute"
        title="Toggle sound"
      >
        {muted ? "SND: OFF" : "SND: ON"}
      </button>
    </div>
  );
}
