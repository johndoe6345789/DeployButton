import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal .next/standalone server bundle for the Docker image,
  // instead of shipping the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
