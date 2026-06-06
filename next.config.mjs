/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gracefully skips external dependency scans during edge routing lookups
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
};

export default nextConfig;