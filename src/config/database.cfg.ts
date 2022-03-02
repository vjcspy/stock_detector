export default () => ({
  host: process.env.MYSQL_HOST || 'vm',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  user: process.env.MYSQL_DEFAULT_USER || 'root',
  pass: process.env.MYSQL_DEFAULT_USER || 'root',
});
