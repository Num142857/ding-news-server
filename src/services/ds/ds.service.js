// Initializes the `ds` service on path `/ds`
const createService = require('./ds.class.js');
const hooks = require('./ds.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'ds',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ds', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ds');

  service.hooks(hooks);
};
