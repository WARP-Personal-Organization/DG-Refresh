"use client";

import { useEffect, useRef } from "react";

type Variant = "up" | "left" | "right" | "zoom" | "drive";

/**
 * Fades/slides its children in the first time they scroll into view.
 * Styles live in globals.css (.dgd-reveal); reduced-motion users get the
 * content immediately with no movement.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.shown = "";
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`dgd-reveal dgd-${variant} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
