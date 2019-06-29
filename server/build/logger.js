"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var options = {
  file: {
    level: 'info',
    filename: '../combined.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}; // instantiate a new Winston Logger with the settings defined above

var logger = _winston2["default"].createLogger({
  transports: [new _winston2["default"].transports.File(options.file), new _winston2["default"].transports.Console(options.console)],
  exitOnError: false // do not exit on handled exceptions

}); // create a stream object with a 'write' function that will be used by `morgan`


logger.stream = {
  // eslint-disable-next-line no-unused-vars
  write: function write(message, encoding) {
    logger.info(message);
  }
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(new _winston2["default"].transports.Console({
    format: _winston2["default"].format.simple()
  }));
}

exports["default"] = logger;