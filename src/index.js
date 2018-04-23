/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);
console.log('当前环境为:',app.get('env'));
server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
