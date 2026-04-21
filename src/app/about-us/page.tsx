import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Daily Guardian",
  description:
    "The Daily Guardian is a renascent Iloilo-based publishing firm and media outfit led by Iloilo's most respected journalists.",
};

const FALLBACK_PHOTO =
  "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Sub-Photo-1024x1024-1.jpg";

const management = [
  {
    name: "Lemuel T. Fernandez",
    role: "Founding Publisher",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Lemuel-Fernandez-Publisher.jpg",
  },
  {
    name: "Lawrence Clark D. Fernandez",
    role: "Publisher",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Lawrence-Clark-Fernandez-General-Manager.jpg",
  },
  {
    name: "Francis Allan L. Angelo",
    role: "Editor-in-Chief",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2021/10/FAA2.jpg",
  },
  {
    name: "Lcid Crescent D. Fernandez",
    role: "VP External",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Lcid-Crescent-Fernandez-VP-External1.jpg",
  },
];

const marketing = [
  { name: "Nessa Rose Libo-on", role: "Marketing Supervisor", photo: FALLBACK_PHOTO },
  { name: "Daniel Labindao", role: "Marketing Officer", photo: FALLBACK_PHOTO },
];

const editorial = [
  {
    name: "Joseph Bernard Marzan",
    role: "Senior Reporter",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2021/10/241079043_1458172951221024_5452883474456689570_n.jpg",
  },
  {
    name: "Dolly Yasa",
    role: "Reporter",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Dolly-Yasa-Reporter.jpg",
  },
  {
    name: "Glazyl Jane Masculino",
    role: "Reporter",
    photo: "https://dailyguardian.com.ph/wp-content/uploads/2022/06/Glazyl-Jane-Marie-Masculino-Reporter.jpg",
  },
];

const bureaus = ["Kalibo", "Boracay", "Roxas", "Bacolod", "Antique", "Guimaras", "Manila"];

type StaffMember = { name: string; role: string; photo: string };

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div
        className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-800 group-hover:border-[#fcee16] transition-all duration-300 mb-5 shadow-xl"
        style={{ backgroundImage: `url(${member.photo})` }}
        aria-label={member.name}
      />
      <p className="font-roboto font-bold text-white text-lg uppercase tracking-wide leading-snug">
        {member.name}
      </p>
      <p className="font-open-sans text-[#fcee16] text-base mt-2 uppercase tracking-widest">
        {member.role}
      </p>
    </div>
  );
}

function DeptHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="w-1 h-8 bg-[#fcee16]" />
      <h2 className="font-roboto font-bold text-3xl tracking-wide uppercase text-white">
        {children}
      </h2>
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-20">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#fcee16] text-base font-open-sans transition-colors mb-14 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-[3px] bg-[#fcee16]" />
            <span className="font-open-sans text-sm tracking-[0.2em] text-[#fcee16] uppercase font-semibold">
              Who We Are
            </span>
          </div>

          <h1 className="font-roboto font-black text-6xl md:text-7xl lg:text-8xl text-white leading-tight uppercase mb-10">
            About Us
          </h1>

          <p className="font-open-sans text-gray-300 text-2xl md:text-3xl leading-relaxed max-w-3xl">
            The Daily Guardian is a renascent Iloilo-based publishing firm and media outfit
            with bureaus across Western Visayas and beyond. Led by Iloilo&apos;s most respected
            journalists, we pledge to tell the Ilonggo story as seen through the various lenses
            of society so that every side may be told.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-10">
            <span className="font-open-sans text-sm text-gray-500 uppercase tracking-widest mr-1">
              Bureaus:
            </span>
            {bureaus.map((b) => (
              <span
                key={b}
                className="px-4 py-1.5 border border-gray-700 rounded-full text-sm font-open-sans text-gray-300"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-center gap-4 mb-14">
          <div className="w-16 h-[3px] bg-[#fcee16]" />
          <h2 className="font-roboto font-bold text-4xl uppercase tracking-wide text-white">
            Our Purpose
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-800 rounded-xl p-10 relative overflow-hidden hover:border-gray-600 transition-colors duration-300">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fcee16] rounded-l-xl" />
            <p className="font-open-sans text-base tracking-[0.2em] text-[#fcee16] uppercase font-semibold mb-5">
              Mission
            </p>
            <p className="font-open-sans text-gray-200 text-2xl leading-relaxed">
              To become an independent guardian of truth and justice; socially responsive
              and un-compromising exponent of positive change and public enlightenment.
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-10 relative overflow-hidden hover:border-gray-600 transition-colors duration-300">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fcee16] rounded-l-xl" />
            <p className="font-open-sans text-base tracking-[0.2em] text-[#fcee16] uppercase font-semibold mb-5">
              Vision
            </p>
            <p className="font-open-sans text-gray-200 text-2xl leading-relaxed">
              A successful and reliable newspaper the Ilonggos are proud of; highly respected
              by its readers; and trusted by the community it responsibly serves.
            </p>
          </div>
        </div>
      </section>

      {/* ── Setting the Pace ─────────────────────────────── */}
      <section className="border-t border-b border-gray-800 bg-black/20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">

          <div className="flex items-center gap-4 mb-14">
            <div className="w-16 h-[3px] bg-[#fcee16]" />
            <h2 className="font-roboto font-bold text-4xl uppercase tracking-wide text-white">
              Setting the Pace, Commanding the Trend
            </h2>
          </div>

          <div className="max-w-4xl space-y-8">
            <p className="font-open-sans text-gray-300 text-2xl leading-relaxed">
              Some claim Western Visayas for their age. Others claim the number one tag for the
              emptiness of it. Still others overstress the people on how to read and understand
              the news. Never mind the fly-by nights. But what is it that really matters in the
              field of journalism? Longevity and number? Self-proclaimed leadership?
            </p>
            <p className="font-open-sans text-gray-300 text-2xl leading-relaxed">
              The Daily <strong className="text-white font-bold">GUARDIAN</strong> has proven
              that having a vision and mission of a balanced and responsible newspaper is the
              secret to leadership in the newspaper industry. While other outlets have disclaimers
              and fictitious editorial staff, The Daily Guardian has withstood the test of time,
              unwavering in our ideals as we remain focused on our objective of giving Ilonggos
              a regional newspaper they can trust and respect.
            </p>
            <p className="font-open-sans text-gray-300 text-2xl leading-relaxed">
              The Daily <strong className="text-white font-bold">GUARDIAN&apos;s</strong> birth
              has revolutionized the newspaper industry in Western Visayas through fair and
              balanced news, exciting and edifying graphics and visuals, and views and opinions
              that matter to the lives of our readers. All of these factors have made The Daily{" "}
              <strong className="text-white font-bold">GUARDIAN</strong> the most read, respected
              and imitated daily newspaper in the region.
            </p>

            <div className="pt-4 border-l-4 border-[#fcee16] pl-8">
              <p className="font-roboto font-bold text-3xl md:text-4xl text-white leading-snug">
                Obviously we set the pace and command the trend.{" "}
                <span className="text-[#fcee16]">Why gamble on copycats?</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Officers ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-16 h-[3px] bg-[#fcee16]" />
          <h2 className="font-roboto font-bold text-4xl uppercase tracking-wide text-white">
            Our Officers
          </h2>
        </div>

        {/* Management */}
        <div className="mb-20">
          <DeptHeading>Management</DeptHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {management.map((m) => <StaffCard key={m.name} member={m} />)}
          </div>
        </div>

        <div className="border-t border-gray-800 mb-20" />

        {/* Marketing */}
        <div className="mb-20">
          <DeptHeading>Marketing</DeptHeading>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {marketing.map((m) => <StaffCard key={m.name} member={m} />)}
          </div>
        </div>

        <div className="border-t border-gray-800 mb-20" />

        {/* Editorial */}
        <div>
          <DeptHeading>Editorial</DeptHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {editorial.map((m) => <StaffCard key={m.name} member={m} />)}
          </div>
        </div>
      </section>

      {/* ── Footer strip ─────────────────────────────────── */}
      <div className="border-t border-gray-800 py-10 text-center">
        <p className="font-open-sans text-sm tracking-widest text-gray-600 uppercase">
          The Daily Guardian &nbsp;·&nbsp; Iloilo &nbsp;·&nbsp; Western Visayas
        </p>
      </div>
    </div>
  );
}
