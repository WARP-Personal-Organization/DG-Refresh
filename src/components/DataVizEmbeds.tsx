"use client";

import { useEffect } from "react";

// Loaders for the data visualisations embedded in article bodies: Flourish and
// Datawrapper, the two tools the newsroom uses.
//
// Both ship a chart as a container plus a <script>. Neither half-pair survives
// the article pipeline: the sanitizer drops <script> (post bodies must never be
// able to run code), and React injects the body via innerHTML, which by spec
// never executes scripts. So the loaders are appended here instead, only on
// stories that actually contain a chart, from URLs this file builds itself.
//
// This is a plain useEffect rather than next/script: with <Script
// strategy="afterInteractive"> Next emitted the <link rel="preload"> but never
// appended the tag, so the loader never ran and the charts stayed inert.
// Appending it directly is deterministic.

const FLOURISH_SCRIPT = "https://public.flourish.studio/resources/embed.js";

// A Datawrapper script embed, as pulled out of the raw post body by
// extractDatawrapperScripts in the article page. Unlike Flourish there is no
// page-wide loader: each chart has its own embed.js, told where to draw by
// data-target.
export interface DatawrapperScript {
  src: string;
  target: string;
}

interface Props {
  flourish: boolean;
  datawrapperScripts: DatawrapperScript[];
  // Older Datawrapper embeds are a bare <iframe> plus an inline resize script.
  // That script is stripped with the rest, so without this the iframe keeps its
  // initial height attribute and a chart that wraps taller on a phone is cut off.
  datawrapperIframes: boolean;
}

function appendScript(src: string, attrs: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  for (const [name, value] of Object.entries(attrs)) script.setAttribute(name, value);
  document.body.appendChild(script);
}

export default function DataVizEmbeds({ flourish, datawrapperScripts, datawrapperIframes }: Props) {
  useEffect(() => {
    // embed.js finds every .flourish-embed[data-src] on the page and replaces
    // it with the live iframe, so nothing needs to be passed to it.
    if (flourish) appendScript(FLOURISH_SCRIPT);

    // Datawrapper's embed.js reads data-target off its own <script> tag
    // (document.currentScript), so the attribute has to be on the element.
    for (const { src, target } of datawrapperScripts) {
      appendScript(src, { "data-target": target });
    }
  }, [flourish, datawrapperScripts]);

  useEffect(() => {
    if (!datawrapperIframes) return;
    // Datawrapper's own responsive-iframe snippet: the chart posts its rendered
    // height, and the iframe it came from is resized to match.
    const onMessage = (event: MessageEvent) => {
      const heights = event.data?.["datawrapper-height"];
      if (!heights || typeof heights !== "object") return;
      for (const iframe of document.querySelectorAll("iframe")) {
        if (iframe.contentWindow !== event.source) continue;
        for (const height of Object.values(heights)) {
          if (typeof height === "number") iframe.style.height = `${height}px`;
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [datawrapperIframes]);

  return null;
}
