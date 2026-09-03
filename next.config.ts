import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "glacierair.com.au",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "obtbmywqrzotvspgmaiq.supabase.co",
        pathname: "/storage/v1/object/public/glacier-air/**",
      },
    ],
  },
};

export default nextConfig;
