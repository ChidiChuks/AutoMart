"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UserModel = require("../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _handlePassword = require("../lib/handlePassword");

var _validateEmail = require("../lib/validateEmail");

var _validateEmail2 = _interopRequireDefault(_validateEmail);

var _generateToken = require("../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

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
      var requiredProperties, checkEmailInDb, checkPhoneInDb, user, token;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requiredProperties = ['email', 'first_name', 'last_name', 'password', 'phone',
              /*'account_number', 'bank',*/
              'password_confirmation'];

              if (!((0, _validateData2["default"])(requiredProperties, req.body) || !(0, _validateEmail2["default"])(req.body.email))) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Fill all required fields with a valid email address'
              }));

            case 3:
              if (!(req.body.password.localeCompare(req.body.password_confirmation) !== 0)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Password and confirmation does not match'
              }));

            case 5:
              if (!(req.body.password.length < 6 || req.body.email.length >= 30 || req.body.first_name.length >= 30 || req.body.last_name.length >= 30)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Ensure password is atleast 6 characters, name and email not more than 30 characters'
              }));

            case 7:
              checkEmailInDb = _UserModel2["default"].findByProperty('email', req.body.email);
              checkPhoneInDb = _UserModel2["default"].findByProperty('phone', req.body.phone);

              if (!(checkEmailInDb || checkPhoneInDb)) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'User with given email or phone already exist'
              }));

            case 11:
              _context.next = 13;
              return (0, _handlePassword.hashPassword)(req.body.password);

            case 13:
              req.body.password = _context.sent;
              user = _UserModel2["default"].create(req.body);
              token = (0, _generateToken2["default"])(user.id, user.isAdmin);
              return _context.abrupt("return", res.status(201).header('x-auth', token).send({
                status: 201,
                data: {
                  token: token,
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone,
                  // address: user.address,
                  // account_number: user.account_number,
                  // bank: user.bank,
                  isAdmin: user.isAdmin
                }
              }));

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  getAll: function getAll(req, res) {
    var users = _UserModel2["default"].getAllUsers();

    return res.status(200).send({
      status: 200,
      data: users
    });
  },
  signIn: function () {
    var _signIn = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var user, validPassword;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              delete req.headers['x-auth'];

              if (!(0, _validateData2["default"])(['email', 'password'], req.body)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Invalid login credentials'
              }));

            case 3:
              user = _UserModel2["default"].isUserActive('email', req.body.email);

              if (user) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return", res.status(404).send({
                status: 404,
                message: 'Invalid login credentials'
              }));

            case 6:
              _context2.next = 8;
              return (0, _handlePassword.comparePassword)(req.body.password, user.password);

            case 8:
              validPassword = _context2.sent;

              if (validPassword) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", res.status(401).send({
                status: 401,
                message: 'Wrong username/password'
              }));

            case 11:
              user.token = (0, _generateToken2["default"])(user.id, user.isAdmin);
              return _context2.abrupt("return", res.status(200).header('x-auth', user.token).send({
                status: 200,
                data: user
              }));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function signIn(_x3, _x4) {
      return _signIn.apply(this, arguments);
    }

    return signIn;
  }(),
  changePassword: function () {
    var _changePassword = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var userId, user, confirmPassword, hashNewPassword, updatedUserDetails;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              userId = req.userId;

              if (!(!req.body.currentPassword || !req.body.newPassword)) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Fill the required fields'
              }));

            case 3:
              user = _UserModel2["default"].getUser(userId);

              if (user) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt("return", res.status(404).send({
                message: 'User not found',
                status: 404
              }));

            case 6:
              _context3.next = 8;
              return (0, _handlePassword.comparePassword)(req.body.currentPassword, user.password);

            case 8:
              confirmPassword = _context3.sent;

              if (confirmPassword) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Wrong current password, use password reset link'
              }));

            case 11:
              _context3.next = 13;
              return (0, _handlePassword.hashPassword)(req.body.newPassword);

            case 13:
              hashNewPassword = _context3.sent;
              updatedUserDetails = _UserModel2["default"].changePassword(userId, hashNewPassword);
              return _context3.abrupt("return", res.send({
                status: 200,
                data: updatedUserDetails
              }));

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function changePassword(_x5, _x6) {
      return _changePassword.apply(this, arguments);
    }

    return changePassword;
  }(),
  makeAdmin: function makeAdmin(req, res) {
    var user = _UserModel2["default"].isUserActive('id', req.params.id);

    if (!user) {
      return res.status(412).send({
        status: 412,
        message: 'User not found or inactive'
      });
    }

    var newAdmin = _UserModel2["default"].makeUserAdmin(user.id);

    return res.status(200).send({
      status: 200,
      data: newAdmin
    });
  },
  logout: function logout(req, res) {
    return res.status(200).send({
      status: 200,
      message: 'You have been logged out successfully'
    });
  },
  disableUser: function disableUser(req, res) {
    // the userid is in the params
    var userId = req.params.userid;

    if (!userId) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid request'
      });
    } // check that the user is active


    var user = _UserModel2["default"].isUserActive('id', userId);

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: 'User not found or inactive'
      });
    } // disable the user


    var disabledUser = _UserModel2["default"].disableUser(userId); // return the result


    return res.status(200).send({
      status: 200,
      data: disabledUser
    });
  }
};
exports["default"] = User;