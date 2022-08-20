/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SECRET: "私はアニメを見るのが好きです"
  }
}

module.exports = nextConfig
