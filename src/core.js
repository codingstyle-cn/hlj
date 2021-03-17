let passedCount = 0;
let totalCount = 0;
let testCaseResults = [];

const test = (name, callback) => {
    totalCount++;
    try {
        callback();
        testCaseResults.push({name, isPassed: true});
    } catch (e) {
        testCaseResults.push({name, isPassed: false});
        throw e;
    }
};

const getToBe = actual => (expected) => {
    if (actual !== expected) {
        throw new Error("");
    }
    passedCount++;
};

const expect = (actual) => {
    return {toBe: getToBe(actual)};
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

module.exports = {test, expect, getPassedCount, getTotalCount, getTestCaseResults};
