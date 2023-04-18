/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  pageExtensions: ["html", "jsx", "js", "tsx", "ts"],

  // tRPC and Prisma serversideprop support
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
};
export default config;
