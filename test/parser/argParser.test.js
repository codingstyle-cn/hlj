const ArgParser = require('../../src/parser/argParser');

describe('Arg Parser', () => {
  describe('--verbose', () => {
    it('should be false when not provided', () => {});
    it('should be true when provided', () => {
      const args = ['hlj', 'test/parser/', '--verbose'];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('test/parser/');
      expect(argParser.verbose()).toEqual(true);
    });
  });

  describe('--watch', () => {
    it('should be false when not provided', () => {
      const args = ['/usr/local/bin/node', '/usr/local/bin/hlj', 'fixture'];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('fixture');
      expect(argParser.watchMode()).toEqual(false);
    });

    it('should be true when provided', () => {
      const args = [
        '/usr/local/bin/node',
        '/usr/local/bin/hlj',
        'fixture',
        '--watch',
      ];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('fixture');
      expect(argParser.watchMode()).toEqual(true);
    });
  });

  describe('--coverage', () => {
    it('should be false when not provided', () => {
      const args = ['/usr/local/bin/node', '/usr/local/bin/hlj', 'fixture'];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('fixture');
      expect(argParser.coverage()).toEqual(false);
    });

    it('should be true when provided', () => {
      const args = [
        '/usr/local/bin/node',
        '/usr/local/bin/hlj',
        'fixture',
        '--coverage',
      ];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('fixture');
      expect(argParser.coverage()).toEqual(true);
    });
  });

  describe('vim-test', () => {
    it('parse args of TestFile', () => {
      const args = [
        '/usr/local/bin/node',
        '/usr/local/bin/hlj',
        '--no-coverage',
        '--',
        'test/parser/argParser.test.js',
      ];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('test/parser/argParser.test.js');
      expect(argParser.getTestCaseName()).toEqual('');
    });

    it('should parse path when manually run', () => {
      const args = ['/usr/local/bin/node', '/usr/local/bin/hlj', 'test/'];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('test/');
      expect(argParser.getTestCaseName()).toEqual('');
    });

    it('parse args of TestNearest', () => {
      const args = [
        '/usr/local/bin/node',
        '/usr/local/bin/hlj',
        '--no-coverage',
        '-t',
        "'^Arg",
        'Parser',
        'should',
        'parse',
        'test',
        'case',
        "name$'",
        '--',
        'test/parser/argParser.test.js',
      ];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('test/parser/argParser.test.js');
      expect(argParser.getTestCaseName()).toEqual(
        "'^Arg Parser should parse test case name$'"
      );
    });

    it('parse args of TestSuite', () => {
      const args = ['/usr/local/bin/node', '/usr/local/bin/hlj'];
      const argParser = new ArgParser(args);
      expect(argParser.getPath()).toEqual('.');
      expect(argParser.getTestCaseName()).toEqual('');
    });
  });
});
