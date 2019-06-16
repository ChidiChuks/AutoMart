"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CarModel = _interopRequireDefault(require("../models/CarModel"));

var _FlagModel = _interopRequireDefault(require("../models/FlagModel"));

var _validateData = _interopRequireDefault(require("../lib/validateData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Flag = {
  createFlag: function createFlag(req, res) {
    req.body.reportedBy = req.userId;
    var flagsReqs = ['carId', 'reason', 'reportedBy'];

    if ((0, _validateData["default"])(flagsReqs, req.body)) {
      return res.status(400).send({
        status: 400,
        message: 'Ensure to indicate the ad id and reason for the report'
      });
    }

    var cartoFlag = _CarModel["default"].carIsEligible(req.body.carId);

    if (!cartoFlag) {
      return res.status(404).send({
        status: 404,
        message: 'The ad is not longer active. Thank you.'
      });
    }

    if (req.body.reason.toLowerCase() === 'fake' || req.body.reason.toLowerCase() === 'stolen' || req.body.reason === 'suspicious') {
      req.body.severity = 'extreme';
    } // send the report


    var newFlag = _FlagModel["default"].createFlag(req.body);

    return res.status(200).send({
      status: 200,
      data: newFlag
    });
  },
  updateFlag: function updateFlag(req, res) {
    var flag = _FlagModel["default"].findSingleFlag(req.params.flagId);

    if (!flag) {
      return res.status(404).send({
        status: 404,
        message: 'Flag not found'
      });
    }

    var updatedFlag = _FlagModel["default"].updateFlagStatus(req.params.flagId);

    return res.status(200).send({
      status: 200,
      data: updatedFlag
    });
  },
  deleteFlag: function deleteFlag(req, res) {
    var flag = _FlagModel["default"].findSingleFlag(req.params.flagId);

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
    var flags = _FlagModel["default"].getAllFlags();

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
var _default = Flag;
exports["default"] = _default;