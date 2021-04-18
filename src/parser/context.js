const { sep } = require('path');
const TestSuite = require('../model/testSuite');
const TestCase = require('../model/testCase');
const Description = require('../model/description');
const { expect } = require('../matcher');
const vm = require('vm');

class Context {
  constructor(path) {
    this.path = path.substr(0, path.lastIndexOf(sep));
  }
  create() {
    const tempChildren = [];
    const testSuite = new TestSuite('', tempChildren);

    const obj = {
      tempChildren,
      descriptions: [],
      testSuite,
      describe: (name, callback) => {
        this.describe(name, callback);
      },
      fdescribe: (name, callback) => {
        this.fdescribe(name, callback);
      },
      fit: (name, callback) => {
        this.fit(name, callback);
      },
      it: (name, callback) => {
        this.test(name, callback);
      },
      test: (name, callback) => {
        this.test(name, callback);
      },
      beforeEach: (callback) => {
        this.beforeEach(callback);
      },
      afterEach: (callback) => {
        this.afterEach(callback);
      },
      beforeAll: (callback) => {
        this.beforeAll(callback);
      },
      afterAll: (callback) => {
        this.afterAll(callback);
      },
      require: (name) => {
        return require(this.path + sep + name);
      },
      expect,
      process,
      console,
    };

    Object.defineProperty(obj.test, 'skip', {
      value: (name, callback) => {
        this.skip(name, callback);
      },
      writable: true,
    });

    Object.defineProperty(obj.describe, 'only', {
      value: (name, callback) => {
        this.fdescribe(name, callback);
      },
      writable: true,
    });

    Object.defineProperty(obj.it, 'only', {
      value: (name, callback) => {
        this.fit(name, callback);
      },
      writable: true,
    });

    Object.defineProperty(obj.test, 'only', {
      value: (name, callback) => {
        this.fit(name, callback);
      },
      writable: true,
    });

    this.context = vm.createContext(obj);
    return this.context;
  }

  fit(name, callback) {
    this.test(name, callback).setOnlyRun();
  }

  fdescribe(name, callback) {
    this.describe(name, callback).setOnlyRun();
  }

  describe(name, callback) {
    const description = new Description(name);
    this.context.descriptions.unshift(description);
    const tempChildren = this.context.tempChildren;
    tempChildren.unshift([]);
    callback();
    const children = tempChildren.shift();
    children.forEach((child) => {
      child.parent = description;
    });
    description.setChildren(children);
    this.appendToParent(description);
    this.context.descriptions.shift(description);
    return description;
  }

  beforeEach(callback) {
    if (this.context.descriptions.length > 0) {
      this.context.descriptions[0].setBeforeEach(callback);
    } else {
      this.context.testSuite.setBeforeEach(callback);
    }
  }

  beforeAll(callback) {
    if (this.context.descriptions.length > 0) {
      this.context.descriptions[0].setBeforeAll(callback);
    } else {
      this.context.testSuite.setBeforeAll(callback);
    }
  }

  afterEach(callback) {
    if (this.context.descriptions.length > 0) {
      this.context.descriptions[0].setAfterEach(callback);
    } else {
      this.context.testSuite.setAfterEach(callback);
    }
  }

  afterAll(callback) {
    this.context.testSuite.setAfterAll(callback);
  }

  test(name, callback) {
    const testCase = new TestCase(this.context.testSuite, name, callback);
    this.appendToParent(testCase);
    this.context.testSuite.getStatus().increaseTotalCount();
    return testCase;
  }

  skip(name) {
    const testCase = new TestCase(this.context.testSuite, name);
    this.appendToParent(testCase);
    this.context.testSuite.getStatus().increaseTotalCount();
  }

  appendToParent(child) {
    const tempChildren = this.context.tempChildren;
    if (Array.isArray(tempChildren[0])) {
      tempChildren[0].push(child);
    } else {
      tempChildren.push(child);
    }
  }
}

module.exports = Context;
