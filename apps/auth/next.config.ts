import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sendexa.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sendexa.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
