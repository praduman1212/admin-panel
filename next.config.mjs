/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'media.istockphoto.com',
      'cdn01.alison-static.net',
      't4.ftcdn.net',
      // add other domains as needed
    ],
  },
};

export default nextConfig;
