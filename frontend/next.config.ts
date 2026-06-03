import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ytgu3s3xxa.ufs.sh',
        port: '',
        pathname: '/**'
      }
    ]
    
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
