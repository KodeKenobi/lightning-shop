/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations for zero-lag experience
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Optimize image loading
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configure image qualities for Next.js 16 compatibility
    qualities: [25, 50, 75, 95],
  },
  // Compress responses
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  // Optimize bundle
  webpack: (config: any) => {
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;
