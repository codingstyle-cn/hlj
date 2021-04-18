const { TEST_RESULT_STATUS } = require('../constant');
class Status {
  constructor() {
    this.skippedCount = 0;
    this.failedCount = 0;
    this.passedCount = 0;
    this.totalCount = 0;
  }

  pass() {
    this.status = TEST_RESULT_STATUS.PASSED;
  }

  fail() {
    this.status = TEST_RESULT_STATUS.FAILED;
  }

  skip() {
    this.status = TEST_RESULT_STATUS.SKIPPED;
  }

  isFailed() {
    return this.status === TEST_RESULT_STATUS.FAILED;
  }

  isPassed() {
    return this.status === TEST_RESULT_STATUS.PASSED;
  }

  isSkipped() {
    return this.status === TEST_RESULT_STATUS.SKIPPED;
  }

  getSkippedCount() {
    return this.skippedCount;
  }

  getFailedCount() {
    return this.failedCount;
  }

  getPassedCount() {
    return this.passedCount;
  }

  getTotalCount() {
    return this.totalCount;
  }

  increaseTotalCount() {
    this.totalCount++;
  }

  passed(count) {
    this.passedCount = count;
  }
}

module.exports = Status;
