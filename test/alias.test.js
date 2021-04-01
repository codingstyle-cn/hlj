const { exec } = require('./helper/exec');
const {
  pass,
  fail,
  skip,
  green,
  red,
  yellow,
  time,
} = require('../src/report/render');
const { FIXTURE } = require('./helper/fixtures');

describe('Keyword', () => {
  it('should run it as test', function () {
    const stdout = exec(`hlj ${FIXTURE}/it.test.js`);
    expect(stdout).toContain('PASS');
    expect(stdout).toContain(`Tests: ${green('1 passed')}, 1 total`);
  });

  it('should organize test cases with describe', () => {
    const stdout = exec(`hlj ${FIXTURE}/describe.test.js`);
    expect(stdout).toContain(`${pass('PASS')} ${FIXTURE}/describe.test.js`);
    expect(stdout).toContain(`Tests: ${green('2 passed')}, 2 total`);
  });
});
