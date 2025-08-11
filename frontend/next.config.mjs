/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'reassuring-frog-9f153e0d1a.strapiapp.com' },
      { protocol: 'https', hostname: 'reassuring-frog-9f153e0d1a.media.strapiapp.com' },
    ],
  },
};

export default nextConfig;
