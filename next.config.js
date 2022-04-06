module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    HOST: process.env.HOST,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    region: process.env.region,
    BUCKET_NAME: process.env.BUCKET_NAME,
  }, 
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
