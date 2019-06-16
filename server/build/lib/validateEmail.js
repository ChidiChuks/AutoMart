"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * @description - function to verify email addresses
 * @param {string} -email
 * @return {boolean}
 */
var emailIsValid = function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

var _default = emailIsValid;
exports["default"] = _default;