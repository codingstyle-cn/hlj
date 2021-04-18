const Status = require('./status');

class TestSuite {
  constructor(path, children) {
    this.path = path;
    this.status = new Status();
    this.descriptions = [];
    this.children = children;
  }

  setStatus(status) {
    this.status = status;
  }

  getTotalCount() {
    return this.children.reduce((count, child) => {
      if (!child.children) {
        return count + 1;
      }
      return count + child.getTotalCount();
    }, 0);
  }

  getPath() {
    return this.path;
  }

  getFullName() {
    return this.name;
  }

  getChild(index) {
    return this.children[index];
  }

  setPath(path) {
    this.path = path;
  }

  execute(testCaseName) {
    this.updateOnlyRunStatus();

    this.beforeAll && this.beforeAll();

    this.children.forEach((child) => {
      this.beforeEach && this.beforeEach();
      child.execute(testCaseName);
      this.afterEach && this.afterEach();
    });
    this.afterAll && this.afterAll();
    this.updateStatus();
  }

  updateOnlyRunStatus() {
    const isOnlyRunExisted = !!this.children.find((child) => child.onlyRun);

    if (isOnlyRunExisted) {
      this.children
        .filter((child) => !child.onlyRun)
        .forEach((child) => {
          child.skip();
        });
    }
  }

  updateStatus() {
    if (this.children.every((child) => child.isPassed())) {
      this.status.pass();
    } else {
      this.status.fail();
    }
  }

  getFailedCount() {
    return this.children
      .map((child) => child.getFailedCount())
      .reduce((a, b) => a + b, 0);
  }

  getPassedCount() {
    return this.children
      .map((child) => child.getPassedCount())
      .reduce((a, b) => a + b, 0);
  }

  getSkippedCount() {
    return this.children
      .map((child) => child.getSkippedCount())
      .reduce((a, b) => a + b, 0);
  }

  isPassed() {
    return (
      this.getSkippedCount() + this.getPassedCount() === this.getTotalCount()
    );
  }

  getStatus() {
    return this.status;
  }

  setBeforeEach(callback) {
    this.beforeEach = callback;
  }

  setAfterEach(callback) {
    this.afterEach = callback;
  }

  setBeforeAll(beforeAll) {
    this.beforeAll = beforeAll;
  }

  setAfterAll(callback) {
    this.afterAll = callback;
  }
}

module.exports = TestSuite;
