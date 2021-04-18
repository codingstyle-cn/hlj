const Status = require('./status');

class TestReport {
  constructor() {
    this.testSuites = [];
    this.status = new Status();
  }

  addTestSuite(testSuite) {
    this.testSuites.push(testSuite);
  }

  getTotalSuites() {
    return this.testSuites.length;
  }

  getFailedSuites() {
    return this.testSuites.filter((suite) => !suite.isPassed()).length;
  }

  getPassedSuites() {
    return this.testSuites.filter((suite) => suite.isPassed()).length;
  }

  getSuite(index) {
    return this.testSuites[index];
  }

  execute(testCaseName) {
    const startedAt = Date.now();
    this.testSuites.forEach((testSuite) => testSuite.execute(testCaseName));
    this.elapsed = Date.now() - startedAt;
    this.updateStatus();
  }

  getExcutionTime() {
    return this.elapsed;
  }

  updateStatus() {
    if (this.testSuites.every((testSuite) => testSuite.isPassed())) {
      this.status.pass();
    } else {
      this.status.fail();
    }
  }

  getSkippedCount() {
    return this.testSuites
      .map((testSuite) => testSuite.getSkippedCount())
      .reduce((a, b) => a + b, 0);
  }

  getPassedCount() {
    return this.testSuites
      .map((testSuite) => testSuite.getPassedCount())
      .reduce((a, b) => a + b, 0);
  }

  getTotalCount() {
    return this.testSuites
      .map((testSuite) => testSuite.getTotalCount())
      .reduce((a, b) => a + b, 0);
  }

  isPassed() {
    return this.status.isPassed();
  }

  getStatus() {
    return this.status;
  }
}

module.exports = TestReport;
