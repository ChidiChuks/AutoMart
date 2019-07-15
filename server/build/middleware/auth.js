"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Util = require("../lib/Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable max-len */

/**
 * @description - middleware to check and verify tokens
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {function} next - callback function
 * @returns {object}
 */
_dotenv2["default"].config();

var auth = function auth(req, res, next) {
  var token = req.header('x-auth') || req.body.token || req.headers['x-auth'] || req.headers.token;

  if (!token) {
    return _Util2["default"].sendError(res, 401, 'No authorization token provided');
  }

  try {
    var decoded = _jsonwebtoken2["default"].verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;
    return next();
  } catch (err) {
    return _Util2["default"].sendError(res, 401, 'Unauthorized, invalid token or session have expired');
  }
};

exports["default"] = auth;