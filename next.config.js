/** @type {import('next').NextConfig} */

const API_URL = 'http://192.168.86.52/scriblo-server/api'
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
  // cssLoaderOptions: {
  //   modules: true,
  //   localIdentName: "[local]__[hash:base64:5]",
  // },
};

module.exports = nextConfig;
