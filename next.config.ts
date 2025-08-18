/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.prismic.io"], // <-- add this line
  },
};

module.exports = nextConfig;
