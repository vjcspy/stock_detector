export default () => ({
  host: process.env.RABBITMQ_HOST || 'vm',
  port: parseInt(process.env.RABBITMQ_PORT, 10) || 5672,
  user: process.env.RABBITMQ_DEFAULT_USER || 'rabbitmq',
  pass: process.env.RABBITMQ_DEFAULT_USER || 'rabbitmq',
});
