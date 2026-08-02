import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Produces a minimal .next/standalone server bundle for the Docker image,
  // instead of shipping the full node_modules tree.
  output: "standalone",
  // next-intl/use-intl ship pure ESM; this also makes next/jest transform
  // them instead of leaving them ignored under node_modules/.
  transpilePackages: [
    "next-intl",
    "use-intl",
    "@formatjs/fast-memoize",
    "@formatjs/icu-messageformat-parser",
    "@formatjs/icu-skeleton-parser",
    "@formatjs/intl-localematcher",
    "@schummar/icu-type-parser",
    "icu-minify",
    "intl-messageformat",
  ],
};

export default withNextIntl(nextConfig);
