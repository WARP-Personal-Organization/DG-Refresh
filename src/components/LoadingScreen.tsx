"use client";

import { useEffect, useRef, useState } from "react";

// Easing functions (from animations.jsx)
const easeInQuad  = (t: number) => t * t;
const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const clamp       = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const WORD = "DailyGuardian";
const CHAR_DELAY = 80;

// Scene timeline (ms)
const T = {
  inkDrop:  0,
  inkFill:  1200,   // 1200–2100 : ink circle expands
  logo:     2100,   // 2100–3600 : typewriter logo
  tagline:  3400,   // 3400–4200 : tagline
  ribbon:   4200,   // 4200–4800 : anniversary badge
  chips:    4600,   // 4600–5700 : section chips
  columns:  5500,   // 5500–6400 : newspaper columns
  flash:    6400,   // 6400–7000 : flash cut
  total:    7000,
  fade:     650,
};

export default function LoadingScreen() {
  const [show,      setShow]      = useState(false);
  const [fading,    setFading]    = useState(false);
  const [chars,     setChars]     = useState(0);
  const [caretOn,   setCaretOn]   = useState(true);
  const svgRef      = useRef<SVGSVGElement>(null);
  const rafRef      = useRef<number>(0);
  const startRef    = useRef<number>(0);
  const animDone    = useRef(false);
  const pageReady   = useRef(false);

  const tryFade = () => {
    if (animDone.current && pageReady.current) {
      setFading(true);
      document.documentElement.classList.remove("dg-first-load");
      setTimeout(() => setShow(false), T.fade);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("dg_intro")) return;
    sessionStorage.setItem("dg_intro", "1");
    setShow(true);
    startRef.current = performance.now();

    // Typewriter
    const typeTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= WORD.length; i++) {
      typeTimers.push(setTimeout(() => setChars(i), T.logo + i * CHAR_DELAY));
    }
    const caretInt  = setInterval(() => setCaretOn(c => !c), 280);
    const caretStop = setTimeout(() => clearInterval(caretInt), T.logo + WORD.length * CHAR_DELAY + 500);

    // RAF loop — only drives the SVG ink-drop phase (0 → T.inkFill+200)
    // Uses viewBox pixel coords: SVG is 1920×1080, centre = (960, 540)
    function tick(now: number) {
      const elapsed = now - startRef.current; // ms
      const svg = svgRef.current;

      if (svg && elapsed < T.inkFill + 200) {
        const lt = elapsed / 1000; // seconds

        // ── Falling teardrop (0 → 700 ms) ──────────────────────────────
        const dropT  = clamp(lt / 0.7, 0, 1);
        const dropY  = -80 + easeInQuad(dropT) * (540 + 80); // -80 → 540
        const dropEl = svg.querySelector<SVGGElement>("#ink-drop");
        if (dropEl) {
          dropEl.setAttribute("transform", `translate(960, ${dropY})`);
          dropEl.style.opacity = dropT < 0.12 ? String(dropT / 0.12) : "1";
          dropEl.style.display = dropT >= 1 ? "none" : "";
        }

        // ── Splat blot (700 ms → 1200 ms) ──────────────────────────────
        const blotT  = clamp((lt - 0.7) / 0.5, 0, 1);
        const blotEl = svg.querySelector<SVGGElement>("#ink-blot");
        if (blotEl) {
          const eob    = easeOutBack(blotT);
          const r      = 6 + eob * 52;
          const squish = blotT < 0.3 ? 1 + blotT * 0.9 : 1 + (1 - (blotT - 0.3) / 0.7) * 0.22;
          const mainEl = blotEl.querySelector<SVGEllipseElement>("#blot-main");
          if (mainEl) {
            mainEl.setAttribute("rx", String(Math.max(0, r * squish)));
            mainEl.setAttribute("ry", String(Math.max(0, r * 0.94)));
          }
          blotEl.style.opacity = blotT > 0 ? "1" : "0";

          // spatter dots
          blotEl.querySelectorAll<SVGCircleElement>(".spatter").forEach((dot, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const d     = blotT * (120 + (i % 3) * 40);
            const cr    = Math.max(0, (2 + (i % 4) * 1.5) * (1 - blotT * 0.4));
            dot.setAttribute("cx", String(960 + Math.cos(angle) * d));
            dot.setAttribute("cy", String(540 + Math.sin(angle) * d));
            dot.setAttribute("r",  String(cr));
            dot.style.opacity = String(1 - blotT * 0.55);
          });
        }
      }

      if (elapsed < T.total) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // Mark animation done and attempt fade
    const animTimer = setTimeout(() => {
      animDone.current = true;
      tryFade();
    }, T.total);

    // Mark page ready when all resources are loaded
    const onLoad = () => { pageReady.current = true; tryFade(); };
    if (document.readyState === "complete") {
      pageReady.current = true;
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      typeTimers.forEach(clearTimeout);
      clearTimeout(caretStop);
      clearTimeout(animTimer);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (!show) return null;

  const sections = ["NEWS", "VOICES", "BUSINESS", "SPORTS", "FEATURES", "INITIATIVE"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=JetBrains+Mono:wght@500&display=swap');

        /* Ink circle expands from centre (clip-path) */
        @keyframes dgInkExpand {
          from { clip-path: circle(0%   at 50% 50%); }
          to   { clip-path: circle(150% at 50% 50%); }
        }
        .dg-ink-fill {
          position: absolute; inset: 0;
          background: #1b1a1b;
          clip-path: circle(0% at 50% 50%);
          animation: dgInkExpand 0.85s cubic-bezier(0.55,0,0.95,0.45) ${T.inkFill}ms both;
        }

        /* Persistent dark layer — appears after ink fill completes */
        @keyframes dgDarkAppear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .dg-dark-bg {
          position: absolute; inset: 0;
          background: #1b1a1b;
          opacity: 0;
          animation: dgDarkAppear 0s linear ${T.inkFill + 850}ms both;
        }
        /* Dark-phase content: truly invisible during Scene 1 */
        @keyframes dgPhaseReveal {
          from { visibility: hidden; }
          to   { visibility: visible; }
        }
        .dg-dark-phase {
          visibility: hidden;
          animation: dgPhaseReveal 0s linear ${T.inkFill + 800}ms both;
        }

        /* Tagline rule expand */
        @keyframes dgRuleExpand {
          from { width: 0; }
          to   { width: min(520px, 55vw); }
        }
        .dg-rule {
          height: 2px; background: #fff;
          margin: 0 auto 20px; width: 0;
          animation: dgRuleExpand 0.5s ease-out ${T.tagline + 250}ms both;
        }
        @keyframes dgFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dg-tagline-wrap { opacity: 0; animation: dgFadeUp 0.45s ease-out ${T.tagline}ms both; }
        .dg-tagline-text { opacity: 0; animation: dgFadeUp 0.4s  ease-out ${T.tagline + 400}ms both; }

        /* Anniversary ribbon pop */
        @keyframes dgRibbonIn {
          from { opacity: 0; transform: scale(0.5) rotate(-12deg); }
          65%  {             transform: scale(1.07) rotate(1.5deg); }
          to   { opacity: 1; transform: scale(1)   rotate(0deg);   }
        }
        .dg-ribbon {
          opacity: 0; transform-origin: top left;
          animation: dgRibbonIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${T.ribbon}ms both;
        }

        /* Section chips */
        @keyframes dgChipIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ${sections.map((_, i) => `.dg-chip-${i} { opacity:0; animation: dgChipIn 0.4s cubic-bezier(0.22,1,0.36,1) ${T.chips + i * 80}ms both; }`).join(" ")}

        /* Newspaper columns rise */
        @keyframes dgColRise {
          from { transform: translateY(102%); }
          to   { transform: translateY(0); }
        }
        .dg-col-0 { animation: dgColRise 0.55s cubic-bezier(0.22,1,0.36,1) ${T.columns}ms      both; }
        .dg-col-1 { animation: dgColRise 0.55s cubic-bezier(0.22,1,0.36,1) ${T.columns + 80}ms  both; }
        .dg-col-2 { animation: dgColRise 0.55s cubic-bezier(0.22,1,0.36,1) ${T.columns + 55}ms  both; }
        .dg-col-3 { animation: dgColRise 0.55s cubic-bezier(0.22,1,0.36,1) ${T.columns + 120}ms both; }

        /* Flash cut */
        @keyframes dgFlash {
          0%   { opacity: 0; }
          18%  { opacity: 1; }
          100% { opacity: 0; }
        }
        .dg-flash {
          position: absolute; inset: 0; background: #fff; pointer-events: none;
          opacity: 0; animation: dgFlash 0.5s ease-out ${T.flash}ms both;
        }
      `}</style>

      {/* ── Root overlay ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 999999,
          overflow: "hidden",
          opacity:    fading ? 0 : 1,
          transition: fading ? `opacity ${T.fade}ms ease` : "none",
          pointerEvents: fading ? "none" : "auto",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {/* ── Paper backdrop (Scene 1 bg) ─────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#ffffff",
          backgroundImage: [
            "radial-gradient(ellipse at 50% 45%, rgba(247,244,238,0.65) 0%, rgba(255,255,255,0) 65%)",
            "repeating-linear-gradient(92deg, rgba(10,10,10,0.012) 0 2px, transparent 2px 6px)",
          ].join(","),
        }} />

        {/* ── SVG ink drop ────────────────────────────────────────── */}
        {/* viewBox pixel coords match original scenes.jsx: centre = (960,540) */}
        <svg
          ref={svgRef}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {/* Falling teardrop — starts off-screen top, falls to centre */}
          <g id="ink-drop" transform="translate(960,-80)" style={{ opacity: 0 }}>
            <path d="M0,-42 Q-4,0 0,13 Q4,0 0,-42 Z" fill="#1b1a1b" opacity={0.92} />
            <ellipse cx="0" cy="0" rx="10" ry="14" fill="#1b1a1b" />
          </g>

          {/* Splat blot — centred at (960,540) */}
          <g id="ink-blot" style={{ opacity: 0 }}>
            <ellipse id="blot-main" cx="960" cy="540" rx="6" ry="5.6" fill="#1b1a1b" />
            {/* Small satellite globs */}
            <circle cx="945" cy="548" r="5"   fill="#1b1a1b" />
            <circle cx="978" cy="532" r="4.5" fill="#1b1a1b" />
            <circle cx="966" cy="560" r="3.5" fill="#1b1a1b" />
            {/* Spatter dots (positions updated by RAF) */}
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} className="spatter" cx="960" cy="540" r={2 + (i % 4) * 1.5} fill="#1b1a1b" />
            ))}
          </g>
        </svg>

        {/* ── Ink field fill (Scene 2) ─────────────────────────────── */}
        <div className="dg-ink-fill" />

        {/* ── Persistent dark bg (holds after fill completes) ─────── */}
        <div className="dg-dark-bg" />

        {/* ── Dark-phase content: hidden until ink fill completes ─── */}
        <div className="dg-dark-phase" style={{ position: "absolute", inset: 0 }}>

        {/* ── Logo + tagline (Scenes 3 & 4) ───────────────────────── */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: "50%", transform: "translateY(-58%)",
          display: "flex", flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Typewriter wordmark */}
          <div style={{
            fontWeight: 900,
            fontSize: "clamp(44px, 8.5vw, 110px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#fbd204",
            display: "inline-flex",
            alignItems: "baseline",
            minHeight: "1.1em",
          }}>
            <span>{WORD.slice(0, chars)}</span>
            {chars > 0 && chars < WORD.length && caretOn && (
              <span style={{
                display: "inline-block",
                width: "0.065em", height: "0.82em",
                background: "#fbd204",
                marginLeft: "0.04em", marginBottom: "-0.04em",
                verticalAlign: "baseline",
              }} />
            )}
          </div>

          {/* Tagline */}
          <div className="dg-tagline-wrap" style={{ textAlign: "center", marginTop: 28 }}>
            <div className="dg-rule" />
            <div className="dg-tagline-text" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(11px, 1.3vw, 17px)",
              letterSpacing: "0.45em",
              color: "#fff",
              opacity: 0.88,
            }}>
              WE WRITE &nbsp;·&nbsp; YOU DECIDE
            </div>
          </div>
        </div>

        {/* ── Anniversary ribbon (Scene 5) ─────────────────────────── */}
        <div className="dg-ribbon" style={{
          position: "absolute",
          left: "clamp(20px, 4.5vw, 90px)",
          top:  "clamp(20px, 4.5vw, 90px)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            gap: "clamp(10px, 1.5vw, 24px)",
            padding: "clamp(12px, 1.5vw, 24px) clamp(16px, 2.2vw, 38px)",
            background: "#1b1a1b",
            border: "3px solid #fbd204",
            borderRadius: 6,
          }}>
            <span style={{
              fontStyle: "italic", fontWeight: 900,
              fontSize: "clamp(52px, 7.5vw, 120px)",
              lineHeight: 1, color: "#fbd204",
            }}>25</span>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 500,
              fontSize: "clamp(12px, 1.3vw, 20px)",
              letterSpacing: "0.32em",
              color: "#fff", lineHeight: 1.3,
            }}>
              YEARS<br />OF DG
            </div>
          </div>
        </div>

        {/* ── Section chips (Scene 6) ──────────────────────────────── */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          bottom: "clamp(60px, 9vh, 150px)",
          display: "flex", justifyContent: "center",
          flexWrap: "wrap",
          gap: "clamp(6px, 0.9vw, 16px)",
          padding: "0 16px",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500,
          fontSize: "clamp(9px, 1.1vw, 15px)",
          letterSpacing: "0.3em",
        }}>
          {sections.map((s, i) => (
            <div key={s} className={`dg-chip-${i}`} style={{
              padding: "clamp(5px, 0.7vw, 10px) clamp(9px, 1.2vw, 18px)",
              border: "1.5px solid #fff",
              color: "#fff",
            }}>{s}</div>
          ))}
        </div>

        {/* ── Newspaper columns (Scene 7) ──────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {[
            { cls: "dg-col-0", side: "left",  offset: "0",     label: "LOCAL"   },
            { cls: "dg-col-1", side: "left",  offset: "10.5vw", label: "SPORTS"  },
            { cls: "dg-col-2", side: "right", offset: "10.5vw", label: "VOICES"  },
            { cls: "dg-col-3", side: "right", offset: "0",      label: "CULTURE" },
          ].map(({ cls, side, offset, label }) => (
            <div key={label} className={cls} style={{
              position: "absolute",
              [side]: offset,
              top: 0, bottom: 0,
              width: "clamp(80px, 10vw, 160px)",
              background: "#f7f4ee",
              borderRight: side === "left"  ? "1px solid rgba(10,10,10,0.1)" : undefined,
              borderLeft:  side === "right" ? "1px solid rgba(10,10,10,0.1)" : undefined,
              padding: "clamp(10px, 1.4vw, 18px) clamp(7px, 0.9vw, 14px)",
              overflow: "hidden",
            }}>
              <div style={{
                fontSize: "clamp(8px, 0.9vw, 13px)", fontWeight: 900,
                borderBottom: "1px solid #1b1a1b",
                paddingBottom: 6, marginBottom: 8,
                color: "#1b1a1b", letterSpacing: "0.05em",
              }}>{label}</div>
              {Array.from({ length: 22 }).map((_, k) => (
                <div key={k} style={{
                  height: 3,
                  background: "rgba(10,10,10,0.45)",
                  margin: "7px 0",
                  width: `${66 + ((k * 13 + label.length * 7) % 34)}%`,
                }} />
              ))}
            </div>
          ))}
        </div>

        </div>{/* end dg-dark-phase */}

        {/* ── Flash cut (Scene 8) ──────────────────────────────────── */}
        <div className="dg-flash" />
      </div>
    </>
  );
}
