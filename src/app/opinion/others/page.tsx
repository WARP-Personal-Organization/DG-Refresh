export const revalidate = 300;

import Link from "next/link";
import { getOtherOpinionColumns } from "../../../../lib/wordpress";

export const metadata = {
  title: "Other Columns | Daily Guardian",
  description:
    "Every other Opinion column in the Daily Guardian archive, beyond the regular columnists.",
};

// The columns that aren't on the curated roster on /opinion. They have no
// headshot — that is precisely why they aren't on it — so this is a plain
// directory rather than the portrait grid: column title, and how much of it
// there is to read.
export default async function OtherColumnsPage() {
  const columns = await getOtherOpinionColumns().catch(() => []);

  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">
      <section className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-[3px] bg-[#fcee16]" />
            <Link
              href="/opinion"
              className="font-open-sans text-sm tracking-[0.2em] text-[#fcee16] uppercase font-semibold hover:underline"
            >
              Opinion
            </Link>
          </div>
          <h1 className="font-roboto font-black text-5xl md:text-6xl lg:text-7xl text-white leading-tight uppercase mb-6">
            Other Columns
          </h1>
          <p className="font-open-sans text-gray-400 text-lg max-w-2xl leading-relaxed">
            Guest columns, commentary and long-running sections beyond the
            regular columnists.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {columns.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No columns found.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/opinion/${c.slug}`}
                  className="group flex items-baseline justify-between gap-4 border-b border-gray-800 py-4 transition-colors hover:border-[#fcee16]"
                >
                  <span className="font-roboto text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:text-[#fcee16]">
                    {c.name}
                  </span>
                  <span className="shrink-0 font-open-sans text-xs text-gray-500">
                    {c.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
