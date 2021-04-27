#!/usr/bin/env node
const fs = require('fs');
const { sep } = require('path');
const Parser = require('./parser/parser');
const Walker = require('./walker');
const ConsoleReporter = require('./report/consoleReporter');
const ArgParser = require('./parser/argParser');
const { SHOW_LOGO } = require('./constant');
const { bold } = require('./report/render');

const handleCommand = (key, fileName) => {
  if (key === 'q') process.exit();
  flushScreen();
  if (key === 'a') {
    main(workingDir, argParser.getPath(), testCaseName, argParser.verbose());
  }
  if (key === 'o') {
    main(workingDir, fileName, testCaseName, argParser.verbose());
  }

  printUsage();
};

const printUsage = () => {
  const usage = `\n${bold('Usage:')}\na - Run all tests\nq - Quit watch mode`;
  console.log(usage);
};

function* gen() {
  while (true) {
    const { key, fileName = argParser.getPath() } = yield;
    handleCommand(key, fileName);
  }
}

const main = (workingDir, fileName, testCaseName, verbose) => {
  const fullPath = workingDir + fileName;
  const walker = new Walker();

  if (walker.isDir(fullPath)) {
    console.log(`${SHOW_LOGO()}`);
  }

  const files = walker.walk(fullPath);
  const testReport = new Parser().parse(files);

  testReport.execute(testCaseName);

  const consoleReport = new ConsoleReporter(workingDir, testReport, verbose);

  const result = consoleReport.render();
  console.log(result);

  return consoleReport;
};

const argParser = new ArgParser(process.argv);
const workingDir = process.cwd() + sep;
const testCaseName = argParser.getTestCaseName();

const testReport = main(
  workingDir,
  argParser.getPath(),
  testCaseName,
  argParser.verbose()
);

const flushScreen = () => {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc');
};

const isJavaScriptFile = (fileName) => {
  return fileName.endsWith('.js');
};

if (argParser.watchMode()) {
  printUsage();
  const g = gen();
  g.next();

  let isRunning = false;
  fs.watch(workingDir, { recursive: true }, (eventType, fileName) => {
    if (isRunning) {
      console.log('Running, skipped');
      return;
    }
    isRunning = true;

    const walker = new Walker();
    const isTestFile = walker.isTestFile(fileName);
    if (!isTestFile && !isJavaScriptFile(fileName)) {
      isRunning = false;
      return;
    }

    isTestFile ? g.next({ key: 'o', fileName }) : g.next({ key: 'a' });
    isRunning = false;
  });

  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  stdin.on('data', function (data) {
    const key = data.toString().trim();
    g.next({ key });
  });
}
module.exports = testReport;
