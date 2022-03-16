module.exports = {
  apps: [
    {
      name: 'stock-detector',
      script: './build/main.js',
      args: 'start:ts',
      instances: 'max',
      instance_var: 'INSTANCE_ID',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
