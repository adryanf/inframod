module.exports = {
  apps : [{
    name: 'Sample',
    script: './dist/main.js',
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
