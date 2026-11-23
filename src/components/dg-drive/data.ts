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
    "Product Feature 1",
    "Product Feature 2, Lorem Ipsum",
    "Product Feature 3, Lorem",
    "Product Feature 4",
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
  | { type: "specs" };

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, ut aut assumenda et nihil eos quibusdam proident, libero veniam dignissimos in eos. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation.";
const LOREM_2 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla gravida orci a odio.";

/** Shared placeholder article body; the intro paragraph differs per article. */
const placeholderBody = (intro: string, image: string): ArticleBlock[] => [
  { type: "p", text: intro },
  { type: "p", text: LOREM },
  { type: "h2", text: "First Impressions" },
  { type: "p", text: LOREM_2 },
  { type: "p", text: LOREM },
  { type: "quote", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.", by: "DG Drive" },
  { type: "h2", text: "On the Road" },
  { type: "p", text: LOREM },
  { type: "image", src: image, caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { type: "p", text: LOREM_2 },
  { type: "h2", text: "Specs at a Glance" },
  { type: "specs" },
  { type: "h2", text: "The Verdict" },
  { type: "p", text: LOREM },
  { type: "p", text: LOREM_2 },
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
    readTime: "5 min read",
    dek: "Hit the roads with a vehicle built to adapt to different conditions. See why the sleek new 2026 MU-X is the modern car for modern days",
    body: placeholderBody(
      "Hit the roads with a vehicle built to adapt to different conditions. See why the sleek new 2026 MU-X is the modern car for modern days — lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "/dg-drive/thumb-off-road.jpg",
    ),
  },
  {
    id: "still-the-best",
    title: "STILL THE BEST?",
    subtitle: "2026 ISUZU MU-X",
    descriptionLines: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit",
      "facilis ut aut assumenda. Et nihil eos quibusdam",
      "proident libero veniam dignissimos.",
    ],
    image: "/dg-drive/thumb-still-the-best.jpg",
    thumb: "/dg-drive/thumb-still-the-best.jpg",
    href: "/dg-drive/still-the-best",
    category: "Review",
    author: "DG Drive Team",
    date: "November 10, 2026",
    readTime: "5 min read",
    dek: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The 2026 MU-X returns to defend its title",
    body: placeholderBody(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The 2026 MU-X returns to defend its title — facilis ut aut assumenda et nihil eos quibusdam proident.",
      "/dg-drive/thumb-off-road.jpg",
    ),
  },
  {
    id: "off-road-beast",
    title: "OFF-ROAD BEAST",
    subtitle: "2026 ISUZU MU-X",
    descriptionLines: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit",
      "facilis ut aut assumenda. Et nihil eos quibusdam",
      "proident libero veniam dignissimos.",
    ],
    image: "/dg-drive/thumb-off-road.jpg",
    thumb: "/dg-drive/thumb-off-road.jpg",
    href: "/dg-drive/off-road-beast",
    category: "Off-Road",
    author: "DG Drive Team",
    date: "November 3, 2026",
    readTime: "5 min read",
    dek: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We took the 2026 MU-X off the pavement to see what it is really made of",
    body: placeholderBody(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We took the 2026 MU-X off the pavement to see what it is really made of — libero veniam dignissimos in eos.",
      "/dg-drive/thumb-still-the-best.jpg",
    ),
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
    id: "coming-soon-ep-4",
    title: "COMING SOON",
    subtitle: "DG DRIVE EPISODE 4",
    descriptionLines: [
      "A new DG Drive episode is on the way.",
      "Stay tuned and follow DG Drive so you",
      "don’t miss the release.",
    ],
    image: "/dg-drive/photo-best-in-class-clean.jpg",
    thumb: "/dg-drive/photo-best-in-class-clean.jpg",
    href: "",
    comingSoon: true,
  },
  {
    id: "coming-soon-ep-5",
    title: "COMING SOON",
    subtitle: "DG DRIVE EPISODE 5",
    descriptionLines: [
      "Another road test is being filmed.",
      "Follow DG Drive to be the first to",
      "watch it when it drops.",
    ],
    image: "/dg-drive/thumb-off-road.jpg",
    thumb: "/dg-drive/thumb-off-road.jpg",
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
