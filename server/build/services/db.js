"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require("pg");

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pool = new _pg.Pool({
  connectionString: _config2["default"]
});

_logger2["default"].log('info', "Connected to ".concat(_config2["default"], " database"));

exports["default"] = {
  query: function query(text, params) {
    return new Promise(function (resolve, reject) {
      pool.query(text, params).then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }
};