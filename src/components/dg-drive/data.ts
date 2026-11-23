// Hardcoded DG Drive content. Placeholder copy until the real content is sent;
// everything the page shows lives here so swapping it in is a one-file change.

export const DG_YELLOW = "#FCD400";

export const HERO = {
  // Explicit lines so the copy wraps exactly like the Canva design.
  overviewLines: [
    "Pondering on what car to get that suits your",
    "lifestyle? Choose the vehicle with DG Drive, your",
    "daily guide to cars with comprehensive reviews,",
    "updates, and comparisons with other vehicles.",
  ],
  mottoLines: ["Driven, Tested, Experienced.", "Roll out with DG Drive."],
  taglineLines: ["DRIVEN. TESTED.", "EXPERIENCED."],
  cta: "Articles",
};

export const LATEST = {
  label: "LATEST",
  heading: "Built for What’s Next",
  blurbLines: [
    "Hit the roads with a vehicle built",
    "to adapt to different conditions.",
    "See why the sleek new 2026",
    "MU-X is the modern car for",
    "modern days.",
  ],
  thumbnail: "/dg-drive/thumb-best-in-class.jpg",
  thumbnailAlt: "Best in Class? 2026 Isuzu MU-X — DG Drive",
  href: "/dg-drive/best-in-class",
};

export const SPOTLIGHT = {
  name: "2026 Isuzu MU-X",
  image: "/dg-drive/mux-black-cutout.png",
  shadow: "/dg-drive/car-shadow.png",
  features: [
    "3.0L 4-cylinder turbo-diesel",
    "140 kW and 450 Nm, 6-speed automatic",
    "4WD with high/low range and rear diff lock",
    "7 seats, 800mm wading depth",
  ],
};

export type DriveArticle = {
  id: string;
  title: string;
  subtitle: string;
  descriptionLines: string[];
  /** Large image shown when the article is the active carousel card. */
  image: string;
  /** Image used on the faded preview cards. */
  thumb: string;
  href: string;
  /** Article page fields (placeholder until real content arrives). */
  category: string;
  author: string;
  date: string;
  readTime: string;
  dek: string;
  body: ArticleBlock[];
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; by: string }
  | { type: "image"; src: string; caption: string }
  | { type: "gallery"; images: { src: string; caption: string }[] }
  | { type: "list"; intro?: string; items: { label?: string; text: string }[] }
  | { type: "proscons"; pros: string[]; cons: string[] }
  | { type: "specs" };

/** Episode 1 copy, as supplied by the DG Drive team. */
const BEST_IN_CLASS_BODY: ArticleBlock[] = [
  {
    type: "p",
    text: "The 2026 Isuzu MU-X arrives as a significant update to one of the market’s most dependable 7-seater SUVs. Sharing its robust body-on-frame platform with the D-Max pickup, the MU-X has long built its reputation on durability, impressive towing capabilities, and genuine off-road performance. For 2026, Isuzu focused on modernizing the vehicle’s aesthetic, upgrading cabin technology, and refining safety systems to better compete with rivals like the Ford Everest, Mitsubishi Montero Sport, and Toyota Fortuner.",
  },
  { type: "h2", text: "Exterior Design" },
  {
    type: "p",
    text: "Isuzu’s design team has given the 2026 MU-X a sharper, more assertive front-end look. The updated front fascia features a bolder front grille flanked by sleeker LED headlights with revised daytime running light (DRL) signatures.",
  },
  {
    type: "image",
    src: "/dg-drive/mux/front-grass.jpg",
    caption: "A bolder grille and sleeker LED headlights give the 2026 MU-X a sharper face.",
  },
  {
    type: "list",
    intro: "Key exterior highlights include:",
    items: [
      { label: "Front Styling", text: "Redesigned bumper intakes and updated chrome/dark finish accents depending on the trim level." },
      { label: "Profile & Wheels", text: "New alloy wheel designs ranging from 18 to 20 inches, retaining practical roof rails across mid- and upper-tier trims." },
      { label: "Rear End", text: "Updated LED taillights with a unified lighting bar aesthetic and a reshaped rear bumper that improves departure angles slightly." },
    ],
  },
  {
    type: "image",
    src: "/dg-drive/mux/rear-three-quarter.jpg",
    caption: "Updated LED taillights and a reshaped rear bumper.",
  },
  { type: "h2", text: "Interior and Comfort" },
  {
    type: "p",
    text: "Step inside the 2026 MU-X, and the effort to elevate passenger comfort is immediately evident. While rugged plastics remain in high-wear areas—underscoring its utilitarian roots—the touchpoints feature premium soft-touch materials, contrast stitching, and upgraded upholstery choices.",
  },
  {
    type: "list",
    items: [
      { label: "Seating Layout", text: "Standard 7-seat configuration with flexible folding mechanisms." },
      { label: "First & Second Rows", text: "High seating position offering excellent visibility, supportive front bucket seats, and generous second-row legroom with reclining seatbacks." },
      { label: "Third Row", text: "Suitable for children on longer trips or adults on shorter commutes, featuring dedicated air vents and cup holders." },
      { label: "NVH Control", text: "Improved sound insulation reduces diesel engine chatter and highway wind noise compared to previous iterations." },
    ],
  },
  {
    type: "gallery",
    images: [
      { src: "/dg-drive/mux/steering-wide.jpg", caption: "Driver’s seat" },
      { src: "/dg-drive/mux/window-switches.jpg", caption: "Door controls" },
      { src: "/dg-drive/mux/start-button.jpg", caption: "Push-button start" },
    ],
  },
  { type: "h2", text: "Technology and Features" },
  {
    type: "p",
    text: "The most notable upgrades for 2026 reside in the infotainment and driver assistance suites, directly addressing previous customer feedback. The infotainment sports an updated 9.0-inch touchscreen with improved graphic resolution and faster response times. Connectivity is also great as Apple CarPlay and Android Auto are both available wirelessly, with multiple USB-C ports across all three rows.",
  },
  {
    type: "image",
    src: "/dg-drive/mux/dashboard.jpg",
    caption: "The updated 9.0-inch touchscreen with wireless Apple CarPlay and Android Auto.",
  },
  { type: "h2", text: "Performance and Driving Experience" },
  {
    type: "p",
    text: "Under the hood, the 2026 MU-X continues to rely on Isuzu’s proven turbo-diesel engine, engineered for longevity and heavy-duty performance rather than outright speed.",
  },
  {
    type: "p",
    text: "The 3.0-liter 4-cylinder turbo-diesel delivers 140 kW of power and 450 Nm of torque, paired with a smooth 6-speed automatic transmission, is ideal for transporting the family around and highway cruising. Coil-spring rear suspension delivers a significantly smoother ride than its pickup counterpart. Steering is light and easy for urban maneuvering, though body roll is present during enthusiastic cornering. The MU-X also has some off-road capability with its 4WD with high/low range selection, a locking rear differential, rough terrain mode, and an impressive 800mm wading depth.",
  },
  { type: "specs" },
  {
    type: "image",
    src: "/dg-drive/mux/gear-shifter.jpg",
    caption: "A smooth 6-speed automatic sends power from the 3.0-liter turbo-diesel.",
  },
  { type: "h2", text: "Practicality" },
  {
    type: "p",
    text: "Practicality remains the core strength of the MU-X platform. Ample room with all seats up, expanding dramatically to over 1,800 liters when the second and third rows are folded flat. Plentiful cabin storage including dual gloveboxes, deep door pockets, and a large central console bin.",
  },
  {
    type: "image",
    src: "/dg-drive/mux/center-console.jpg",
    caption: "Dual gloveboxes, deep door pockets, and a large central console bin.",
  },
  { type: "h2", text: "Strengths & Weaknesses" },
  {
    type: "proscons",
    pros: [
      "Isuzu’s proven track record of durability.",
      "Genuine off-road capability supported by low-range 4WD and rear diff lock.",
      "Upgraded infotainment system with wireless smartphone integration.",
      "Roomy, comfortable second row and versatile cabin storage solutions.",
    ],
    cons: [
      "3.0L turbo-diesel engine, while durable, lacks the top-end punch of twin-turbo V6 competitors.",
      "Steering feel remains overly light at higher highway speeds.",
      "Firm ride quality when unladen compared to softer road-focused SUVs.",
    ],
  },
  { type: "h2", text: "Final Verdict" },
  {
    type: "p",
    text: "The 2026 Isuzu MU-X strikes an effective balance between rugged capability and modern family convenience. While it does not aim to be the fastest or most luxurious vehicle in the 7-seat SUV segment, its updates to technology, interior comfort, and safety make it far more refined for daily driving. For buyers seeking a dependable, go-anywhere family tourer, the updated MU-X remains one of the most practical and sensible choices on the market.",
  },
];

export const ARTICLES: DriveArticle[] = [
  {
    id: "best-in-class",
    title: "BEST IN CLASS?",
    subtitle: "2026 ISUZU MU-X",
    descriptionLines: [
      "Hit the roads with a vehicle built to adapt to different",
      "conditions! See why the sleek new 2026 MU-X is",
      "the modern car for modern days.",
    ],
    image: "/dg-drive/photo-best-in-class-clean.jpg",
    thumb: "/dg-drive/thumb-best-in-class.jpg",
    href: "/dg-drive/best-in-class",
    category: "Review",
    author: "DG Drive Team",
    date: "November 17, 2026",
    readTime: "4 min read",
    dek: "Hit the roads with a vehicle built to adapt to different conditions. See why the sleek new 2026 MU-X is the modern car for modern days",
    body: BEST_IN_CLASS_BODY,
  },
];

export const SOCIALS = [
  {
    name: "YouTube",
    href: "https://youtube.com/dailyguardian",
    icon: { src: "/dg-drive/youtube.png", w: 200, h: 141, displayW: 78 },
    button: { src: "/dg-drive/yt-subscribe.png", w: 800, h: 242, displayW: 107, alt: "Subscribe" },
    // Landing-page card (Canva page 1). YouTube/TikTok are still Canva
    // placeholders in the design, so they borrow article art for now.
    card: { image: "/dg-drive/thumb-best-in-class.jpg", position: "50% 50%", caption: "Subscribe" },
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/DailyGuardianPH/",
    icon: { src: "/dg-drive/facebook.webp", w: 200, h: 200, displayW: 50 },
    button: { src: "/dg-drive/fb-follow.webp", w: 200, h: 64, displayW: 91, alt: "Follow" },
    card: { image: "/dg-drive/social-facebook.png", position: "30% 50%", caption: "Follow" },
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/dailyguardianph",
    icon: { src: "/dg-drive/instagram.webp", w: 200, h: 200, displayW: 52 },
    button: { src: "/dg-drive/ig-follow.png", w: 149, h: 72, displayW: 66, alt: "Follow" },
    card: { image: "/dg-drive/social-instagram.png", position: "0% 50%", caption: "Follow" },
  },
  {
    name: "TikTok",
    // TODO: real DG Drive TikTok URL once provided.
    href: "#",
    icon: { src: "/dg-drive/tiktok.webp", w: 200, h: 200, displayW: 54 },
    button: { src: "/dg-drive/tt-follow.png", w: 800, h: 209, displayW: 124, alt: "Follow" },
    card: { image: "/dg-drive/thumb-still-the-best.jpg", position: "50% 50%", caption: "Follow" },
  },
] as const;

export const NEVER_MISS = {
  heading: "Never miss a story.",
  sub: "Subscribe & follow to get the latest automotive news, reviews, and exclusive content.",
  subLines: ["Subscribe & follow to get the latest automotive news,", "reviews, and exclusive content."],
};

export const COPYRIGHT = "© 2024 DG Drive. All rights reserved.";

/** Anything the Browse carousel can show: a released article or a teaser. */
export type CarouselItem = Pick<
  DriveArticle,
  "id" | "title" | "subtitle" | "descriptionLines" | "image" | "thumb" | "href"
> & { comingSoon?: boolean };

/**
 * Unreleased episodes. They appear in the carousel and on the All Articles
 * page with a blurred photo and a "Coming Soon" badge, and link nowhere.
 * Move an entry into ARTICLES (with its full fields) once it is released.
 */
export const COMING_SOON: CarouselItem[] = [
  {
    id: "coming-soon-ep-2",
    title: "COMING SOON",
    subtitle: "DG DRIVE EPISODE 2",
    descriptionLines: [
      "A new DG Drive episode is on the way.",
      "Stay tuned and follow DG Drive so you",
      "don’t miss the release.",
    ],
    image: "/dg-drive/mux/rear-three-quarter.jpg",
    thumb: "/dg-drive/mux/rear-three-quarter.jpg",
    href: "",
    comingSoon: true,
  },
];

/** Released articles first, then the coming-soon teasers. */
export const CAROUSEL_ITEMS: CarouselItem[] = [...ARTICLES, ...COMING_SOON];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.id === slug);

/**
 * True when the article has a clean photo (no title art baked in). Thumbnails
 * include their own frame and text, so they must never be cropped or slanted.
 */
export const hasCleanPhoto = (a: Pick<DriveArticle, "image" | "thumb">) => a.image !== a.thumb;
