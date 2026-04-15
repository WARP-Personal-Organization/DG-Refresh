"use client";

import Link from "next/link";
import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const bureaus = [
  { city: "ANTIQUE",  name: "Albert Mamora",     phone: "+63 906 384 5940" },
  { city: "BACOLOD",  name: "Dolly Yasa",         phone: "+63 920 592 7958" },
  { city: "BORACAY",  name: "Sherryl M. Abbey",   phone: "+63 998 392 2913" },
  { city: "ROXAS",    name: "Ariel Inocencio",    phone: "+63 910 961 6271" },
  { city: "KALIBO",   name: "Nathan Candelario",  phone: "268-5200"         },
];

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

const IconMail = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconPhone = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconLocation = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconMapPin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconPen = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

const IconGlobe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// DG Diamond Divider — matches Policies page
// ─────────────────────────────────────────────────────────────────────────────

function DGDivider() {
  return (
    <div className="flex items-center gap-0" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/60" />
      <div className="flex items-center gap-2 px-5">
        <div className="w-px h-3 bg-accent/50" />
        <div className="relative flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <div
            className="absolute inset-0 border border-accent/60"
            style={{ transform: "rotate(45deg)", borderRadius: 2 }}
          />
          <div
            className="absolute bg-accent/15"
            style={{ width: 20, height: 20, transform: "rotate(45deg)", borderRadius: 1 }}
          />
          <span
            className="relative font-playfair font-bold text-accent/80 leading-none select-none"
            style={{ fontSize: 10, letterSpacing: "0.05em" }}
          >
            DG
          </span>
        </div>
        <div className="w-px h-3 bg-accent/50" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/60" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section heading with accent bar — consistent across sections
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  label,
  eyebrow,
}: {
  icon: React.ReactNode;
  label: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-accent text-[11px] font-roboto font-semibold uppercase tracking-[0.28em] mb-3 flex items-center gap-3">
          <span className="w-6 h-px bg-accent inline-block" />
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-accent flex items-center justify-center text-[#111010] flex-shrink-0">
          {icon}
        </div>
        <h2 className="font-playfair font-bold text-3xl text-white">{label}</h2>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-[3px] w-14 bg-accent" />
        <div className="h-px w-8 bg-accent/30" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactUsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  // Crosshatch grid pattern — identical to Policies hero
  const gridPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fbd203' stroke-width='0.4' stroke-opacity='0.07'%3E%3Cpath d='M0 0 L40 40 M40 0 L0 40'/%3E%3Crect x='0' y='0' width='40' height='40'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-eyebrow { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.05s; }
        .animate-hero-title   { animation: fadeSlideUp 0.65s ease both; animation-delay: 0.18s; }
        .animate-hero-rule    { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.30s; }
        .animate-hero-body    { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.42s; }

        .bureau-card:hover .bureau-city-glow {
          text-shadow: 0 0 28px rgba(251,210,3,0.35);
        }
        .bureau-card:hover {
          box-shadow: 0 0 0 1px rgba(251,210,3,0.25), inset 0 0 24px rgba(251,210,3,0.03);
        }
        .office-card:hover {
          box-shadow: 0 0 0 1px rgba(251,210,3,0.2);
        }
      `}</style>

      <div className="bg-[#1b1a1b] min-h-screen text-white">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden border-b border-accent/25"
          style={{ background: "#0e0d0e" }}
        >
          {/* Crosshatch background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: gridPattern, backgroundSize: "40px 40px" }}
          />

          {/* Diagonal accent corner ornament */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
            aria-hidden="true"
            style={{
              background: "linear-gradient(135deg, transparent 60%, rgba(251,210,3,0.04) 100%)",
            }}
          />

          {/* Large ghost watermark */}
          <div
            className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-playfair font-bold uppercase text-white/[0.028] whitespace-nowrap"
              style={{
                fontSize: "clamp(80px, 18vw, 220px)",
                letterSpacing: "0.15em",
                lineHeight: 1,
              }}
            >
              CONTACT
            </span>
          </div>

          {/* Hero content */}
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
            {/* Eyebrow */}
            <div className="animate-hero-eyebrow flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-accent" />
              <p className="text-accent text-[11px] font-roboto font-semibold uppercase tracking-[0.28em]">
                Daily Guardian — Get in Touch
              </p>
            </div>

            {/* Title — "Get in" white, "Touch" accent */}
            <h1
              className="animate-hero-title font-playfair font-bold leading-[1.05] text-white mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Get in
              <br />
              <span className="text-accent">Touch</span>
            </h1>

            {/* Rule */}
            <div className="animate-hero-rule flex items-center gap-3 mb-7">
              <div className="h-[3px] w-14 bg-accent" />
              <div className="h-px w-8 bg-accent/30" />
            </div>

            {/* Body */}
            <p className="animate-hero-body font-sans text-gray-400 text-lg lg:text-[1.2rem] max-w-2xl leading-[1.8]">
              We&apos;d love to hear from you. Reach us at our offices, or connect with
              our bureau reporters across the Western Visayas region.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-16 lg:py-24 space-y-20">

          {/* ── CONTRIBUTIONS FULL-WIDTH BANNER ────────────────────────────── */}
          <section>
            <SectionHeading
              icon={<IconPen className="w-6 h-6" />}
              label="Contributions"
              eyebrow="Send us your stories"
            />

            <button
              type="button"
              className="group relative w-full text-left bg-white/[0.04] border border-white/[0.07] overflow-hidden transition-all duration-300 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              onClick={() => copy("editorial@dailyguardian.com.ph", "contributions")}
              aria-label="Copy editorial email address"
            >
              {/* Yellow top edge */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent via-accent/70 to-transparent" />
              {/* Left bar — intensifies on hover */}
              <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/35 group-hover:bg-accent transition-colors duration-300" />

              <div className="pl-8 pr-8 py-8 lg:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <span className="text-accent flex-shrink-0">
                    <IconMail className="w-8 h-8" />
                  </span>
                  <div>
                    <p className="font-roboto font-bold text-[11px] uppercase tracking-[0.22em] text-accent/80 mb-1">
                      Editorial — Story Submissions &amp; Contributions
                    </p>
                    <p
                      className="font-playfair font-bold text-white group-hover:text-accent transition-colors duration-200"
                      style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
                    >
                      editorial@dailyguardian.com.ph
                    </p>
                    <p className="font-sans text-gray-500 text-sm mt-1 leading-relaxed max-w-xl">
                      Pitch story ideas, send press releases, or submit op-eds directly to our editorial desk.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 font-roboto text-[11px] uppercase tracking-widest text-gray-600 group-hover:text-accent transition-colors duration-200">
                  {copied === "contributions" ? (
                    <>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-accent">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Click to copy
                    </>
                  )}
                </div>
              </div>
            </button>
          </section>

          {/* ── DIVIDER ── */}
          <DGDivider />

          {/* ── OFFICES 3-COL GRID ───────────────────────────────────────────── */}
          <section>
            <SectionHeading
              icon={<IconLocation className="w-6 h-6" />}
              label="Our Offices"
              eyebrow="Where to find us"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* ── Iloilo Card ── */}
              <div className="office-card group relative bg-white/[0.04] border border-white/[0.07] overflow-hidden transition-all duration-300 hover:bg-white/[0.07] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent via-accent/70 to-transparent" />
                <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/35 group-hover:bg-accent transition-colors duration-300" />

                {/* Ghost watermark */}
                <div className="absolute bottom-3 right-4 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                  <span
                    className="font-playfair font-bold uppercase text-white/[0.04] leading-none whitespace-nowrap"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em" }}
                  >
                    ILOILO
                  </span>
                </div>

                <div className="relative pl-8 pr-6 pt-7 pb-8 flex flex-col flex-1 gap-5">
                  <div>
                    <p className="font-roboto font-bold text-[11px] uppercase tracking-[0.22em] text-accent/80 mb-2">
                      Main Office
                    </p>
                    <p className="font-playfair font-bold text-xl text-white">Iloilo City</p>
                    <p className="font-roboto text-[11px] uppercase tracking-widest text-gray-500 mt-0.5">
                      Daniel Y. Labindao
                    </p>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3 text-gray-300 font-sans text-[1.05rem] leading-snug">
                      <span className="text-accent mt-0.5 flex-shrink-0">
                        <IconLocation className="w-4 h-4" />
                      </span>
                      Guzman Street, Mandurriao, Iloilo City 5000
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-3 text-gray-300 font-sans text-[1.05rem] w-full text-left group/email cursor-pointer hover:text-accent transition-colors duration-200"
                      onClick={() => copy("marketing@dailyguardian.com.ph", "iloilo-email")}
                      aria-label="Copy Iloilo office email"
                    >
                      <span className="text-accent flex-shrink-0">
                        <IconMail className="w-4 h-4" />
                      </span>
                      <span>marketing@dailyguardian.com.ph</span>
                      {copied === "iloilo-email" && (
                        <span className="text-xs text-accent ml-auto">Copied!</span>
                      )}
                    </button>

                    <div className="flex items-center gap-3 text-gray-300 font-sans text-[1.05rem]">
                      <span className="text-accent flex-shrink-0">
                        <IconPhone className="w-4 h-4" />
                      </span>
                      (033) 351-1695
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Manila Card ── */}
              <div className="office-card group relative bg-white/[0.04] border border-white/[0.07] overflow-hidden transition-all duration-300 hover:bg-white/[0.07] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent via-accent/70 to-transparent" />
                <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/35 group-hover:bg-accent transition-colors duration-300" />

                {/* Ghost watermark */}
                <div className="absolute bottom-3 right-4 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                  <span
                    className="font-playfair font-bold uppercase text-white/[0.04] leading-none whitespace-nowrap"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em" }}
                  >
                    MANILA
                  </span>
                </div>

                <div className="relative pl-8 pr-6 pt-7 pb-8 flex flex-col flex-1 gap-5">
                  <div>
                    <p className="font-roboto font-bold text-[11px] uppercase tracking-[0.22em] text-accent/80 mb-2">
                      Satellite Office
                    </p>
                    <p className="font-playfair font-bold text-xl text-white">Manila</p>
                    <p className="font-roboto text-[11px] uppercase tracking-widest text-gray-500 mt-0.5">
                      Mandaluyong City
                    </p>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3 text-gray-300 font-sans text-[1.05rem] leading-snug">
                      <span className="text-accent mt-0.5 flex-shrink-0">
                        <IconLocation className="w-4 h-4" />
                      </span>
                      Unit 1501 Pioneer Highlands, Pioneer St., Brgy. Barangka Ilaya, Mandaluyong City
                    </div>

                    <div className="flex items-start gap-3 text-gray-300 font-sans text-[1.05rem]">
                      <span className="text-accent mt-0.5 flex-shrink-0">
                        <IconPhone className="w-4 h-4" />
                      </span>
                      <div>
                        <p>+63 917 551 1896</p>
                        <p>+63 923 221 2098</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Editorial Note Card ── */}
              <div className="group relative bg-white/[0.03] border border-accent/20 overflow-hidden transition-all duration-300 hover:bg-white/[0.06] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent/50 via-accent/30 to-transparent" />
                <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/20 group-hover:bg-accent/60 transition-colors duration-300" />

                <div className="relative pl-8 pr-6 pt-7 pb-8 flex flex-col flex-1">
                  <p className="font-roboto font-bold text-[11px] uppercase tracking-[0.22em] text-accent/80 mb-4">
                    Write to Us
                  </p>
                  <blockquote className="flex-1">
                    <p
                      className="font-playfair font-bold text-white/90 leading-[1.45] mb-5"
                      style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}
                    >
                      &ldquo;We Write,<br />You Decide.&rdquo;
                    </p>
                    <p className="font-sans text-gray-400 text-[1.05rem] leading-[1.75]">
                      Have a tip, a story, or feedback for our team? Our editors read every message
                      and respond to credible leads. Your voice shapes our coverage.
                    </p>
                  </blockquote>
                  <div className="mt-6 pt-5 border-t border-white/[0.06]">
                    <p className="font-roboto text-[11px] uppercase tracking-[0.18em] text-gray-600">
                      Iloilo City &bull; Philippines
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── DIVIDER ── */}
          <DGDivider />

          {/* ── BUREAUS SECTION ──────────────────────────────────────────────── */}
          <section>
            <SectionHeading
              icon={<IconGlobe className="w-6 h-6" />}
              label="Our Bureaus"
              eyebrow="Regional correspondents"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {bureaus.map((bureau) => (
                <div
                  key={bureau.city}
                  className="bureau-card group relative bg-white/[0.04] border border-white/[0.07] overflow-hidden transition-all duration-300 hover:bg-white/[0.08] flex flex-col min-h-[180px]"
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent via-accent/70 to-transparent" />
                  {/* Left bar */}
                  <div className="absolute top-0 left-0 w-[4px] h-full bg-accent/35 group-hover:bg-accent transition-colors duration-300" />

                  {/* Bottom corner map-pin icon — decorative */}
                  <div className="absolute bottom-4 right-4 text-accent/15 group-hover:text-accent/30 transition-colors duration-300 pointer-events-none" aria-hidden="true">
                    <IconMapPin className="w-8 h-8" />
                  </div>

                  <div className="relative pl-6 pr-5 pt-6 pb-6 flex flex-col flex-1 gap-3">
                    {/* City — visual hero */}
                    <p
                      className="bureau-city-glow font-playfair font-bold text-accent leading-none tracking-wide transition-all duration-300"
                      style={{ fontSize: "clamp(1.45rem, 3vw, 1.7rem)" }}
                    >
                      {bureau.city}
                    </p>

                    {/* Contact name */}
                    <p className="font-sans text-white font-semibold text-[1.05rem] leading-snug">
                      {bureau.name}
                    </p>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-gray-400 font-sans text-sm">
                      <span className="text-accent/70 flex-shrink-0">
                        <IconPhone className="w-4 h-4" />
                      </span>
                      {bureau.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── FOOTER STRIP ─────────────────────────────────────────────────── */}
        <div className="border-t border-accent/20 bg-[#111010]">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-accent flex items-center justify-center flex-shrink-0">
                <span className="font-playfair font-bold text-[#0e0d0e] text-sm leading-none">DG</span>
              </div>
              <div>
                <p className="font-playfair font-bold text-lg text-white">Daily Guardian</p>
                <p className="text-[11px] font-roboto text-gray-500 uppercase tracking-[0.2em]">
                  We Write, You Decide
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-accent hover:bg-accent hover:text-[#0e0d0e] border border-accent/30 hover:border-accent px-5 py-2.5 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
