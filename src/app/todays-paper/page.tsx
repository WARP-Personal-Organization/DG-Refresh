import { redirect } from "next/navigation";
import { getTodaysPaper } from "../../../lib/wordpress";

export const dynamic = "force-dynamic";

export default async function TodaysPaperPage() {
  const paper = await getTodaysPaper();

  if (paper.pdfUrl) {
    redirect(paper.pdfUrl);
  }

  if (paper.link) {
    redirect(paper.link);
  }

  redirect("/");
}
