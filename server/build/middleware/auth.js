"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @description - middleware to check and verify tokens
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {function} next - callback function
 * @returns {object}
 */
_dotenv["default"].config();

var auth = function auth(req, res, next) {
  var token = req.header('x-auth');

  if (!token) {
    return res.status(401).send({
      status: 401,
      message: 'No authorization token provided'
    });
  }

  try {
    var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;
    return next();
  } catch (err) {
    return res.status(401).send({
      status: 401,
      message: 'Unauthorized, invalid token or session have expired'
    });
  }
};

var _default = auth;
exports["default"] = _default;