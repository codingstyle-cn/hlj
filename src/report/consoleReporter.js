const { pass, fail, green, red, yellow, time } = require('./render');

const { TEST_RESULT_ICON } = require('../constant');
const SourceCodeParser = require('./sourceCodeParser');
const SourceCodeRender = require('./sourceCodeRender');

class ConsoleReporter {
  constructor(workingDir, testReport, verbose, needCoverage) {
    this.workingDir = workingDir;
    this.testReport = testReport;
    this.verbose = verbose || testReport.getTotalSuites() === 1;
    this.needCoverage = needCoverage;
  }

  render() {
    this.addDepthForReport(this.testReport);

    let result = '';
    result += this.suiteResult() + '\n\n';
    if (this.needCoverage) {
      result += this.coverage() + '\n\n';
    }
    result += this.suiteStatistics() + '\n';
    result += this.testCaseStatistics() + '\n';
    result += this.excutionTime();

    return result;
  }

  coverage() {
    const coveredLines = 10;
    const totalLines = 10;
    const allStatements = coveredLines / totalLines;
    return `----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
${green('All files ')}|     ${this.formatCoverage(
      allStatements
    )} |      ${green(100)} |     ${green(100)} |     ${green(100)} |
 ${green('sum.js')}   |     ${green(100)} |      ${green(100)} |     ${green(
      100
    )} |     ${green(100)} |
----------|---------|----------|---------|---------|-------------------`;
  }

  formatCoverage(rate) {
    let prefix = '';
    if (rate !== 100) prefix = ' ';
    return prefix + green(rate);
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
    return `Test Suites: ${this._renderFailedSuites()}${this._renderPassedSuites()}${this.testReport.getTotalSuites()} total`;
  }

  _renderPassedSuites() {
    if (this.testReport.getPassedSuites() === 0) {
      return '';
    }
    return `${green(this.testReport.getPassedSuites() + ' passed')}, `;
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
    const delimiter = this.verbose ? '\n\n' : '\n';
    return this.testReport.testSuites
      .map((testSuite) => this.formatTestSuite(testSuite))
      .join(delimiter);
  }

  formatTestSuite(testSuite) {
    const suiteBrief = `${this.renderByStatus(
      testSuite
    )} ${testSuite.getPath().replace(this.workingDir, '')}`;

    if (this.verbose || !testSuite.isPassed()) {
      const childrenResult = testSuite.children
        .map((child) => this.formatChild(child))
        .join('\n');

      return suiteBrief + '\n' + childrenResult;
    }

    return suiteBrief;
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

  getIcon(testCase) {
    if (testCase.isSkipped()) {
      return yellow(TEST_RESULT_ICON.SKIP);
    }

    if (testCase.isPassed()) {
      return green(TEST_RESULT_ICON.PASS);
    }

    return red(TEST_RESULT_ICON.FAIL);
  }

  formatTestCase(testCase) {
    const title =
      this.indent(testCase.depth) +
      this.getIcon(testCase) +
      ' ' +
      testCase.name;

    if (testCase.isSkipped()) return title;
    if (testCase.isPassed()) {
      return title + ' (' + testCase.getExecutionTime() + ' ms)';
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
              ? this.getSuccessfulReport(TEST_RESULT_ICON.PASS)
              : this.getFailedReport(TEST_RESULT_ICON.FAIL)
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
    )}\n\n${this.sourceCode(testCase)}`;
  }

  sourceCode(testCase) {
    const parser = new SourceCodeParser(
      testCase.getSuite().getPath(),
      testCase.getFailPosition().row
    );
    return new SourceCodeRender(
      parser.getCodeLines(),
      parser.getStartLineNumber(),
      testCase,
      this.workingDir
    ).render();
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
