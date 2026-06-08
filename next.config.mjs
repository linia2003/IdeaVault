/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongodb"],
  
  distDir: "build-cache-vault-v2",
};

export default nextConfig;