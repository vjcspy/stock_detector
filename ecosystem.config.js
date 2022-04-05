module.exports = {
  apps: [
    {
      name: 'stock-detector',
      script: './build/main.js',
      instances: '4',
      instance_var: 'INSTANCE_ID',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
