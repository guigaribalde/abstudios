import type { NextConfig } from 'next';
import { withNextVideo } from 'next-video/process';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        pathname: '/demos/**',
      },
    ],
  },
};

export default withNextVideo(nextConfig);
