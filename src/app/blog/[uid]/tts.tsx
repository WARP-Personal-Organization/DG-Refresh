"use client";
import { useState } from "react";

interface TTSButtonProps {
  text: string;
}

export default function TTSButton({ text }: TTSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleListen = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to fetch audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("TTS playback error:", err);
      alert("Error generating audio.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleListen}
      disabled={isLoading}
      className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black transition disabled:opacity-50"
    >
      {isLoading ? "Generating audio..." : "🔊 Listen"}
    </button>
  );
}
