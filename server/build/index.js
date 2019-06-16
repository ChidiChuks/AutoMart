"use strict";

var _express = _interopRequireDefault(require("express"));

var _winston = _interopRequireDefault(require("winston"));

var _index = _interopRequireDefault(require("./routes/index"));

require("dotenv/config");

var _logging = _interopRequireDefault(require("./logging"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));

_logging["default"].configure();

app.use('/api/v1', _index["default"]);
var port = process.env.PORT || 4000;
app.listen(port, function () {
  return _winston["default"].log('debug', "Listening on port ".concat(port));
});
module.exports = app;