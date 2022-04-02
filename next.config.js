module.exports = {
  reactStrictMode: true,
  webpack5: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/2home',
        permanent: true,
      },
    ]
  },
}
