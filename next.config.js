/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SECRET: "私はアニメを見るのが好きです",
    SECRETKUE: "wenaimetchuindas" //我不会原谅你
  }
}

module.exports = nextConfig
