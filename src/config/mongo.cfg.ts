export default () => ({
  mongodb: {
    host: process.env.MONGO_HOST || 'localhost',
    port: parseInt(process.env.MONGO_PORT) || 27018,
    user: process.env.MONGO_DEFAULT_USER || 'root',
    pass: process.env.MONGO_DEFAULT_PASS || 'root',
  },
});
