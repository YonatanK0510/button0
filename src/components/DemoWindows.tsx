import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export type DemoPanelId = "leaderboard" | "vault" | "event" | "achievements";

type DemoWindowsProps = {
  activePanel: DemoPanelId | null;
  onClose: () => void;
  myClicks: number;
  deviceId: string;
};

type ShellProps = {
  title: string;
  subtitle: string;
  accent: string;
  onClose: () => void;
  children: ReactNode;
};

type TierLabel = "Common" | "Rare" | "Ultra" | "Glitch" | "Event";

const leaderboardDaily = [
  { name: "N0VA//RIFT", clicks: "12,894", trend: "+18%" },
  { name: "KAI-VOID", clicks: "11,440", trend: "+11%" },
  { name: "MIRA//STATIC", clicks: "10,982", trend: "+9%" },
  { name: "HEXA LUME", clicks: "9,744", trend: "+7%" },
  { name: "PULSE-09", clicks: "9,101", trend: "+5%" },
];

const leaderboardAllTime = [
  { name: "N0VA//RIFT", clicks: "2.18M", note: "Signal backbone" },
  { name: "MIRA//STATIC", clicks: "2.04M", note: "Legacy pressline" },
  { name: "KAI-VOID", clicks: "1.97M", note: "Vault founder" },
  { name: "HEXA LUME", clicks: "1.83M", note: "Event runner" },
  { name: "PULSE-09", clicks: "1.72M", note: "Glitch watcher" },
];

const vaultCosmetics = [
  { name: "Matte Core", tier: "Common", status: "Unlocked", detail: "Baseline shell", unlocked: true },
  { name: "Neon Veil", tier: "Rare", status: "Unlocked", detail: "Lattice outline", unlocked: true },
  { name: "Pulse Edge", tier: "Rare", status: "Unlocked", detail: "Reactive rim", unlocked: true },
  { name: "Amber Bloom", tier: "Ultra", status: "Unlocked", detail: "Thermal shine", unlocked: true },
  { name: "Specter Frame", tier: "Glitch", status: "Locked", detail: "Chromatic misalignment", unlocked: false },
  { name: "Hazard Ribbon", tier: "Ultra", status: "Locked", detail: "High-intensity stripe", unlocked: false },
  { name: "Signal Bloom", tier: "Event", status: "Locked", detail: "Seasonal flare", unlocked: false },
  { name: "Prism Cut", tier: "Glitch", status: "Locked", detail: "Offset refractor", unlocked: false },
  { name: "Orbit Ghost", tier: "Rare", status: "Locked", detail: "Soft trailing halo", unlocked: false },
  { name: "Delta Crown", tier: "Event", status: "Locked", detail: "Global broadcast prize", unlocked: false },
  { name: "Null Window", tier: "Common", status: "Locked", detail: "Muted interface shell", unlocked: false },
  { name: "Afterimage", tier: "Glitch", status: "Locked", detail: "Transient memory skin", unlocked: false },
] satisfies Array<{ name: string; tier: TierLabel; status: string; detail: string; unlocked: boolean }>;

const achievements = [
  { title: "First Press", description: "Complete your initial signal pulse.", progress: 100, unlocked: true, note: "Unlocked" },
  { title: "Hundred Signal", description: "Reach 100 total presses.", progress: 100, unlocked: true, note: "Unlocked" },
  { title: "Glitch Witness", description: "Observe a system anomaly.", progress: 68, unlocked: false, note: "Near threshold" },
  { title: "Cosmetic Initiate", description: "Unlock three interface layers.", progress: 75, unlocked: false, note: "3 of 4" },
  { title: "Event Participant", description: "Join a global anomaly window.", progress: 44, unlocked: false, note: "Queued" },
  { title: "Global Contributor", description: "Leave a mark on the shared signal.", progress: 52, unlocked: false, note: "Rising" },
];

const tierStyles: Record<TierLabel, string> = {
  Common: "border-white/10 bg-white/5 text-white/50",
  Rare: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  Ultra: "border-b0-y/20 bg-b0-y/10 text-b0-y",
  Glitch: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
  Event: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
};

function Shell({ title, subtitle, accent, onClose, children }: ShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="relative w-[min(92vw,980px)] overflow-hidden rounded-[28px] border border-white/10 bg-[#070707]/92 shadow-deep backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,255,122,0.08),transparent_38%),radial-gradient(circle_at_bottom,rgba(214,255,0,0.04),transparent_38%)]" />
      <div className="absolute inset-0 b0-scanlines opacity-50" />
      <div className="absolute inset-0 b0-noise opacity-25" />

      <div className="relative flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <div className={["font-mono text-[11px] tracking-[0.36em]", accent].join(" ")}>BUTTON0 // AUXILIARY WINDOW</div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-white/90 sm:text-xl">{title}</div>
          <div className="mt-1 max-w-[60ch] font-mono text-[11px] tracking-[0.18em] text-white/45">{subtitle}</div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/55 transition hover:border-white/20 hover:text-white/85"
          aria-label={`Close ${title}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative max-h-[min(78vh,780px)] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
    </motion.div>
  );
}

function SectionCard({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-5">
      <div className="font-mono text-[10px] tracking-[0.34em] text-white/35">{eyebrow}</div>
      <div className="mt-1 text-sm font-semibold tracking-wide text-white/80">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function LeaderboardPanel({ onClose, myClicks, deviceId }: { onClose: () => void; myClicks: number; deviceId: string }) {
  const projectedRank = Math.max(1, 132 - Math.floor(myClicks / 8));
  const projectedClicks = (myClicks * 26 + 420).toLocaleString();

  return (
    <Shell
      title="Leaderboard"
      subtitle="Live signal visibility for the current press cycle. Daily and all-time rankings are shown with a global rank preview for the active device."
      accent="text-b0-g"
      onClose={onClose}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Daily Top Clickers" eyebrow="TODAY / 00:00-23:59">
          <div className="space-y-2">
            {leaderboardDaily.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/4 px-3 py-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-black/35 font-mono text-[11px] text-white/45">0{index + 1}</div>
                  <div>
                    <div className="font-semibold text-white/85">{entry.name}</div>
                    <div className="font-mono text-[10px] tracking-[0.26em] text-white/35">{entry.trend}</div>
                  </div>
                </div>
                <div className="font-mono text-[11px] tracking-[0.18em] text-white/60">{entry.clicks}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Global Rank Preview" eyebrow="DEVICE SNAPSHOT">
            <div className="rounded-[20px] border border-b0-g/15 bg-b0-g/8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.34em] text-white/38">{deviceId.slice(0, 8).toUpperCase()}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-white/92">#{projectedRank}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] tracking-[0.34em] text-white/38">PROJECTED CLICKS</div>
                  <div className="mt-2 font-mono text-2xl tracking-[0.18em] text-b0-g">{projectedClicks}</div>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/55">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-b0-g/50 via-b0-y/50 to-white/30" />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/42">
                <span>GAP TO NEXT BAND: 1,240</span>
                <span>NODE STABLE</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="All-Time Clickers" eyebrow="ARCHIVE / SIGNAL HALL">
            <div className="space-y-2">
              {leaderboardAllTime.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-white/6 bg-black/25 px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-[10px] tracking-[0.24em] text-white/35">#{index + 1}</div>
                    <div>
                      <div className="font-medium text-white/82">{entry.name}</div>
                      <div className="font-mono text-[10px] tracking-[0.22em] text-white/35">{entry.note}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.18em] text-white/60">{entry.clicks}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </Shell>
  );
}

function CosmeticsVaultPanel({ onClose }: { onClose: () => void }) {
  return (
    <Shell
      title="Cosmetics Vault"
      subtitle="A long-view archive of unlocked layers and locked future states. The vault is intentionally dense to suggest a deeper progression path."
      accent="text-b0-y"
      onClose={onClose}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vaultCosmetics.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={[
              "relative overflow-hidden rounded-[22px] border p-4",
              item.unlocked ? "border-white/10 bg-white/6" : "border-white/8 bg-black/28 opacity-80",
            ].join(" ")}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_35%,rgba(255,255,255,0.02)_65%,transparent)]" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white/88">{item.name}</div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.26em] text-white/34">{item.detail}</div>
              </div>
              <div className={[
                "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.22em]",
                tierStyles[item.tier],
              ].join(" ")}
              >
                {item.tier}
              </div>
            </div>

            <div className="relative mt-5 flex items-center justify-between">
              <div className={[
                "rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.22em]",
                item.unlocked ? "border-b0-g/20 bg-b0-g/10 text-b0-g" : "border-white/10 bg-black/30 text-white/35",
              ].join(" ")}
              >
                {item.status}
              </div>
              <div className="font-mono text-[10px] tracking-[0.28em] text-white/26">VAULT {String(index + 1).padStart(2, "0")}</div>
            </div>

            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-black/45">
              <div
                className={[
                  "h-full rounded-full",
                  item.unlocked ? "bg-gradient-to-r from-b0-g/70 to-white/40" : "bg-gradient-to-r from-white/15 to-white/5",
                ].join(" ")}
                style={{ width: item.unlocked ? "100%" : "24%" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

function GlobalEventPanel({ onClose }: { onClose: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const [targetTime] = useState(() => Date.now() + 1000 * 60 * 60 * 4 + 1000 * 60 * 18 + 1000 * 32);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeLeft = Math.max(0, targetTime - now);
  const hours = Math.floor(timeLeft / 3_600_000);
  const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1000);
  const stability = Math.max(62, Math.min(94, 73 + Math.round(Math.sin(now / 6500) * 3)));

  return (
    <Shell
      title="Global Event"
      subtitle="A front-end event card for the next anomaly window. The countdown is local and presentation-only, but it adds pacing and anticipation."
      accent="text-b0-g"
      onClose={onClose}
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[26px] border border-b0-g/15 bg-[linear-gradient(180deg,rgba(45,255,122,0.10),rgba(0,0,0,0.32))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="font-mono text-[10px] tracking-[0.34em] text-white/38">NEXT GLOBAL EVENT</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white/92">Signal Distortion</div>
          <div className="mt-2 max-w-[56ch] text-sm leading-6 text-white/68">
            The shared layer is preparing for a broad-spectrum distortion. Watch the signal window, hold the interface steady, and wait for the system to bend.
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "NEXT STARTS IN", value: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` },
              { label: "STABILITY", value: `${stability}%` },
              { label: "PHASE", value: "PRE-BROADCAST" },
            ].map((entry) => (
              <div key={entry.label} className="rounded-2xl border border-white/8 bg-black/35 px-4 py-3">
                <div className="font-mono text-[10px] tracking-[0.28em] text-white/36">{entry.label}</div>
                <div className="mt-2 text-lg font-semibold text-white/88">{entry.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="Anomaly Readout" eyebrow="LIVE SIGNAL DIAGNOSTICS">
            <div className="space-y-3">
              {[
                { label: "Carrier drift", value: "stable", width: "68%" },
                { label: "Phase noise", value: "low", width: "42%" },
                { label: "Echo density", value: "building", width: "79%" },
                { label: "Field cohesion", value: "73%", width: `${stability}%` },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[11px] tracking-[0.18em] text-white/46">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/45">
                    <div className="h-full rounded-full bg-gradient-to-r from-b0-g/65 to-b0-y/45" style={{ width: row.width }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Event Notes" eyebrow="WINDOW INTELLIGENCE">
            <div className="space-y-2 font-mono text-[11px] leading-6 tracking-[0.16em] text-white/48">
              <div>• Presence spikes as the countdown nears zero.</div>
              <div>• Rare cosmetic drops remain queued during the event.</div>
              <div>• The interface is designed for demo pacing, not backend sync.</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </Shell>
  );
}

function AchievementsPanel({ onClose, myClicks }: { onClose: () => void; myClicks: number }) {
  const totalUnlocked = achievements.filter((item) => item.unlocked).length;
  const progressBase = Math.min(100, Math.floor(myClicks / 5));

  return (
    <Shell
      title="Achievements"
      subtitle="A progression layer for presentation depth. Some achievements are already lit, others remain locked with visible momentum."
      accent="text-b0-y"
      onClose={onClose}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[22px] border border-white/8 bg-black/32 px-4 py-3">
        <div className="font-mono text-[10px] tracking-[0.3em] text-white/38">SYSTEM PROGRESS</div>
        <div className="text-sm text-white/80">{totalUnlocked} unlocked</div>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/45">
          <div className="h-full rounded-full bg-gradient-to-r from-b0-g/70 via-b0-y/60 to-white/45" style={{ width: `${Math.max(48, progressBase)}%` }} />
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] text-white/38">{myClicks.toLocaleString()} PRESSES</div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={[
              "rounded-[22px] border p-4",
              achievement.unlocked ? "border-b0-g/18 bg-b0-g/7" : "border-white/8 bg-black/28",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-white/88">{achievement.title}</div>
                <div className="mt-1 text-sm leading-6 text-white/58">{achievement.description}</div>
              </div>
              <div className={[
                "rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.22em]",
                achievement.unlocked ? "border-b0-g/20 bg-b0-g/10 text-b0-g" : "border-white/10 bg-black/30 text-white/35",
              ].join(" ")}
              >
                {achievement.note}
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/45">
              <div
                className={achievement.unlocked ? "h-full rounded-full bg-gradient-to-r from-b0-g/70 to-b0-y/45" : "h-full rounded-full bg-gradient-to-r from-white/10 to-white/25"}
                style={{ width: `${achievement.progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/38">
              <span>{achievement.unlocked ? "UNLOCKED" : "LOCKED"}</span>
              <span>{achievement.progress}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

export function DemoDock({ activePanel, onOpen }: { activePanel: DemoPanelId | null; onOpen: (panel: DemoPanelId) => void }) {
  const items: Array<{ id: DemoPanelId; label: string; short: string }> = [
    { id: "leaderboard", label: "Leaderboard", short: "LB" },
    { id: "vault", label: "Cosmetics Vault", short: "CV" },
    { id: "event", label: "Global Event", short: "EV" },
    { id: "achievements", label: "Achievements", short: "AC" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-20 flex flex-wrap items-center justify-end gap-2 rounded-full border border-white/10 bg-black/55 p-2 shadow-deep backdrop-blur-md">
      <div className="hidden px-3 font-mono text-[10px] tracking-[0.3em] text-white/38 sm:block">AUXILIARY</div>
      {items.map((item) => {
        const active = activePanel === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item.id)}
            className={[
              "rounded-full border px-3 py-2 text-[11px] font-medium tracking-[0.18em] transition",
              active ? "border-b0-g/30 bg-b0-g/10 text-b0-g" : "border-white/10 bg-black/35 text-white/62 hover:border-white/20 hover:text-white/85",
            ].join(" ")}
            aria-pressed={active}
            aria-label={item.label}
          >
            <span className="sm:hidden">{item.short}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DemoWindows({ activePanel, onClose, myClicks, deviceId }: DemoWindowsProps) {
  return (
    <AnimatePresence>
      {activePanel && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <div className="absolute inset-0 b0-scanlines opacity-40" />
          <div className="absolute inset-0 b0-noise opacity-20" />

          <div onMouseDown={(event) => event.stopPropagation()} className="relative w-full">
            {activePanel === "leaderboard" && <LeaderboardPanel onClose={onClose} myClicks={myClicks} deviceId={deviceId} />}
            {activePanel === "vault" && <CosmeticsVaultPanel onClose={onClose} />}
            {activePanel === "event" && <GlobalEventPanel onClose={onClose} />}
            {activePanel === "achievements" && <AchievementsPanel onClose={onClose} myClicks={myClicks} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}