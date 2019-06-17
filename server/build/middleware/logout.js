"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var logout = function logout(req, res, next) {
  delete req.header('x-auth');
  return next();
};

exports["default"] = logout;