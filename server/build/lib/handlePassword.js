"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePassword = exports.hashPassword = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @description -function to hash password
 * @param {string} password
 * @returns {Promise}
 */
var hashPassword =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(password) {
    var salt, hashed;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _bcrypt["default"].genSalt(10);

          case 3:
            salt = _context.sent;
            _context.next = 6;
            return _bcrypt["default"].hash(password, salt);

          case 6:
            hashed = _context.sent;
            return _context.abrupt("return", hashed);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function hashPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description check supplied password against hashed password in db
 * @param {string} password -plain password
 * @param {string} hashedPassword - hashed password from db
 * @returns {<boolean>}
 */


exports.hashPassword = hashPassword;

var comparePassword =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(password, hashedPassword) {
    var checkPassword;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bcrypt["default"].compare(password, hashedPassword);

          case 3:
            checkPassword = _context2.sent;
            return _context2.abrupt("return", checkPassword);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function comparePassword(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.comparePassword = comparePassword;