/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongodb"],
  experimental: {
    turbo: {
      resolveAlias: {
        // Force the local Next compiler loop to skip mapping unneeded packages completely
        "kysely": false,
        "@better-auth/kysely-adapter": false
      }
    }
  }
};

export default nextConfig;