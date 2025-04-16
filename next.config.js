/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Warning: This allows production builds to succeed even if ESLint errors
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Optional: Ignore TypeScript errors during build
      ignoreBuildErrors: true,
    }
  }
  
  module.exports = nextConfig