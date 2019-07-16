"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handlePassword = require("../lib/handlePassword");

var _validateEmail = require("../lib/validateEmail");

var _validateEmail2 = _interopRequireDefault(_validateEmail);

var _generateToken = require("../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _UserService = require("../services/UserService");

var _UserService2 = _interopRequireDefault(_UserService);

var _Util = require("../lib/Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var User = {
  /*
   * @description - creates a new user
   * @params {object}
   * @returns {object}
   */
  create: function () {
    var _create = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var requiredProperties, values, _ref, rows, _rows$, id, email, first_name, last_name, address, is_admin, status, token;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requiredProperties = ['email', 'first_name', 'last_name', 'password', 'address'];

              if (!((0, _validateData2["default"])(requiredProperties, req.body) || !(0, _validateEmail2["default"])(req.body.email))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'Fill all required fields with a valid email address'));

            case 3:
              if (!(req.body.password.length < 6 || req.body.email.length >= 30 || req.body.first_name.length >= 30 || req.body.last_name.length >= 30)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'Ensure password is atleast 6 characters, name and email not more than 30 characters'));

            case 5:
              _context.next = 7;
              return (0, _handlePassword.hashPassword)(req.body.password);

            case 7:
              req.body.password = _context.sent;
              values = [Date.now(), req.body.email, req.body.first_name, req.body.last_name, req.body.password, req.body.address];
              _context.prev = 9;
              _context.next = 12;
              return _UserService2["default"].createUser(values);

            case 12:
              _ref = _context.sent;
              rows = _ref.rows;
              _rows$ = rows[0], id = _rows$.id, email = _rows$.email, first_name = _rows$.first_name, last_name = _rows$.last_name, address = _rows$.address, is_admin = _rows$.is_admin, status = _rows$.status;
              token = (0, _generateToken2["default"])(id, is_admin, first_name);
              return _context.abrupt("return", res.status(201).set('x-auth', token).send({
                status: 201,
                data: {
                  token: token,
                  id: id,
                  email: email,
                  first_name: first_name,
                  last_name: last_name,
                  address: address,
                  is_admin: is_admin,
                  status: status
                }
              }));

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](9);
              return _context.abrupt("return", _context.t0.routine === '_bt_check_unique' ? _Util2["default"].sendError(res, 400, 'User with given email or phone already exist') : _Util2["default"].sendError(res, 500, _context.t0.message));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[9, 19]]);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  getAll: function () {
    var _getAll = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _UserService2["default"].getAllUsers();

            case 3:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              return _context2.abrupt("return", _Util2["default"].sendSuccess(res, 200, rows));

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", _Util2["default"].sendError(res, 500, _context2.t0.message));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 8]]);
    }));

    function getAll(_x3, _x4) {
      return _getAll.apply(this, arguments);
    }

    return getAll;
  }(),
  signIn: function () {
    var _signIn = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var _ref3, rows, user, validPassword, data;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              delete req.headers['x-auth'];

              if (!((0, _validateData2["default"])(['email', 'password'], req.body) || !(0, _validateEmail2["default"])(req.body.email))) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid login credentials'));

            case 3:
              _context3.prev = 3;
              _context3.next = 6;
              return _UserService2["default"].getUserByEmail(req.body.email);

            case 6:
              _ref3 = _context3.sent;
              rows = _ref3.rows;

              if (!(rows.length < 1)) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt("return", _Util2["default"].sendError(res, 404, 'Wrong username/password'));

            case 10:
              user = rows[0];
              _context3.next = 13;
              return (0, _handlePassword.comparePassword)(req.body.password, user.password);

            case 13:
              validPassword = _context3.sent;

              if (validPassword) {
                _context3.next = 16;
                break;
              }

              return _context3.abrupt("return", _Util2["default"].sendError(res, 401, 'Wrong username/password'));

            case 16:
              user.token = (0, _generateToken2["default"])(user.id, user.is_admin);
              data = {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin,
                first_name: user.first_name,
                last_name: user.last_name,
                status: user.status,
                token: user.token
              };
              return _context3.abrupt("return", res.status(200).header('x-auth', user.token).send({
                status: 200,
                data: user
              }));

            case 21:
              _context3.prev = 21;
              _context3.t0 = _context3["catch"](3);
              return _context3.abrupt("return", _Util2["default"].sendError(res, 500, _context3.t0.message));

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 21]]);
    }));

    function signIn(_x5, _x6) {
      return _signIn.apply(this, arguments);
    }

    return signIn;
  }(),
  changePassword: function () {
    var _changePassword = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var userId, _ref4, rows, confirmPassword, hashNewPassword, result;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = req.userId;

              if (!(!req.body.currentPassword || !req.body.newPassword)) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt("return", _Util2["default"].sendError(res, 400, 'Fill the required fields'));

            case 3:
              _context4.prev = 3;
              _context4.next = 6;
              return _UserService2["default"].selectPassword(userId);

            case 6:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              _context4.next = 10;
              return (0, _handlePassword.comparePassword)(req.body.currentPassword, rows[0].password);

            case 10:
              confirmPassword = _context4.sent;

              if (confirmPassword) {
                _context4.next = 13;
                break;
              }

              return _context4.abrupt("return", _Util2["default"].sendError(res, 400, 'Wrong current password, use password reset link'));

            case 13:
              _context4.next = 15;
              return (0, _handlePassword.hashPassword)(req.body.newPassword);

            case 15:
              hashNewPassword = _context4.sent;
              _context4.next = 18;
              return _UserService2["default"].updateUserPassword([hashNewPassword, userId]);

            case 18:
              result = _context4.sent;
              return _context4.abrupt("return", _Util2["default"].sendSuccess(res, 200, result.rows[0]));

            case 22:
              _context4.prev = 22;
              _context4.t0 = _context4["catch"](3);
              return _context4.abrupt("return", _Util2["default"].sendError(res, 500, _context4.t0.message));

            case 25:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[3, 22]]);
    }));

    function changePassword(_x7, _x8) {
      return _changePassword.apply(this, arguments);
    }

    return changePassword;
  }(),
  makeAdmin: function () {
    var _makeAdmin = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var _ref5, rows;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (req.params.id) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return", _Util2["default"].sendError(res, 400, 'Request does not contain required fields'));

            case 2:
              _context5.prev = 2;
              _context5.next = 5;
              return _UserService2["default"].makeUserAdmin([true, req.params.id, 'active']);

            case 5:
              _ref5 = _context5.sent;
              rows = _ref5.rows;
              return _context5.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'User not found or inactive') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](2);
              return _context5.abrupt("return", _Util2["default"].sendError(res, 500, _context5.t0.message));

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[2, 10]]);
    }));

    function makeAdmin(_x9, _x10) {
      return _makeAdmin.apply(this, arguments);
    }

    return makeAdmin;
  }(),
  logout: function logout(req, res) {
    return _Util2["default"].sendSuccess(res, 200, 'Successfully logged out');
  },
  disableUser: function () {
    var _disableUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var userId, _ref6, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              userId = req.params.userId; // const disableQuery = 'UPDATE users SET status=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, isadmin, phone, status';

              _context6.prev = 1;
              _context6.next = 4;
              return _UserService2["default"].disableUser(['disabled', userId, 'active']);

            case 4:
              _ref6 = _context6.sent;
              rows = _ref6.rows;
              return _context6.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'User not found or inactive') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](1);
              return _context6.abrupt("return", _Util2["default"].sendError(res, 404, _context6.t0));

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[1, 9]]);
    }));

    function disableUser(_x11, _x12) {
      return _disableUser.apply(this, arguments);
    }

    return disableUser;
  }()
};
exports["default"] = User;