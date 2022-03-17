export default () => ({
  host: process.env.MONGO_HOST || 'localhost',
  port: parseInt(process.env.MONGO_PORT) || 27018,
});
