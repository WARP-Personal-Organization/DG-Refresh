// components/ShareButton.tsx
"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
}

const ShareButton = ({ title, url, text }: ShareButtonProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    const shareData = {
      title,
      text: text || title,
      url,
    };

    try {
      // Check if Web Share API is supported (mobile devices and some desktop browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard and show notification
        await navigator.clipboard.writeText(`${title} - ${url}`);

        // Show a temporary notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-[#fcee16] text-[#1b1a1b] px-4 py-2 rounded-lg font-medium z-50 animate-fade-in font-open-sans";
        notification.textContent = "Link copied to clipboard!";
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.log("Error sharing:", error);

      // Final fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`);
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-[#fcee16] text-[#1b1a1b] px-4 py-2 rounded-lg font-medium z-50 font-open-sans";
        notification.textContent = "Link copied to clipboard!";
        document.body.appendChild(notification);

        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      } catch (clipboardError) {
        console.log("Clipboard error:", clipboardError);
        // If all else fails, show the URL in a prompt
        prompt("Copy this link:", url);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
    >
      <Share2 size={16} />
      <span className="text-sm font-open-sans">
        {isSharing ? "Sharing..." : "Share full article"}
      </span>
    </button>
  );
};

export default ShareButton;
