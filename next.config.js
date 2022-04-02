module.exports = {
  reactStrictMode: true,
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
