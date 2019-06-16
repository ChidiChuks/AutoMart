"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @description - generate auth token for users
 * @param {string} id
 * @param {boolean} userRole
 * @return {string} token
 */
_dotenv["default"].config();

var generateToken = function generateToken(id, userRole) {
  var token = _jsonwebtoken["default"].sign({
    id: id,
    role: userRole
  }, process.env.JWT_SECRET, {
    expiresIn: '12h'
  });

  return token;
};

var _default = generateToken;
exports["default"] = _default;