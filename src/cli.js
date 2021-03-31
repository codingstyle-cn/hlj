const testReport = require('./hlj');
const { TEST_RESULT } = require('./report/constant');
if (!testReport.isPassed()) {
  process.exit(1);
}
