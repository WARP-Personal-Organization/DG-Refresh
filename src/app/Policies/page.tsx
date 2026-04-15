"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icons (kept identical to original, just extracted for reuse)
// ─────────────────────────────────────────────────────────────────────────────

const IconCorrections = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const IconFactCheck = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconAI = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const IconSafety = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Policy data
// ─────────────────────────────────────────────────────────────────────────────

const policies = [
  {
    id: "corrections",
    Icon: IconCorrections,
    label: "Corrections Policy",
    descriptor: "Accuracy & Trust",
    title: "CORRECTIONS POLICY",
    sections: [
      {
        heading: null,
        body: "At Daily Guardian, we are committed to upholding the highest standards of journalistic integrity and accuracy. We understand that, despite our best efforts, errors can occur. Our corrections policy outlines how we handle errors in spelling, facts, and context in our news reports and, in exceptional cases, our commentaries.",
      },
      {
        heading: "Scope of the Policy",
        body: "This policy applies to all news content produced by Daily Guardian, including articles, reports, and digital content. Commentary pieces are generally expressions of opinion and are not subject to correction under this policy unless they contain errors that pose potential harm to the public or vulnerable sectors.",
      },
      {
        heading: "Types of Corrections",
        list: [
          { term: "Spelling Errors", detail: "We will correct spelling errors as soon as they are identified and verified." },
          { term: "Factual Errors", detail: "If a factual error is made, it will be corrected promptly. This includes errors related to names, dates, places, and any misrepresented facts." },
          { term: "Contextual Errors", detail: "Errors of context that may mislead readers or distort the intended meaning of the report will be corrected. This includes the misuse of information, quotes, or images that could alter the perceived accuracy of the news report." },
          { term: "Commentaries", detail: "Corrections in commentaries will be considered if the error is factually incorrect and poses potential harm to the public or vulnerable sectors." },
        ],
      },
      {
        heading: "Reporting Errors",
        body: "Readers who wish to report errors in any news content or commentaries can contact us via Email: editorial@dailyguardian.com.ph",
        bulletsPreamble: "Please provide the following information when reporting an error:",
        bullets: [
          "The title and date of the article or report.",
          "A description of the error.",
          "Any relevant information that can help verify the correction.",
        ],
      },
      {
        heading: "Correction Process",
        body: "Upon receiving a correction request, our editorial team will review the claim. If the error is verified:",
        bullets: [
          "A correction will be made to the online article as soon as possible.",
          "A note will be added at the end of the article indicating the nature of the correction and the date it was corrected.",
          "For significant errors that materially change the meaning of the news report or commentary, a note may also be placed at the beginning of the article for clarity.",
        ],
      },
      {
        heading: "Transparency",
        body: "Daily Guardian is committed to transparency in its correction process. Significant corrections will be logged on a dedicated corrections page on our website, where readers can see an archive of corrections made to our news content.",
      },
      {
        heading: "Contact Us",
        body: "For more information or to report an error, please contact our editorial team at editorial@dailyguardian.com.ph. We value our readers' trust and strive to correct errors promptly and transparently.",
      },
    ],
  },
  {
    id: "fact-checking",
    Icon: IconFactCheck,
    label: "Fact-Checking Policy",
    descriptor: "Verify & Report",
    title: "FACT-CHECKING POLICY",
    sections: [
      {
        heading: "Introduction",
        body: "Daily Guardian is committed to delivering accurate, reliable news and information. Our fact-checking policy outlines the methodology we use to verify facts, the selection criteria for topics subject to fact-checking, and our approach to publication and correction of information. This policy ensures our audience receives content that is not only informative but also truthful and trustworthy.",
      },
      {
        heading: "Methodology",
        list: [
          { term: "Verification Process", detail: "Our fact-checking team employs a rigorous verification process that includes cross-referencing information with credible sources, consulting with subject matter experts, and utilizing reputable fact-checking databases. We prioritize primary sources and evidence-based research in our verification efforts." },
          { term: "Transparency", detail: "We are transparent about the sources of our information, providing citations and links where possible. This allows readers to assess the credibility of the information themselves." },
          { term: "Impartiality", detail: "Our fact-checking is conducted impartially, without regard to political or ideological biases. Our goal is to ascertain the truthfulness of information, regardless of where it originates." },
        ],
      },
      {
        heading: "Selection of Topics",
        list: [
          { term: "Potential for Disinformation", detail: "We prioritize topics that have a high potential for disinformation, especially those circulating widely on social media and other digital platforms. This includes claims that are viral or have significant public interest." },
          { term: "Potential for Harm", detail: "Topics with the potential to cause harm, such as misinformation related to health, safety, and public security, receive priority in our fact-checking process." },
          { term: "Public Interest", detail: "We consider the level of public interest in a topic as a criterion for fact-checking. Topics that affect a significant portion of the population or have a considerable impact on public discourse are prioritized." },
        ],
      },
      {
        heading: "Publication",
        list: [
          { term: "Fact-Check Reports", detail: "Once a claim has been fact-checked, we publish a detailed report outlining the claim, the evidence examined, the verification process, and the conclusion." },
          { term: "Transparency and Sources", detail: "All fact-check reports include references to the sources used in the verification process. When possible, we link directly to source materials so readers can review the evidence themselves." },
          { term: "Highlighting Corrections", detail: "If the fact-checking process reveals that Daily Guardian has previously published incorrect information, we will prominently correct the original article and link to the fact-check report for transparency." },
        ],
      },
      {
        heading: "Correction",
        list: [
          { term: "Responsiveness", detail: "We are committed to correcting errors promptly. If readers believe we have made an error in our fact-checking process or have additional evidence to consider, we encourage them to contact us." },
          { term: "Correction Process", detail: "Corrections will be made in the original fact-check report and noted clearly with the date of the correction. Significant corrections will be announced through our usual publication channels." },
          { term: "Feedback and Appeals", detail: "Feedback on our fact-checking process and conclusions is welcome. We provide a clear process for readers to submit feedback or appeal a fact-check conclusion. Appeals are reviewed by a senior editorial team for consideration." },
        ],
      },
      {
        heading: "Contact Us",
        body: "To report a potential error, provide feedback, or submit a topic for fact-checking, please contact our editorial team at editorial@dailyguardian.com.ph. Our commitment to accuracy and truthfulness is paramount, and we value the role our readers play in maintaining these standards.",
      },
    ],
  },
  {
    id: "ai-policy",
    Icon: IconAI,
    label: "AI Policy",
    descriptor: "Ethics & Use",
    title: "POLICY ON THE USE OF ARTIFICIAL INTELLIGENCE",
    sections: [
      {
        heading: "Introduction",
        body: "Daily Guardian recognizes the transformative potential of Artificial Intelligence (AI) in enhancing our journalistic practices, improving operational efficiency, and providing our audience with innovative content. This policy outlines our principles and guidelines for the ethical use of AI within our organization.",
      },
      {
        heading: "Fair Use and Copyright Protection",
        list: [
          { term: "Respecting Copyright", detail: "AI technologies deployed by Daily Guardian for content creation, data analysis, or any other purpose will respect copyright laws and intellectual property rights. AI-generated content will only utilize sources that are in the public domain or for which we have obtained rights." },
          { term: "Attribution", detail: "When AI is used to generate content based on external sources, appropriate attribution will be given to the original source, in accordance with fair use principles and copyright laws." },
        ],
      },
      {
        heading: "Human Resource Management and Protection",
        list: [
          { term: "Complementing Human Effort", detail: "AI is viewed as a tool to augment the capabilities of our human staff, not replace them. We will use AI to automate repetitive tasks, allowing our journalists and staff to focus on high-value activities that require human judgment and creativity." },
          { term: "Training and Development", detail: "Daily Guardian commits to providing its staff with training and resources on the effective and ethical use of AI in their work, including understanding AI capabilities, limitations, and ethical considerations." },
          { term: "Workplace Impact", detail: "We will monitor the impact of AI on the workplace, taking steps to ensure that the deployment of AI technologies supports a positive working environment and does not lead to unjust displacement of staff." },
        ],
      },
      {
        heading: "Editorial Content",
        list: [
          { term: "Transparency", detail: "When AI is used in the creation, editing, or production of editorial content, such use will be disclosed to readers in a transparent manner." },
          { term: "Accuracy and Integrity", detail: "AI-generated content will be held to the same standards of accuracy and integrity as content produced by human journalists. All AI-generated content undergoes review by human editors before publication." },
          { term: "Ethical Considerations", detail: "AI will be used responsibly, avoiding the creation or dissemination of content that could be misleading, biased, or harmful. We will regularly review our AI tools and processes to address any ethical concerns that arise." },
        ],
      },
      {
        heading: "Corrections",
        list: [
          { term: "Accountability", detail: "Daily Guardian remains accountable for all content it publishes, regardless of whether it is produced by humans or AI. In cases where AI-generated content is found to contain errors or inaccuracies, our standard corrections policy will apply." },
          { term: "Continuous Improvement", detail: "Feedback and corrections related to AI-generated content will be used as learning opportunities to improve our AI models and algorithms, ensuring they evolve to better serve our audience's needs." },
        ],
      },
    ],
  },
  {
    id: "journalist-safety",
    Icon: IconSafety,
    label: "Journalist Safety",
    descriptor: "Protection & Care",
    title: "POLICIES ON SAFEGUARDING, HARASSMENT, AND SAFETY OF JOURNALISTS",
    sections: [
      {
        heading: null,
        body: "The Daily Guardian recognizes that the safety and well-being of its journalists are paramount to maintaining a free, fair, and independent press. These expanded policies provide a robust framework to ensure journalists are protected across physical, mental, and digital dimensions, fostering an environment of security, inclusivity, and respect.",
      },
      {
        heading: "Key Principles",
        list: [
          { term: "Zero Tolerance", detail: "The Daily Guardian enforces a strict zero-tolerance policy against harassment, violence, and threats. Immediate and decisive action is taken against perpetrators, ensuring accountability and justice." },
          { term: "Dignity and Respect", detail: "Journalists are treated as valued professionals, with workplace policies emphasizing respect, inclusivity, and anti-discrimination." },
          { term: "Comprehensive Protection", detail: "Physical, mental, and digital safety are interwoven priorities. The organization acknowledges that vulnerabilities in one aspect may affect others, and it adopts an integrated approach to safety." },
          { term: "Continuous Improvement", detail: "Policies are regularly updated based on feedback, emerging threats, and advancements in safety standards, ensuring they remain effective and relevant." },
        ],
      },
      {
        heading: "Physical Safety",
        list: [
          { term: "Risk Assessment", detail: "Assignments are carefully reviewed to identify potential risks, particularly in high-conflict areas or during coverage of sensitive topics. Journalists are briefed on specific hazards and provided with mitigation strategies before deployment." },
          { term: "Safety Training", detail: "Mandatory workshops cover situational awareness, de-escalation techniques, and first aid. Specialized training is provided for journalists covering high-risk assignments." },
          { term: "Protective Equipment", detail: "Necessary equipment (helmets, bulletproof vests, gas masks) is issued for dangerous assignments. Regular maintenance and checks ensure equipment remains in optimal condition." },
          { term: "Emergency Protocols", detail: "Clear and tested protocols include pre-arranged evacuation plans, emergency contacts, and coordination with local authorities. Journalists have access to a 24/7 emergency hotline for immediate assistance." },
        ],
      },
      {
        heading: "Mental Well-being",
        list: [
          { term: "Stress Management", detail: "Resources such as mindfulness programs, stress management workshops, and wellness initiatives are provided to mitigate the psychological impact of demanding assignments." },
          { term: "Trauma Support", detail: "Journalists exposed to traumatic events are offered trauma-informed therapy and immediate access to mental health professionals. Peer support groups provide additional emotional support." },
          { term: "Work-Life Balance", detail: "Flexible working arrangements, mandatory rest days, and counseling on managing workload are implemented to prevent burnout." },
        ],
      },
      {
        heading: "Digital Safety",
        list: [
          { term: "Cybersecurity Training", detail: "Journalists undergo regular training on protecting themselves and their sources from cyber threats, including avoiding phishing scams, managing secure passwords, and identifying malicious online activities." },
          { term: "Digital Security Tools", detail: "Tools such as encryption software, Virtual Private Networks (VPNs), and secure communication platforms (e.g., Signal, ProtonMail) are provided. Technical support is available to troubleshoot and enhance digital safeguards." },
          { term: "Data Protection", detail: "Stringent policies ensure the confidentiality of sources, data, and journalistic materials. Secure storage solutions and controlled access mechanisms are in place for sensitive information." },
          { term: "Online Harassment", detail: "A dedicated team monitors and responds to online harassment. Journalists receive training on handling online abuse and are provided with support, including legal assistance, when facing threats." },
        ],
      },
      {
        heading: "Safeguarding",
        list: [
          { term: "Whistleblowing Mechanisms", detail: "Anonymous and secure reporting channels enable journalists to report safety concerns, harassment, or ethical violations without fear of retaliation." },
          { term: "Incident Reporting", detail: "A structured and transparent system ensures all incidents are documented, thoroughly investigated, and resolved with appropriate actions." },
          { term: "Support and Advocacy", detail: "Journalists facing threats or legal challenges receive legal counsel, financial assistance, and logistical support. The Daily Guardian stands as an advocate for press freedom." },
          { term: "Collaboration", detail: "Partnerships with press freedom organizations, law enforcement, and local authorities enhance safety measures and advocacy efforts." },
        ],
      },
      {
        heading: "Continuous Improvement",
        list: [
          { term: "Regular Reviews", detail: "Safety policies and protocols undergo regular audits to adapt to evolving risks and ensure effectiveness." },
          { term: "Feedback Mechanisms", detail: "Journalists are encouraged to provide feedback and suggest improvements through confidential surveys and open forums." },
          { term: "Industry Best Practices", detail: "The organization remains updated on global best practices in journalist safety and incorporates these into its policies." },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Decorative divider between policies
// ─────────────────────────────────────────────────────────────────────────────

function PolicyDivider() {
  return (
    <div className="mt-24 mb-0 flex items-center gap-0" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/60" />
      <div className="flex items-center gap-2 px-5">
        {/* left tick */}
        <div className="w-px h-3 bg-accent/50" />
        {/* DG diamond */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 36, height: 36 }}
        >
          {/* rotated square border */}
          <div
            className="absolute inset-0 border border-accent/60"
            style={{ transform: "rotate(45deg)", borderRadius: 2 }}
          />
          {/* inner filled diamond */}
          <div
            className="absolute bg-accent/15"
            style={{
              width: 20,
              height: 20,
              transform: "rotate(45deg)",
              borderRadius: 1,
            }}
          />
          <span
            className="relative font-playfair font-bold text-accent/80 leading-none select-none"
            style={{ fontSize: 10, letterSpacing: "0.05em" }}
          >
            DG
          </span>
        </div>
        {/* right tick */}
        <div className="w-px h-3 bg-accent/50" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/60" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Active-section tracker hook
// ─────────────────────────────────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
  const policyIds = policies.map((p) => p.id);
  const activeSection = useActiveSection(policyIds);

  // Crosshatch grid pattern as inline SVG data-URI for hero
  const gridPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fbd203' stroke-width='0.4' stroke-opacity='0.07'%3E%3Cpath d='M0 0 L40 40 M40 0 L0 40'/%3E%3Crect x='0' y='0' width='40' height='40'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-eyebrow  { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.05s; }
        .animate-hero-title    { animation: fadeSlideUp 0.65s ease both; animation-delay: 0.18s; }
        .animate-hero-rule     { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.30s; }
        .animate-hero-body     { animation: fadeSlideUp 0.55s ease both; animation-delay: 0.42s; }

        /* Scrollbar hide for nav */
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }

        /* TOC item hover */
        .toc-item:hover { color: #fbd203; border-left-color: #fbd203; }

        /* Policy card hover */
        .policy-card:hover { background: rgba(255,255,255,0.07); }

        /* Nav tab active / hover */
        .nav-tab { transition: border-color 0.18s, background 0.18s, color 0.18s; }
        .nav-tab:hover { border-left-color: #fbd203; background: rgba(251,210,3,0.06); color: #fbd203; }
        .nav-tab.is-active { border-left-color: #fbd203; background: rgba(251,210,3,0.09); color: #fbd203; }
      `}</style>

      <div className="bg-[#1b1a1b] min-h-screen text-white">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden border-b border-accent/25"
          style={{ background: "#0e0d0e" }}
        >
          {/* Crosshatch background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: gridPattern, backgroundSize: "40px 40px" }}
          />

          {/* Large faded watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-playfair font-bold uppercase text-white/[0.028] whitespace-nowrap"
              style={{
                fontSize: "clamp(80px, 18vw, 220px)",
                letterSpacing: "0.18em",
                transform: "translateY(8%)",
                lineHeight: 1,
              }}
            >
              POLICIES
            </span>
          </div>

          {/* Diagonal accent slash — top-right ornament */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(135deg, transparent 60%, rgba(251,210,3,0.04) 100%)",
            }}
          />

          {/* Hero content */}
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
            {/* Eyebrow */}
            <div className="animate-hero-eyebrow flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-accent" />
              <p className="text-accent text-[11px] font-roboto font-semibold uppercase tracking-[0.28em]">
                Daily Guardian — Editorial Standards
              </p>
            </div>

            {/* Title */}
            <h1 className="animate-hero-title font-playfair font-bold leading-[1.05] text-white mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Editorial
              <br />
              <span className="text-accent">Policies</span>
            </h1>

            {/* Rule */}
            <div className="animate-hero-rule flex items-center gap-3 mb-7">
              <div className="h-[3px] w-14 bg-accent" />
              <div className="h-px w-8 bg-accent/30" />
            </div>

            {/* Body */}
            <p className="animate-hero-body font-sans text-gray-400 text-lg lg:text-[1.2rem] max-w-2xl leading-[1.8]">
              Our commitment to accuracy, integrity, and the safety of our journalists
              underpins every story we publish. Read our full editorial policies below.
            </p>
          </div>
        </div>

        {/* ── STICKY POLICY NAV ──────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-[#0e0d0e]/96 backdrop-blur border-b border-accent/15">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <nav
              className="flex gap-0 overflow-x-auto scrollbar-none"
              aria-label="Policy navigation"
            >
              {policies.map((policy) => {
                const isActive = activeSection === policy.id;
                return (
                  <a
                    key={policy.id}
                    href={`#${policy.id}`}
                    className={`nav-tab flex items-center gap-3 px-4 lg:px-5 py-4 border-l-[3px] border-transparent flex-shrink-0 group ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    {/* Icon box */}
                    <span
                      className={`flex-shrink-0 flex items-center justify-center w-8 h-8 transition-colors duration-200 ${
                        isActive
                          ? "bg-accent text-[#0e0d0e]"
                          : "bg-white/5 text-accent/60 group-hover:bg-accent/15 group-hover:text-accent"
                      }`}
                    >
                      <policy.Icon className="w-4 h-4" />
                    </span>

                    {/* Text */}
                    <span className="hidden sm:flex flex-col gap-0.5">
                      <span
                        className={`text-[11px] font-roboto font-bold uppercase tracking-[0.15em] leading-none transition-colors duration-200 ${
                          isActive ? "text-accent" : "text-gray-300 group-hover:text-accent"
                        }`}
                      >
                        {policy.label}
                      </span>
                      <span className="text-[10px] font-sans text-gray-600 leading-none">
                        {policy.descriptor}
                      </span>
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── POLICIES CONTENT ───────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-16 lg:py-24">
          {policies.map((policy, policyIndex) => (
            <div key={policy.id}>
              <article id={policy.id} className="scroll-mt-[72px]">

                {/* ── Section header ── */}
                <div className="mb-12 pb-8 border-b border-white/8">
                  <div className="flex items-start gap-5 lg:gap-7">

                    {/* Icon square — solid accent fill */}
                    <div className="flex-shrink-0 bg-accent flex items-center justify-center"
                      style={{ width: 56, height: 56 }}>
                      <policy.Icon className="w-7 h-7 text-[#0e0d0e]" />
                    </div>

                    <div className="pt-1">
                      {/* Number + label row */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-roboto text-[10px] font-bold uppercase tracking-[0.28em] text-accent/70">
                          Policy
                        </span>
                        <span
                          className="font-playfair font-bold text-accent/25 leading-none select-none"
                          style={{ fontSize: "2.8rem", lineHeight: 1, marginTop: "-4px" }}
                          aria-hidden="true"
                        >
                          {String(policyIndex + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="font-playfair font-bold text-white leading-tight"
                        style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.75rem)" }}
                      >
                        {policy.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* ── Two-column layout: TOC + content ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

                  {/* TOC sidebar */}
                  <aside className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-[88px]">
                      <p className="text-[10px] font-roboto font-bold uppercase tracking-[0.28em] text-gray-600 mb-4 pb-2 border-b border-white/6">
                        In this policy
                      </p>
                      <ul className="space-y-0.5">
                        {policy.sections
                          .filter((s) => s.heading)
                          .map((section) => (
                            <li key={section.heading}>
                              <a
                                href={`#${policy.id}`}
                                className="toc-item block text-[13px] font-sans text-gray-500 py-[5px] pl-3 border-l-2 border-transparent transition-all duration-150 leading-snug"
                              >
                                {section.heading}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </aside>

                  {/* Main content */}
                  <div className="lg:col-span-3 space-y-10">
                    {policy.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-5">

                        {/* Section h3 with yellow left accent bar */}
                        {section.heading && (
                          <h3 className="font-playfair font-bold text-white text-2xl lg:text-[1.6rem] border-l-4 border-accent pl-4 leading-snug">
                            {section.heading}
                          </h3>
                        )}

                        {/* Body text */}
                        {section.body && (
                          <p className="font-sans text-gray-400 leading-[1.85] text-[1.05rem]">
                            {section.body}
                          </p>
                        )}

                        {/* Bullets preamble */}
                        {section.bulletsPreamble && (
                          <p className="font-sans text-gray-400 leading-[1.85] text-[1.05rem]">
                            {section.bulletsPreamble}
                          </p>
                        )}

                        {/* Bullet list */}
                        {section.bullets && (
                          <ul className="space-y-3 ml-1">
                            {section.bullets.map((bullet, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 font-sans text-gray-400 text-[1.05rem] leading-[1.75]"
                              >
                                <span className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 bg-accent rotate-45 inline-block" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Term + detail card list */}
                        {section.list && (
                          <div className="space-y-3">
                            {section.list.map((item, i) => (
                              <div
                                key={i}
                                className="policy-card group relative bg-white/[0.04] border border-white/[0.07] transition-colors duration-200 overflow-hidden"
                              >
                                {/* Yellow top-left corner accent bar */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/70 to-transparent" />
                                <div className="absolute top-0 left-0 w-[3px] h-full bg-accent/40 group-hover:bg-accent transition-colors duration-200" />

                                <div className="pl-5 pr-5 pt-4 pb-4">
                                  <p className="font-roboto font-bold text-[13px] uppercase tracking-[0.18em] text-accent/90 mb-1.5">
                                    {item.term}
                                  </p>
                                  <p className="font-sans text-gray-400 text-[1.05rem] leading-[1.8]">
                                    {item.detail}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Contact callout */}
                    <div className="mt-10 relative overflow-hidden">
                      {/* Full yellow bg with dark text treatment */}
                      <div className="bg-accent p-6 lg:p-7">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 bg-[#0e0d0e]/15 p-2 mt-0.5">
                            {/* Envelope icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-[#0e0d0e]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-roboto font-bold text-[11px] uppercase tracking-[0.22em] text-[#0e0d0e]/60 mb-1">
                              Questions or concerns?
                            </p>
                            <p className="font-sans text-[#0e0d0e] text-[1.05rem] leading-relaxed font-medium">
                              Reach our editorial team at{" "}
                              <a
                                href="mailto:editorial@dailyguardian.com.ph"
                                className="underline underline-offset-2 decoration-[#0e0d0e]/40 hover:decoration-[#0e0d0e] transition-colors duration-150 font-bold"
                              >
                                editorial@dailyguardian.com.ph
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </article>

              {/* Decorative divider between policies */}
              {policyIndex < policies.length - 1 && <PolicyDivider />}

              {/* Spacer after divider before next policy */}
              {policyIndex < policies.length - 1 && <div className="mt-20" />}
            </div>
          ))}
        </div>

        {/* ── FOOTER STRIP ───────────────────────────────────────────────────── */}
        <div className="border-t border-accent/20 bg-[#0e0d0e]">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

              {/* Brand block */}
              <div className="flex items-center gap-5">
                {/* DG monogram square */}
                <div className="flex-shrink-0 bg-accent flex items-center justify-center" style={{ width: 44, height: 44 }}>
                  <span className="font-playfair font-bold text-[#0e0d0e] text-base leading-none">DG</span>
                </div>
                <div>
                  <p className="font-playfair font-bold text-white text-xl leading-tight">
                    Daily Guardian
                  </p>
                  <p className="text-[10px] font-roboto uppercase tracking-[0.28em] text-gray-600 mt-0.5">
                    We Write, You Decide
                  </p>
                </div>
              </div>

              {/* Right side: tagline + back link */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-[11px] font-sans text-gray-600 max-w-[220px] leading-relaxed hidden md:block">
                  Committed to accuracy, integrity, and press freedom since 1994.
                </p>
                <Link
                  href="/"
                  className="group flex items-center gap-2 text-[11px] font-roboto font-bold uppercase tracking-[0.2em] text-accent border border-accent/30 hover:border-accent hover:bg-accent hover:text-[#0e0d0e] px-5 py-2.5 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Bottom meta row */}
            <div className="mt-8 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-[11px] font-sans text-gray-700">
                &copy; {new Date().getFullYear()} Daily Guardian. All rights reserved.
              </p>
              <p className="text-[11px] font-sans text-gray-700">
                Iloilo City, Philippines
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
