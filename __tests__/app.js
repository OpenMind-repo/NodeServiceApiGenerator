const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

/* eslint arrow-parens: off */
/* eslint arrow-body-style: off  */
describe('generator-node-service-api-generator:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ someAnswer: true });
  });

  it('creates files', () => {
    assert.file(['dummyfile.txt']);
  });
});
