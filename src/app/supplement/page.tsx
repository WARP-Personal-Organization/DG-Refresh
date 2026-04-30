import { getSupplement, getSupplementEditions } from "../../../lib/wordpress";
import SupplementClient from "./SupplementClient";

export const revalidate = 1800;

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
