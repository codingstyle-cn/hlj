const { execSync } = require("child_process");

const exec = (cmd) => {
  try {
    return execSync(
      "node src/" + cmd.split(" ")[0] + ".js" + " " + cmd.split(" ")[1]
    ).toString();
  } catch (e) {
    return e;
  }
};

describe("JavaScript TDD framework", () => {
  it("is a CLI program", () => {
    const stdout = exec("hlj sum.test.js");
    expect(stdout).toContain("PASS");
  });
  it("should return PASS when test passed", () => {
    const stdout = exec("hlj sum.test.js");
    expect(stdout).toContain("PASS");
  });
  it("should return FAIL when test failed", () => {
    const stdout = exec("hlj failed.test.js");
    expect(stdout).toContain("FAIL");
  });
  describe("Test report", () => {
    it("should output number of tests passed", () => {
      const stdout = exec("hlj two-tests.test.js");
      expect(stdout).toContain(
        "" +
          "PASS two-tests.test.js\n" +
          "  ✓ 1 plus 1 is 2\n" +
          "  ✓ 2 plus 2 is 4\n" +
          "Tests: 2 passed, 2 total\n"
      );
    });
    it("should output number of tests passed while there are failed tests", () => {
      const stdout = exec("hlj passed-and-failed.test.js");
      expect(stdout).toContain(
        "" +
          "FAIL passed-and-failed.test.js\n" +
          "  ✓ 1 plus 1 is 2\n" +
          "  ✕ 2 plus 2 is 5\n" +
          "  Expected: 5\n" +
          "  Received: 4\n" +
          "Tests: 1 failed, 1 passed, 2 total\n"
      );
    });

    it("should output execution time", () => {
      const stdout = exec("hlj passed-and-failed.test.js");
      expect(stdout).toMatch(/Time: ([0-9]*[.])?[0-9]+ s/);
    });
  });

  describe("Test Matcher", () => {
    it("should output test not.toBe matcher", () => {
      const stdout = exec("hlj test-matcher.test.js");
      expect(stdout).toContain("PASS");
    });

    it("should output pass test not.toEqual matcher", () => {
      const stdout = exec("hlj test-matcher.test.js");
      // todo: Object diff
      expect(stdout).toContain("PASS");
      expect(stdout).toContain("Tests: 3 passed, 3 total");
    });
  });
});
