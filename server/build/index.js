"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _index = require("./routes/index");

var _index2 = _interopRequireDefault(_index);

require("dotenv/config");

var _logging = require("./logging");

var _logging2 = _interopRequireDefault(_logging);

var _swagger = require("../swagger.yaml");

var _swagger2 = _interopRequireDefault(_swagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express2["default"])();
app.use(_express2["default"].json());
app.use(_express2["default"].urlencoded({
  extended: false
}));

_logging2["default"].configure();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(_swagger2["default"]));
app.use('/api/v1', _index2["default"]);
var port = process.env.PORT || 4000;
app.listen(port, function () {
  return _winston2["default"].log('debug', "Listening on port ".concat(port));
});
module.exports = app;