const TestReport = require('../model/testReport');
const Context = require('./context');
const fs = require('fs');
const vm = require('vm');
const Coverage = require('../coverage/coverage');

class Parser {
  constructor(coverage) {
    this.coverage = coverage;
  }

  parse(files) {
    const testReport = new TestReport();
    files
      .map((fileName) => {
        return this.parseFile(fileName);
      })
      .forEach((testSuite) => {
        testReport.addTestSuite(testSuite);
      });
    return testReport;
  }

  parseFile(fileName) {
    let code = fs.readFileSync(fileName).toString();
    if (this.coverage) {
      code = new Coverage().prepare(code);
    }
    const script = new vm.Script(code);
    const context = new Context(fileName).create();
    script.runInContext(context);
    const testSuite = context.testSuite;
    testSuite.setPath(fileName);
    return testSuite;
  }
}

module.exports = Parser;
