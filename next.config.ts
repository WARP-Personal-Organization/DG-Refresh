/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  async redirects() {
    return [
      { source: "/e-paper", destination: "/", permanent: false },
      { source: "/e-paper/", destination: "/", permanent: false },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "dailyguardian.com.ph" },
      { protocol: "https", hostname: "**.dailyguardian.com.ph" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "images.prismic.io" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "dailyguardian.com.ph" },
    ],
  },
};

module.exports = nextConfig;
