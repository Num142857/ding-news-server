'use strict';
module.exports = function(shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-cnpmjs')(shipit);
  // require('shipit-pm2')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      repositoryUrl: 'https://github.com/Fantasy9527/ding-news-server.git',
      ignores: [
        '.git', 'node_modules',
      ],
      keepReleases: 1,
      deleteOnRollback: false,
      shallowClone: true,
      cnpm: {},
    },
    Production: {
      env: 'prod',
      pm2: {
        json: '/root/ding-news-server/current/pm2.json',
      },
      deployTo: '/root/ding-news-server/',

      servers: [ 'root@10.0.21.105' ],
      branch: 'master',
    },
    Development: {
      env: 'dev',
      isDevelopment: true,
      pm2: {
        json: '/root/ding-news-server/current/pm2.test.json',
      },
      deployTo: '/root/ding-news-server/',
      servers: [ 'root@10.0.21.105' ],
      branch: 'master',
    },
  });

  var bootstrap = function() {
    const baseDir = '/root/ding-news-server/current';
    
    switch (shipit.config.env) {
    case 'dev':
      shipit.remote(`cd ${baseDir}/;NODE_ENV=local node ./src/index.js`);
      break;
    case 'test':
      shipit.remote(`cd ${baseDir}/;NODE_ENV=test node ./src/index.js`);
      break;
    case 'prod':
      shipit.remote(`cd ${baseDir}/;NODE_ENV=prod node ./src/index.js`);
      break;
    default:
      shipit.remote(`cd ${baseDir}/;NODE_ENV=local node ./src/index.js`);
      break;
    }
  };

  shipit.on('published', bootstrap);

  if (shipit.config.isDevelopment) {
    // 开发环境
    // 发布完成之后建立视图的链接
    shipit.on('rollbacked', () => {
      bootstrap();
    });

  } else {
    // 生产环境
    // 发布完成之后建立视图的链接
    shipit.on('rollbacked', () => {
      bootstrap();
    });
  }
};
