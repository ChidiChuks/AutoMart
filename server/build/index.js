"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

require("dotenv/config");

var _index = require("./routes/index");

var _index2 = _interopRequireDefault(_index);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

dotenv.config();
var app = (0, _express2["default"])();
app.use(_express2["default"].json());
app.use(_express2["default"].urlencoded({
  extended: false
}));
app.use((0, _morgan2["default"])('tiny', {
  stream: _logger2["default"].stream
}));
app.use('/api/v1', _index2["default"]);
var port = process.env.PORT || 4000;
app.listen(port, function () {
  return _logger2["default"].log('info', "Listening on port ".concat(port));
});
module.exports = app;