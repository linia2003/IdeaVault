/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongodb"],
  // Moves the build cache to a clean, unlocked folder inside your project root
  distDir: "build-cache-vault",
};

export default nextConfig;