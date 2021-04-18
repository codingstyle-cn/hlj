class Description {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.isSkipped = false;
    this.onlyRun = false;
  }

  skip() {
    this.children.forEach((child) => {
      child.skip();
    });
  }

  setOnlyRun() {
    this.onlyRun = true;
  }

  setChildren(children) {
    this.children = children;
  }

  getName() {
    return this.name;
  }

  getFullName() {
    if (this.parent) {
      return this.parent.getFullName() + ' ' + this.name;
    }

    return this.name;
  }

  getChild(index) {
    return this.children[index];
  }

  execute(testCaseName) {
    if (this.isSkipped) {
      this.children.forEach((child) => {
        child.status.skip();
      });
      return;
    }

    const onlyRunTestCases = this.children.filter((child) => !!child.onlyRun);

    let toRunList = this.children;
    if (onlyRunTestCases.length > 0) {
      this.skipOthers();
      toRunList = onlyRunTestCases;
    }

    this.beforeAll && this.beforeAll();
    toRunList.forEach((child) => {
      this.beforeEach && this.beforeEach();
      child.execute(testCaseName);
      this.afterEach && this.afterEach();
    });
    this.afterAll && this.afterAll();
  }

  skipOthers() {
    this.children
      .filter((child) => {
        return !child.onlyRun;
      })
      .forEach((child) => {
        child.skip();
      });
  }

  isPassed() {
    return this.children.every((child) => child.isPassed());
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

  setBeforeEach(callback) {
    this.beforeEach = callback;
  }

  setBeforeAll(callback) {
    this.beforeAll = callback;
  }

  setAfterEach(callback) {
    this.afterEach = callback;
  }
}

module.exports = Description;
