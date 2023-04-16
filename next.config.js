/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "res.cloudinary.com"]
  }
}

module.exports = nextConfig
