/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // images: {
  //   unoptimized: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sendexa.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend fetch("/api/v1/auth/login")
        destination: "http://localhost:4000/:path*", // backend sees /v1/auth/login
        /**
         * This is the backend API endpoint
         * The frontend will make requests to /api/v1/auth/login
         * and it will be proxied to http://localhost:4000/v1/auth/login
         * This allows you to keep the API calls consistent across environments
         * without changing the base URL in your frontend code.
         * @url https//api/sendexa.co/v1/auth/login
         * @url http://localhost:4000/v1/auth/login
         */
      },
    ];
  },
};

export default nextConfig;
