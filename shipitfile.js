'use strict';
module.exports = function(shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-cnpmjs')(shipit);
  require('shipit-pm2')(shipit);

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
        json: '/home/pi/workspace/ding-news-server/current/pm2.json',
      },
      deployTo: '/home/pi/workspace/ding-news-server/',
      servers: [ 'pi@192.168.31.232' ],
      branch: 'master',
    },
    Development: {
      env: 'dev',
      isDevelopment: true,
      pm2: {
        json: '/home/pi/workspace/ding-news-server/current/pm2.local.json',
      },
      deployTo: '/home/pi/workspace/ding-news-server/',
      servers: [ 'pi@192.168.31.232' ],
      branch: 'master',
    },
  });

  var bootstrap = function() {
    const baseDir = '/home/pi/workspace/ding-news-server/current';
    
    // switch (shipit.config.env) {
    // case 'dev':
    //   shipit.remote(`cd ${baseDir}/;NODE_ENV=local pm2 startOrRestart ${shipit.config.pm2.json}`);
    //   break;
    // case 'test':
    //   shipit.remote(`cd ${baseDir}/;NODE_ENV=test pm2 startOrRestart ${shipit.config.pm2.json}`);
    //   break;
    // case 'prod':
    //   shipit.remote(`cd ${baseDir}/;NODE_ENV=production pm2 startOrRestart ${shipit.config.pm2.json}`);
    //   break;
    // default:
    //   shipit.remote(`cd ${baseDir}/;NODE_ENV=local pm2 startOrRestart ${shipit.config.pm2.json}`);
    //   break;
    // }
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
