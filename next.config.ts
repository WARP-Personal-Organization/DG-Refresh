/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dailyguardian.com.ph" },
      { protocol: "https", hostname: "**.dailyguardian.com.ph" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "images.prismic.io" },
      { protocol: "http", hostname: "dailyguardian.com.ph" },
    ],
  },
};

module.exports = nextConfig;
