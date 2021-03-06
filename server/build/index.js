"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _index = require("./routes/index");

var _index2 = _interopRequireDefault(_index);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

require("@babel/polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv2["default"].config();

var app = (0, _express2["default"])();
app.use(_express2["default"].json());
app.use(_express2["default"].urlencoded({
  extended: false
}));
app.use((0, _morgan2["default"])('tiny', {
  stream: _logger2["default"].stream
}));
app.use((0, _cors2["default"])()); // cors

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
  next();
});
app.use('/api/v1', _index2["default"]);
var port = process.env.PORT || 4000;
app.listen(port, function () {
  return _logger2["default"].log('info', "Listening on port ".concat(port));
});
module.exports = app;