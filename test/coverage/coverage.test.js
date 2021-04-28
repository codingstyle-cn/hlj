const { exec } = require('../helper/exec');
const { FIXTURE } = require('../helper/fixtures');
describe('Coverage', () => {
  it('should not enable without --coverage', () => {
    const stdout = exec(`hlj ${FIXTURE}/sum.test.js`);
    expect(stdout).toContain('PASS');
    expect(stdout).not.toContain('%');
  });

  describe('--coverage', () => {
    it('should enable test coverage', () => {
      const stdout = exec(`hlj ${FIXTURE}/test-dir/ --coverage`);
      expect(stdout).toContain('PASS');
      expect(stdout).toContain('% Stmts');
      expect(stdout).toContain('100');
    });
  });
});
