import { motion, AnimatePresence } from "framer-motion";

export type OverlayMode = "message" | "cosmetic" | null;

export function Overlay({
  open,
  title,
  body,
  accent = "g",
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  accent?: "g" | "y" | "r";
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <div className="absolute inset-0 bg-black/70" />
          {/* Glitch “frame” */}
          <motion.div
            className="relative w-[min(92vw,520px)] rounded-2xl border border-white/10 bg-black/70 p-5 shadow-deep backdrop-blur-md"
            initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 10, opacity: 0, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-px rounded-2xl opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]"
                 style={{
                   background:
                     accent === "g"
                       ? "linear-gradient(90deg, rgba(45,255,122,0.22), transparent 55%)"
                       : accent === "y"
                       ? "linear-gradient(90deg, rgba(214,255,0,0.22), transparent 55%)"
                       : "linear-gradient(90deg, rgba(255,46,46,0.22), transparent 55%)",
                 }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs tracking-[0.24em] text-white/60">BUTTON0</div>
                  <div className="mt-1 font-mono text-sm tracking-[0.18em] text-b0-fg">{title}</div>
                </div>
                <button
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                  onClick={onClose}
                >
                  CLOSE
                </button>
              </div>

              <div className="mt-4 font-mono text-[13px] leading-relaxed tracking-[0.08em] text-white/80">
                {body}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    accent === "g" ? "bg-b0-g" : accent === "y" ? "bg-b0-y" : "bg-b0-r"
                  }`}
                />
                <div className="text-xs text-white/45">SIGNAL RECEIVED</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
