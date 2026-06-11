import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const BubbleCursor: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Motion values for the main cursor bubble
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the main bubble
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    if (isMobile) return;

    // Hide default cursor globally
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Limit trail bubble creation rate
      if (Math.random() > 0.2) return;

      const newBubble: Bubble = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 15 + 8, // Trail bubbles: 8px to 23px
      };

      setBubbles((prev) => [...prev, newBubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 1500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, [mouseX, mouseY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after {
          cursor: none !important;
        }
        html, body {
          cursor: none !important;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-100000 overflow-hidden ltr">
        {/* Main Cursor Bubble */}
        <motion.div
          style={{
            left: springX,
            top: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="fixed w-8 h-8 rounded-full border-2 border-black/80 dark:border-white/60 bg-linear-to-br from-black/30 dark:from-white/30 via-transparent to-transparent shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_6px_rgba(0,0,0,0.2),0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.4),inset_2px_2px_6px_rgba(255,255,255,0.2),0_0_15px_rgba(255,255,255,0.2)]"
        >
          {/* Glossy Reflection */}
          <div className="absolute top-[20%] left-[20%] w-[25%] h-[25%] bg-black/80 dark:bg-white/60 rounded-full blur-[1px]" />
        </motion.div>

        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{
                opacity: 0.6,
                scale: 0.5,
                left: bubble.x,
                top: bubble.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                opacity: 0,
                scale: 1.2,
                top: bubble.y - 120 - Math.random() * 80,
                left: bubble.x + (Math.random() - 0.5) * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                width: bubble.size,
                height: bubble.size,
                position: "fixed",
              }}
              className="rounded-full border border-black/80 dark:border-white/60 bg-linear-to-br from-black/10 dark:from-white/10 via-transparent to-transparent shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.2)] dark:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-black/50 dark:bg-white/50 rounded-full blur-[0.5px]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
