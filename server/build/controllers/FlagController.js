"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _FlagService = require("../services/FlagService");

var _FlagService2 = _interopRequireDefault(_FlagService);

var _Util = require("../lib/Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Flag = {
  createFlag: function () {
    var _createFlag = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var flagsReqs, description, carId, reason, severity, _ref, rows, result, values, newFlag;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req.body.reportedBy = req.userId;
              flagsReqs = ['carId', 'reason', 'reportedBy'];

              if (!(0, _validateData2["default"])(flagsReqs, req.body)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'Ensure to indicate the ad id and reason for the report'));

            case 4:
              description = req.body.description ? req.body.description : 'none';
              carId = req.body.carId;
              reason = req.body.reason.toLowerCase();
              severity = 'minor';

              if (reason === 'fake' || reason === 'stolen' || reason === 'suspicious') {
                severity = 'extreme';
              } // const query = `SELECT id FROM flags WHERE carid=${carId} AND reportedby=${req.body.reportedBy}`;
              // const text = `SELECT owner FROM cars WHERE id=${carId} AND status='available'`;
              // const createQuery = 'INSERT INTO flags(id, carid, reason, description, reportedby, severity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';


              _context.prev = 9;
              _context.next = 12;
              return _FlagService2["default"].getReportByUser([carId, req.body.reportedBy]);

            case 12:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length > 0)) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 406, 'Your report on this ad is already recorded'));

            case 16:
              _context.next = 18;
              return _FlagService2["default"].getCarOwner(carId);

            case 18:
              result = _context.sent;

              if (!(result.rows.length < 1)) {
                _context.next = 21;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 406, 'This ad is no longer available'));

            case 21:
              values = [Date.now(), carId, reason, description, req.userId, severity];
              _context.next = 24;
              return _FlagService2["default"].createNewFlag(values);

            case 24:
              newFlag = _context.sent;
              return _context.abrupt("return", _Util2["default"].sendSuccess(res, 201, newFlag.rows[0]));

            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](9);
              return _context.abrupt("return", _Util2["default"].sendError(res, 500, _context.t0.message));

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[9, 28]]);
    }));

    function createFlag(_x, _x2) {
      return _createFlag.apply(this, arguments);
    }

    return createFlag;
  }(),
  updateFlag: function () {
    var _updateFlag = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(req.params.flagId.trim().length !== 13)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid flag id'));

            case 2:
              _context2.prev = 2;
              _context2.next = 5;
              return _FlagService2["default"].updateFlag(req.params.flagId);

            case 5:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              return _context2.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'Flag already updated or not available') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", _Util2["default"].sendError(res, 500, _context2.t0.message));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 10]]);
    }));

    function updateFlag(_x3, _x4) {
      return _updateFlag.apply(this, arguments);
    }

    return updateFlag;
  }(),
  deleteFlag: function () {
    var _deleteFlag = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var _ref3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(req.params.flagId.trim().length !== 13)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid flag id'));

            case 2:
              _context3.prev = 2;
              _context3.next = 5;
              return _FlagService2["default"].deleteFlag(req.params.flagId);

            case 5:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'Flag not found') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", _Util2["default"].sendError(res, 500, _context3.t0.message));

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[2, 10]]);
    }));

    function deleteFlag(_x5, _x6) {
      return _deleteFlag.apply(this, arguments);
    }

    return deleteFlag;
  }(),
  getAllFlags: function () {
    var _getAllFlags = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _FlagService2["default"].getAllFlags();

            case 3:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no flags today') : _Util2["default"].sendSuccess(res, 200, rows));

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", _Util2["default"].sendError(res, 500, _context4.t0.message));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 8]]);
    }));

    function getAllFlags(_x7, _x8) {
      return _getAllFlags.apply(this, arguments);
    }

    return getAllFlags;
  }()
};
exports["default"] = Flag;