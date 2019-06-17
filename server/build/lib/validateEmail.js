"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @description - function to verify email addresses
 * @param {string} -email
 * @return {boolean}
 */
var emailIsValid = function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports["default"] = emailIsValid;