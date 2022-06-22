export default () => ({
  defaultDatabase: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3307,
    user: process.env.MYSQL_DEFAULT_USER || 'root',
    pass: process.env.MYSQL_DEFAULT_PASS || 'root',
  },
});
