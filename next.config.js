/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com']
  },
  // env: {
  //   TOKENRAHASIA: "私はアニメを見るのが好きです",
  //   PERBARUITOKEN: "我不会原谅你",
  //   SECRETKUE: "wenaimetchuindas" //我不会原谅你
  // }
}

module.exports = nextConfig
