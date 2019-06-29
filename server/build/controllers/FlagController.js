"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _db = require("../services/db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Flag = {
  createFlag: function () {
    var _createFlag = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var flagsReqs, description, carId, reason, severity, query, text, createQuery, _ref, rows, result, values, newFlag;

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

              return _context.abrupt("return", Flag.errorResponse(res, 400, 'Ensure to indicate the ad id and reason for the report'));

            case 4:
              description = req.body.description ? req.body.description : 'none';
              carId = req.body.carId;
              reason = req.body.reason.toLowerCase();
              severity = 'minor';

              if (reason === 'fake' || reason === 'stolen' || reason === 'suspicious') {
                severity = 'extreme';
              }

              query = "SELECT id FROM flags WHERE carid=".concat(carId, " AND reportedby=").concat(req.body.reportedBy);
              text = "SELECT owner FROM cars WHERE id=".concat(carId, " AND status='available'");
              createQuery = 'INSERT INTO flags(id, carid, reason, description, reportedby, severity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
              _context.prev = 12;
              _context.next = 15;
              return _db2["default"].query(query);

            case 15:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length > 0)) {
                _context.next = 19;
                break;
              }

              return _context.abrupt("return", Flag.errorResponse(res, 406, 'Your report on this ad is already recorded'));

            case 19:
              _context.next = 21;
              return _db2["default"].query(text);

            case 21:
              result = _context.sent;

              if (!(result.rows.length < 1)) {
                _context.next = 24;
                break;
              }

              return _context.abrupt("return", Flag.errorResponse(res, 406, 'This ad is no longer available'));

            case 24:
              values = [Date.now(), carId, reason, description, req.userId, severity];
              _context.next = 27;
              return _db2["default"].query(createQuery, values);

            case 27:
              newFlag = _context.sent;
              return _context.abrupt("return", Flag.successResponse(res, 201, newFlag.rows[0]));

            case 31:
              _context.prev = 31;
              _context.t0 = _context["catch"](12);
              return _context.abrupt("return", Flag.errorResponse(res, 500, _context.t0));

            case 34:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[12, 31]]);
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
      var text, _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(req.params.flagId.trim().length !== 13)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", Flag.errorResponse(res, 400, 'Invalid flag id'));

            case 2:
              text = "UPDATE flags SET status='resolved' WHERE id=".concat(req.params.flagId, " AND status='pending' RETURNING *");
              _context2.prev = 3;
              _context2.next = 6;
              return _db2["default"].query(text);

            case 6:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              return _context2.abrupt("return", rows.length < 1 ? Flag.errorResponse(res, 404, 'Flag already updated or not available') : Flag.successResponse(res, 200, rows[0]));

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](3);
              return _context2.abrupt("return", Flag.errorResponse(res, 500, _context2.t0));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 11]]);
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
      var query, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(req.params.flagId.trim().length !== 13)) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", Flag.errorResponse(res, 400, 'Invalid flag id'));

            case 2:
              query = "DELETE FROM flags WHERE id=".concat(req.params.flagId, " RETURNING *");
              _context3.prev = 3;
              _context3.next = 6;
              return _db2["default"].query(query);

            case 6:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? Flag.errorResponse(res, 404, 'Flag not found') : Flag.successResponse(res, 200, rows[0]));

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](3);
              return _context3.abrupt("return", Flag.errorResponse(res, 500, _context3.t0));

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 11]]);
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
      var query, _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = 'SELECT * FROM flags GROUP BY status, id';
              _context4.prev = 1;
              _context4.next = 4;
              return _db2["default"].query(query);

            case 4:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? Flag.errorResponse(res, 200, 'There are no flags today') : Flag.successResponse(res, 200, rows));

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](1);
              return _context4.abrupt("return", Flag.errorResponse(res, 500, _context4.t0));

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[1, 9]]);
    }));

    function getAllFlags(_x7, _x8) {
      return _getAllFlags.apply(this, arguments);
    }

    return getAllFlags;
  }(),
  errorResponse: function errorResponse(res, statuscode, message) {
    return res.status(statuscode).send({
      status: statuscode,
      message: message
    });
  },
  successResponse: function successResponse(res, statuscode, data) {
    return res.status(statuscode).send({
      status: statuscode,
      data: data
    });
  }
};
exports["default"] = Flag;