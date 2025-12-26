import { motion, AnimatePresence } from "framer-motion";
import type { Button0Event } from "../hooks/usePressEngine";

export function Overlay({
  open,
  event,
  onClose,
  children,
}: {
  open: boolean;
  event?: Button0Event | null;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          {/* subtle background layers always present */}
          <div className="absolute inset-0 b0-scanlines" />
          <div className="absolute inset-0 b0-noise opacity-40" />
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0.0 }}
            animate={{
              opacity:
                event?.kind === "unlock"
                  ? 0.9
                  : event?.kind === "glitch"
                  ? 0.75
                  : 0.6,
            }}
            transition={{ duration: 0.18 }}
          />

          {/* pulse layer for events */}
          {event && event.kind !== "none" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, event.kind === "unlock" ? 0.16 : 0.08, 0] }}
              transition={{ duration: 0.9 }}
            />
          )}

          <div onMouseDown={(e) => e.stopPropagation()} className="relative w-[min(92vw,520px)] p-5">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
