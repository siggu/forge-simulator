import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

const isDev = process.env.NODE_ENV === 'development';

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
