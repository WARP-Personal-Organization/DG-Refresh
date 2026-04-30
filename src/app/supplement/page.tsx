import { getSupplement, getSupplementEditions } from "../../../lib/wordpress";
import SupplementClient from "./SupplementClient";

export const dynamic = "force-dynamic";

export default async function SupplementPage() {
  const [supplement, editions] = await Promise.all([
    getSupplement().catch(() => null),
    getSupplementEditions(10).catch(() => []),
  ]);

  return (
    <SupplementClient
      title="Supplement"
      link={supplement?.link || "/"}
      pdfUrl={supplement?.pdfUrl}
      embedSrc={supplement?.embedSrc}
      imageUrl={supplement?.imageUrl || "/Supplement.PNG"}
      editions={editions}
    />
  );
}
