"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var validateData = function validateData(requiredProperties, data) {
  return requiredProperties.find(function (property) {
    return data[property] === undefined || data[property] === '';
  });
};

var _default = validateData;
exports["default"] = _default;