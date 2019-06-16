"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var logout = function logout(req, res, next) {
  delete req.header('x-auth');
  return next();
};

var _default = logout;
exports["default"] = _default;