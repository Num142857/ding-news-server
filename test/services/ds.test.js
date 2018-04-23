const assert = require('assert');
const app = require('../../src/app');

describe('\'ds\' service', () => {
  it('registered the service', () => {
    const service = app.service('ds');

    assert.ok(service, 'Registered the service');
  });
});
