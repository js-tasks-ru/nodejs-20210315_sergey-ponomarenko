const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #lastLine = '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let tempString = `${this.#lastLine}${chunk.toString()}`;
    if (tempString.includes(os.EOL)) {
      const [line, ...rest] = tempString.split(os.EOL);
      this.push(line);
      this.#lastLine = rest.join(os.EOL);
    } else {
      this.#lastLine = tempString;
    }
    callback();
  }

  _flush(callback) {
    this.#lastLine.split(os.EOL).forEach((item) => this.push(item));
    callback();
  }
}

module.exports = LineSplitStream;
