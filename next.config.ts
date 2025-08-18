
import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // Solution: https://github.com/DuCanh2912/next-pwa/issues/533
  pwaExcludes: [/^(?!.*(?:apple-touch-icon|favicon|manifest)).*/],
  extendDefaultRuntimeCaching: true,
  fallbacks: {
    //image: "/static/images/fallback.png",
    //font: "/static/font/fallback.woff2",
    document: '/_offline',
  },
  cacheOnNavigation: true,
  aggressiveFrontEndNavCaching: true,
  workboxOptions: {
    // Solution: https://github.com/DuCanh2912/next-pwa/issues/485
    skipWaiting: true,
  },
  // Solution: https://github.com/DuCanh2912/next-pwa/issues/524
  icon: {
    source: 'public/svvvvddddfff.svg',
    sizes: [192, 512],
  },
});


const nextConfig: NextConfig = {
  // Disabling TypeScript and ESLint during build to speed up the build process
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iili.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);

    
