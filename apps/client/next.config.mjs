/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sendexa.co",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "https://onetime.sendexa.co/api/:path*",
        destination: "http://localhost:6000/api/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*", // Apply CORS only for API routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://oneclick.sendexa.co", 
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "accessToken",
          },
        ],
        destination: "/home",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
