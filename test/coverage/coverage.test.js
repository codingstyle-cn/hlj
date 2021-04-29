const fs = require('fs');
const { exec } = require('../helper/exec');
const { FIXTURE } = require('../helper/fixtures');
const Coverage = require('../../src/coverage/coverage');

describe('Coverage', () => {
  it('should not enable without --coverage', () => {
    const stdout = exec(`hlj ${FIXTURE}/sum.test.js`);
    expect(stdout).toContain('PASS');
    expect(stdout).not.toContain('%');
  });

  describe('--coverage', () => {
    it('should enable test coverage', () => {
      const stdout = exec(`hlj ${FIXTURE}/sum.test.js --coverage`);
      expect(stdout).toContain('PASS');
      expect(stdout).toContain('% Stmts');
      expect(stdout).toContain('100');
    });
  });

  describe('prepare', () => {
    it('should insert line number for each line', () => {
      const rawCode = fs.readFileSync(FIXTURE + '/coverage/source.js');
      const script = new Coverage().prepare(rawCode.toString());
      const expectedOutput = fs.readFileSync(FIXTURE + '/coverage/output.txt');
      expect(script).toEqual(expectedOutput.toString());
    });
  });
});
