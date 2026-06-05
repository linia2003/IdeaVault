/** @type {import('next').NextConfig} */
const nextConfig = {
  
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
  experimental: {
    turbo: {
      resolveAlias: {
        
        "@better-auth/kysely-adapter": false,
        "kysely": false
      }
    }
  }
};

export default nextConfig;