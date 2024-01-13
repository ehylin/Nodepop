module.exports = {
    apps : [{
      name: 'nodepop',
      script: './bin/www',
      watch: '.',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development'
      },
      log_date_format: 'YYYY-MM-DD HH:mm'
    }, {
      script: './micro-services/emailSenderCote.js',
      watch: ['./micro-services/emailSenderCote.js'],
      instances: 5
    }, {
      script: './micro-services/emailSenderRabbitMQ.js',
      watch: ['./micro-services/emailSenderRabbitMQ.js']
    }
  ],
  
    deploy : {
      production : {
        user : 'javi',
        host : 'nodepop.com',
        ref  : 'origin/main',
        repo : 'https://github.com/ehylin/Nodepop',
        path : '/home/nodepop/app',
        'pre-deploy-local': 'npm run build',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };
  