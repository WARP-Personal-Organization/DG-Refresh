"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { PaperEdition } from "../../../lib/wordpress";

const FlipbookViewer = dynamic(() => import("@/components/FlipbookViewer"), { ssr: false });

interface TodaysPaperClientProps {
  title: string;
  link: string;
  pdfUrl?: string | null;
  embedSrc?: string | null;
  imageUrl?: string | null;
  editions?: PaperEdition[];
}

export default function TodaysPaperClient({
  title,
  link,
  pdfUrl,
  embedSrc,
  imageUrl,
}: TodaysPaperClientProps) {
  const router = useRouter();

  return (
    <FlipbookViewer
      title={title}
      link={link}
      pdfUrl={pdfUrl}
      embedSrc={embedSrc}
      imageUrl={imageUrl}
      onClose={() => router.push("/")}
    />
  );
}
