const assert = require('assert');
const app = require('../../src/app');

describe('\'deploy\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/deploy');

    assert.ok(service, 'Registered the service');
  });
});
