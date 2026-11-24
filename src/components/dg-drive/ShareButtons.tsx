"use client";

import { Check, Facebook, Link2, Twitter } from "lucide-react";
import { useState } from "react";

const SITE = "https://www.dailyguardian.com.ph";

export default function ShareButtons({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); nothing to do.
    }
  };

  const btn =
    "flex h-10 w-10 items-center justify-center border-2 border-black text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-[#FCD400]";

  return (
    <div className="flex gap-2">
      <a
        className={btn}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <Facebook size={17} />
      </a>
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <Twitter size={17} />
      </a>
      <button type="button" className={btn} onClick={copy} aria-label="Copy link">
        {copied ? <Check size={17} /> : <Link2 size={17} />}
      </button>
    </div>
  );
}
