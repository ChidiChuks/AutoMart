"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var validateData = function validateData(requiredProperties, data) {
  return requiredProperties.find(function (property) {
    return data[property] === undefined || data[property] === '';
  });
};

exports["default"] = validateData;