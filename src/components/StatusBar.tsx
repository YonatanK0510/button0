import React from "react";
import type { CosmeticMeta } from "../data/cosmetics";

export function StatusBar({
  myClicks,
  deviceId,
  selected,
  unlocked,
  onSelect,
  cosmetics,
}: {
  myClicks: number;
  deviceId: string;
  selected: string;
  unlocked: string[];
  cosmetics: CosmeticMeta[];
  onSelect: (id: string) => void;
}) {
  const shortId = deviceId.slice(0, 6);
  return (
    <div className="fixed bottom-4 left-4 z-20 flex flex-col gap-3">
      <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] tracking-[0.22em] text-white/55 backdrop-blur flex gap-3 items-center">
        <div>
          MY CLICKS:
          <span className="font-semibold text-white/85 ml-1">
            {(myClicks ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="ml-3">
          DEVICE:
          <span className="font-mono text-xs ml-1">{shortId}</span>
        </div>
        <div className="ml-3">
          SELECTED:
          <span className="ml-1 text-white/75 font-mono text-xs">
            {
              cosmetics.find((c) => c.id === selected)?.name ?? selected
            }
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/6 bg-black/40 px-3 py-2 backdrop-blur flex gap-2 items-center">
        {cosmetics.map((c) => {
          const locked = !unlocked.includes(c.id);
          const active = c.id === selected;
          return (
            <button
              key={c.id}
              onClick={() => !locked && onSelect(c.id)}
              disabled={locked}
              className={[
                "rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.12em]",
                locked
                  ? "opacity-40 cursor-not-allowed border-white/8 bg-black/20 text-white/30"
                  : active
                  ? "border-white/20 bg-black/35 text-white/75"
                  : "border-white/10 bg-black/20 text-white/45 hover:text-white/60",
              ].join(" ")}
              title={c.description}
            >
              {locked ? `${c.name} (LOCKED)` : c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
