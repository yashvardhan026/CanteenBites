/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Avoid build stalls if ESLint interactive prompt triggers in CI
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
