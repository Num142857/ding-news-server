const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const history = require('connect-history-api-fallback');
const schedule = require('./schedule/');
const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
global.logger = logger;
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
//增加白名单
app.use(history({
  rewrites: [{
    from: /^\/api\/.*$/,
    to: function (context) {
      return context.parsedUrl.pathname;
    }
  }]
}));
// app.use('/', express.static(app.get('view')));
// app.use('/', express.static(app.get('project')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
//定时任务
app.configure(schedule);

// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({
  logger
}));

app.hooks(appHooks);
module.exports = app;
