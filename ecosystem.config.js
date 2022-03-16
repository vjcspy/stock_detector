module.exports = {
  apps: [
    {
      name: 'npm',
      script: 'npm',
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
