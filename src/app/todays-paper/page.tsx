import { getTodaysPaper, getPaperEditions } from "../../../lib/wordpress";
import TodaysPaperClient from "./TodaysPaperClient";

export const revalidate = 1800;

export default async function TodaysPaperPage() {
  const [paper, editions] = await Promise.all([
    getTodaysPaper().catch(() => null),
    getPaperEditions(30).catch(() => []),
  ]);

  return (
    <TodaysPaperClient
      title="Today's Paper"
      link={paper?.link || "/"}
      pdfUrl={paper?.pdfUrl}
      embedSrc={paper?.embedSrc}
      imageUrl={paper?.imageUrl || "/todaysnewspaper.png"}
      editions={editions}
    />
  );
}
