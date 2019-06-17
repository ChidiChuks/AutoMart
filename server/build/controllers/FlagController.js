"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CarModel = require("../models/CarModel");

var _CarModel2 = _interopRequireDefault(_CarModel);

var _FlagModel = require("../models/FlagModel");

var _FlagModel2 = _interopRequireDefault(_FlagModel);

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Flag = {
  createFlag: function createFlag(req, res) {
    req.body.reportedBy = req.userId;
    var flagsReqs = ['carId', 'reason', 'reportedBy'];

    if ((0, _validateData2["default"])(flagsReqs, req.body)) {
      return res.status(400).send({
        status: 400,
        message: 'Ensure to indicate the ad id and reason for the report'
      });
    }

    var cartoFlag = _CarModel2["default"].carIsEligible(req.body.carId);

    if (!cartoFlag) {
      return res.status(404).send({
        status: 404,
        message: 'The ad is not longer active. Thank you.'
      });
    }

    if (req.body.reason.toLowerCase() === 'fake' || req.body.reason.toLowerCase() === 'stolen' || req.body.reason === 'suspicious') {
      req.body.severity = 'extreme';
    } // send the report


    var newFlag = _FlagModel2["default"].createFlag(req.body);

    return res.status(200).send({
      status: 200,
      data: newFlag
    });
  },
  updateFlag: function updateFlag(req, res) {
    var flag = _FlagModel2["default"].findSingleFlag(req.params.flagId);

    if (!flag) {
      return res.status(404).send({
        status: 404,
        message: 'Flag not found'
      });
    }

    var updatedFlag = _FlagModel2["default"].updateFlagStatus(req.params.flagId);

    return res.status(200).send({
      status: 200,
      data: updatedFlag
    });
  },
  deleteFlag: function deleteFlag(req, res) {
    var flag = _FlagModel2["default"].findSingleFlag(req.params.flagId);

    if (!flag) {
      return res.status(404).send({
        status: 404,
        message: 'The flag is no longer available'
      });
    }

    return res.status(200).send({
      status: 200,
      message: 'Flag successfully deleted'
    });
  },
  getAllFlags: function getAllFlags(req, res) {
    var flags = _FlagModel2["default"].getAllFlags();

    if (flags.length < 1) {
      return res.status(404).send({
        status: 404,
        message: 'There are no flags now.'
      });
    }

    return res.status(200).send({
      status: 200,
      data: flags
    });
  }
};
exports["default"] = Flag;