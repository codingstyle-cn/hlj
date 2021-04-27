const { exec } = require('./helper/exec');
const { FIXTURE } = require('./helper/fixtures');
describe('JavaScript TDD framework', () => {
  it('is a CLI program', () => {
    const stdout = exec(`hlj ${FIXTURE}/sum.test.js`);
    expect(stdout).toContain('PASS');
  });

  it('should support console in test case', () => {
    const stdout = exec(`hlj ${FIXTURE}/console.test.js`);
    expect(stdout).toContain('output by console.log()');
  });

  it('should return PASS when test passed', () => {
    const stdout = exec(`hlj ${FIXTURE}/sum.test.js`);
    expect(stdout).toContain('PASS');
  });

  it('should return FAIL when test failed', () => {
    const stdout = exec(`hlj ${FIXTURE}/failed.test.js`);
    expect(stdout).toContain('FAIL');
  });

  it('should fail the test when exception occur', () => {
    const stdout = exec(`hlj ${FIXTURE}/exception.test.js`);
    expect(stdout).toContain('FAIL');
  });
});
