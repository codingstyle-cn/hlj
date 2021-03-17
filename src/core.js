let passedCount = 0;
let totalCount = 0;
let testCaseResults = [];

const test = (name, callback) => {
  totalCount++;
  try {
    callback();
    testCaseResults.push({ name, isPassed: true });
  } catch (e) {
    testCaseResults.push({ name, isPassed: false });
    throw e;
  }
};

const getToBe = (isNot) => (received) => (expected) => {
  if (received !== expected && !isNot) {
    throw new Error(JSON.stringify({ expected, received }));
  }
  passedCount++;
};

const getToEqual = (isNot) => (received) => (expected) => {
  const isObject = typeof received === 'object' && typeof expected === 'object';
  const condition = isObject
    ? JSON.stringify(received) !== JSON.stringify(expected)
    : received !== expected;

  if (condition && !isNot) {
    throw new Error(JSON.stringify({ expected, received }));
  }
  passedCount++;
};

const expect = (received) => {
  const matchers = (isNot = false) => ({
    toBe: getToBe(isNot)(received),
    toEqual: getToEqual(isNot)(received),
  });
  return {
    ...matchers(),
    not: { ...matchers(true) },
  };
};

const getPassedCount = () => {
  return passedCount;
};

const getTotalCount = () => {
  return totalCount;
};

const getTestCaseResults = () => {
  return testCaseResults;
};

module.exports = {
  test,
  expect,
  getPassedCount,
  getTotalCount,
  getTestCaseResults,
};
