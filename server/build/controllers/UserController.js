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

var _db = require("../services/db");

var _db2 = _interopRequireDefault(_db);

require("@babel/polyfill");

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
      var requiredProperties, query, values, _ref, rows, _rows$, id, email, first_name, last_name, address, isadmin, phone, status, token;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requiredProperties = ['email', 'first_name', 'last_name', 'password', 'phone', 'password_confirmation'];

              if (!((0, _validateData2["default"])(requiredProperties, req.body) || !(0, _validateEmail2["default"])(req.body.email))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", User.errorResponse(res, 400, 'Fill all required fields with a valid email address'));

            case 3:
              if (!(req.body.password.localeCompare(req.body.password_confirmation) !== 0)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", User.errorResponse(res, 400, 'Password and confirmation does not match'));

            case 5:
              if (!(req.body.password.length < 6 || req.body.email.length >= 30 || req.body.first_name.length >= 30 || req.body.last_name.length >= 30)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", User.errorResponse(res, 400, 'Ensure password is atleast 6 characters, name and email not more than 30 characters'));

            case 7:
              _context.next = 9;
              return (0, _handlePassword.hashPassword)(req.body.password);

            case 9:
              req.body.password = _context.sent;
              query = 'INSERT INTO users (id, email, first_name, last_name, password, address, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, address, isadmin, phone, status';
              values = [Date.now(), req.body.email, req.body.first_name, req.body.last_name, req.body.password, req.body.address, req.body.phone];
              _context.prev = 12;
              _context.next = 15;
              return _db2["default"].query(query, values);

            case 15:
              _ref = _context.sent;
              rows = _ref.rows;
              _rows$ = rows[0], id = _rows$.id, email = _rows$.email, first_name = _rows$.first_name, last_name = _rows$.last_name, address = _rows$.address, isadmin = _rows$.isadmin, phone = _rows$.phone, status = _rows$.status;
              token = (0, _generateToken2["default"])(id, isadmin);
              return _context.abrupt("return", res.status(201).set('x-auth', token).send({
                status: 201,
                data: {
                  token: token,
                  id: id,
                  email: email,
                  first_name: first_name,
                  last_name: last_name,
                  address: address,
                  isadmin: isadmin,
                  phone: phone,
                  status: status
                }
              }));

            case 22:
              _context.prev = 22;
              _context.t0 = _context["catch"](12);
              return _context.abrupt("return", _context.t0.routine === '_bt_check_unique' ? User.errorResponse(res, 400, 'User with given email or phone already exist') : User.errorResponse(res, 400, _context.t0));

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[12, 22]]);
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
      var selectAllUsers, _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // const users = UserModel.getAllUsers();
              selectAllUsers = 'SELECT (id, email, first_name, last_name, address, isAdmin, phone, status) FROM users LIMIT 50';
              _context2.prev = 1;
              _context2.next = 4;
              return _db2["default"].query(selectAllUsers);

            case 4:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              return _context2.abrupt("return", User.successResponse(res, 200, rows));

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", User.errorResponse(res, 400, _context2.t0.details));

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 9]]);
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
      var query, _ref3, rows, user, validPassword;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              delete req.headers['x-auth'];

              if (!((0, _validateData2["default"])(['email', 'password'], req.body) || !(0, _validateEmail2["default"])(req.body.email))) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", User.errorResponse(res, 400, 'Invalid login credentials'));

            case 3:
              query = "SELECT * FROM users WHERE email='".concat(req.body.email, "'");
              _context3.prev = 4;
              _context3.next = 7;
              return _db2["default"].query(query);

            case 7:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              console.log(rows);

              if (!(rows.length < 1)) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("return", User.errorResponse(res, 404, 'Wrong username/password'));

            case 12:
              user = rows[0];
              _context3.next = 15;
              return (0, _handlePassword.comparePassword)(req.body.password, user.password);

            case 15:
              validPassword = _context3.sent;

              if (validPassword) {
                _context3.next = 18;
                break;
              }

              return _context3.abrupt("return", User.errorResponse(res, 401, 'Wrong username/password'));

            case 18:
              user.token = (0, _generateToken2["default"])(user.id, user.isadmin);
              return _context3.abrupt("return", res.status(200).header('x-auth', user.token).send({
                status: 200,
                data: user
              }));

            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3["catch"](4);
              return _context3.abrupt("return", User.errorResponse(res, 404, _context3.t0));

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[4, 22]]);
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
      var userId, query, _ref4, rows, confirmPassword, hashNewPassword, updateQuery, result;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = req.userId;

              if (!(!req.body.currentPassword || !req.body.newPassword)) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt("return", User.errorResponse(res, 400, 'Fill the required fields'));

            case 3:
              query = "SELECT password FROM users WHERE id=".concat(userId);
              _context4.prev = 4;
              _context4.next = 7;
              return _db2["default"].query(query);

            case 7:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              _context4.next = 11;
              return (0, _handlePassword.comparePassword)(req.body.currentPassword, rows[0].password);

            case 11:
              confirmPassword = _context4.sent;

              if (confirmPassword) {
                _context4.next = 14;
                break;
              }

              return _context4.abrupt("return", User.errorResponse(res, 400, 'Wrong current password, use password reset link'));

            case 14:
              _context4.next = 16;
              return (0, _handlePassword.hashPassword)(req.body.newPassword);

            case 16:
              hashNewPassword = _context4.sent;
              updateQuery = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING id, email, first_name, last_name, phone, status';
              _context4.next = 20;
              return _db2["default"].query(updateQuery, [hashNewPassword, userId]);

            case 20:
              result = _context4.sent;
              return _context4.abrupt("return", User.successResponse(res, 200, result.rows[0]));

            case 24:
              _context4.prev = 24;
              _context4.t0 = _context4["catch"](4);
              return _context4.abrupt("return", User.errorResponse(res, 500, _context4.t0));

            case 27:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[4, 24]]);
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
      var makeAdminQuery, _ref5, rows;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (req.params.id) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return", User.errorResponse(res, 400, 'Request does not contain required fields'));

            case 2:
              makeAdminQuery = 'UPDATE users SET isadmin=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, isadmin, phone, status';
              _context5.prev = 3;
              _context5.next = 6;
              return _db2["default"].query(makeAdminQuery, [true, req.params.id, 'active']);

            case 6:
              _ref5 = _context5.sent;
              rows = _ref5.rows;
              return _context5.abrupt("return", rows.length < 1 ? User.errorResponse(res, 404, 'User not found or inactive') : User.successResponse(res, 200, rows[0]));

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](3);
              return _context5.abrupt("return", User.errorResponse(res, 500, _context5.t0));

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[3, 11]]);
    }));

    function makeAdmin(_x9, _x10) {
      return _makeAdmin.apply(this, arguments);
    }

    return makeAdmin;
  }(),
  logout: function logout(req, res) {
    return User.errorResponse(res, 200, 'You have been logged out successfully');
  },
  disableUser: function () {
    var _disableUser = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var userId, disableQuery, _ref6, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              userId = req.params.userId;
              disableQuery = 'UPDATE users SET status=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, isadmin, phone, status';
              _context6.prev = 2;
              _context6.next = 5;
              return _db2["default"].query(disableQuery, ['disabled', userId, 'active']);

            case 5:
              _ref6 = _context6.sent;
              rows = _ref6.rows;
              return _context6.abrupt("return", rows.length < 1 ? User.errorResponse(res, 404, 'User not found or inactive') : User.successResponse(res, 200, rows[0]));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](2);
              return _context6.abrupt("return", User.errorResponse(res, 404, _context6.t0));

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[2, 10]]);
    }));

    function disableUser(_x11, _x12) {
      return _disableUser.apply(this, arguments);
    }

    return disableUser;
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
exports["default"] = User;