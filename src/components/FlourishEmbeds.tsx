"use client";

import { useEffect } from "react";

// Loader for Flourish data visualisations embedded in article bodies.
//
// A Flourish chart arrives from WordPress as a container plus an inline
// <script src="…/embed.js">. Neither half survives the article pipeline: the
// sanitizer drops <script> (post bodies must never be able to run code), and
// React injects the body via innerHTML, which by spec never executes scripts.
// So the loader is pulled in here instead, from a hardcoded URL, and only on
// stories that actually contain a chart.
//
// This is a plain useEffect rather than next/script: with <Script
// strategy="afterInteractive"> Next emitted the <link rel="preload"> but never
// appended the tag, so embed.js never ran and the charts stayed inert —
// the very bug this is meant to fix. Appending it directly is deterministic.
//
// embed.js finds every .flourish-embed[data-src] on the page and replaces it
// with the live iframe, so nothing needs to be passed to it.
const EMBED_SCRIPT = "https://public.flourish.studio/resources/embed.js";

export default function FlourishEmbeds() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
