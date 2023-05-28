/** @type {import('next').NextConfig} */

const API_URL = process.env.API_URL || "http://localhost:3000/api"
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scriblo.s3.us-east-2.amazonaws.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/api/auth/:slug*",
        destination: "/authentication/:slug*",
        permanent: true,
      },
      {
        source: '/api/:slug*',
        destination: `${API_URL}/:slug*`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
