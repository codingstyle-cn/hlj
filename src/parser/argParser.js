class ArgParser {
  constructor(args) {
    this.args = args;
  }

  getPath() {
    if (this.args.length === 2) {
      return '.';
    }

    const nonOptions = this.args.filter((arg) => !arg.startsWith('--'));
    return nonOptions[nonOptions.length - 1];
  }

  getTestCaseName() {
    const index1 = this.args.indexOf('-t');
    if (index1 === -1) return '';
    const index2 = this.args.indexOf('--');
    return this.args.slice(index1 + 1, index2).join(' ');
  }

  verbose() {
    return this.args.includes('--verbose');
  }

  watchMode() {
    return this.args.includes('--watch');
  }

  coverage() {
    return this.args.includes('--coverage');
  }
}

module.exports = ArgParser;
