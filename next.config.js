/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname:
          'cfwkrzudmvmcsyibpvik.supabase.co',
      },
    ],
  },

  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;
