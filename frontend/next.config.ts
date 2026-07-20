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
  allowedDevOrigins: ['192.168.1.13'],
  /* config options here */
  reactCompiler: true,
};



export default nextConfig;
