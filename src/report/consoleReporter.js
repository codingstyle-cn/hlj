const { pass, fail, skip, green, red, yellow, time } = require('./render');

const { TEST_RESULT } = require('./constant');

class ConsoleReporter {
  constructor(workingDir, testReport) {
    this.workingDir = workingDir;
    this.testReport = testReport;
  }

  render() {
    this.addDepthForReport(this.testReport);

    let result = '';
    result += this.suiteResult() + '\n\n';
    result += this.suiteStatistics() + '\n';
    result += this.testCaseStatistics() + '\n';
    result += this.excutionTime();

    return result;
  }

  addDepthForReport(testReport) {
    testReport.testSuites.forEach((s) => {
      this.addDepth(s, 0);
    });
  }

  addDepth(parent, depth) {
    parent.depth = depth;
    if (parent.children) {
      parent.children.forEach((p) => {
        this.addDepth(p, depth + 1);
      });
    }
  }

  suiteStatistics() {
    return `Test Suites: ${this._renderFailedSuites()}${green(
      this.testReport.getPassedSuites() + ' passed'
    )}, ${this.testReport.getTotalSuites()} total`;
  }
  _renderFailedSuites() {
    if (this.testReport.getFailedSuites() === 0) {
      return '';
    }
    return `${red(this.testReport.getFailedSuites() + ' failed')}, `;
  }

  testCaseStatistics() {
    const totalCount = this.testReport.getTotalCount();
    const passedCount = this.testReport.getPassedCount();
    const skippedCount = this.testReport.getSkippedCount();
    const failedCount = totalCount - passedCount - skippedCount;

    return `Tests: ${this.getSkippedCountString(
      skippedCount
    )}${this.getFailedCountString(failedCount)}${this.getPassedCountString(
      passedCount
    )}${totalCount} total`;
  }

  excutionTime() {
    return `Time: ${time(this.testReport.getExcutionTime() / 1000)}`;
  }

  suiteResult() {
    return this.testReport.testSuites
      .map((testSuite) => this.formatTestSuite(testSuite))
      .join('\n\n');
  }

  formatTestSuite(testSuite) {
    const childrenResult = testSuite.children
      .map((child) => this.formatChild(child))
      .join('\n');

    return `${this.renderByStatus(testSuite)} ${testSuite
      .getPath()
      .replace(this.workingDir, '')}\n${childrenResult}`;
  }

  formatChild(child) {
    if (child.children) {
      return (
        this.indent(child.depth) +
        child.name +
        '\n' +
        child.children.map((c) => this.formatChild(c)).join('\n')
      );
    }

    return this.formatTestCase(child);
  }

  indent(depth) {
    const blanks = [];
    for (let i = 0; i < depth; i++) {
      blanks.push('  ');
    }

    return blanks.join('');
  }

  formatTestCase(testCase) {
    if (testCase.getStatus().isSkipped()) {
      return '';
    }

    const icon = testCase.getStatus().isPassed()
      ? green(TEST_RESULT.PASS)
      : red(TEST_RESULT.FAIL);
    const title =
      this.indent(testCase.depth) +
      icon +
      ' ' +
      testCase.name +
      ' (' +
      testCase.getExecutionTime() +
      ' ms)';
    if (testCase.isPassed()) {
      return title;
    }
    return (
      title +
      '\n' +
      this.indentAll(testCase.depth + 1, this.getDiffMessage(testCase))
    );
  }

  indentAll(depth, text) {
    return text
      .split('\n')
      .map((line) => this.indent(depth) + line)
      .join('\n');
  }

  formatTestResult(testCaseResults) {
    testCaseResults
      .map(
        (testCase) =>
          `  ${
            testCase.isPassed
              ? this.getSuccessfulReport(TEST_RESULT.PASS)
              : this.getFailedReport(TEST_RESULT.FAIL)
          } ${testCase.name}`
      )
      .join('\n');
  }

  getPassedCountString(passedCount) {
    if (passedCount === 0) return '';
    return `${green(passedCount + ' passed')}, `;
  }

  getSkippedCountString(count) {
    if (count === 0) return '';
    return `${yellow(count + ' skipped')}, `;
  }

  getFailedCountString(failedCount) {
    if (failedCount === 0) {
      return '';
    }

    return `${red(failedCount + ' failed')}, `;
  }

  getDiffMessage(testCase) {
    if (testCase.isPassed()) {
      return '';
    }

    return `Expected: ${green(testCase.getExpected())}\nReceived: ${red(
      testCase.getReceived()
    )}`;
  }

  renderByStatus(testSuite) {
    if (testSuite.isPassed()) {
      return pass('PASS');
    }

    return fail('FAIL');
  }
  isPassed() {
    return this.testReport.isPassed();
  }
}
module.exports = ConsoleReporter;
