"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

var _UserModel = require("../../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

var _generateToken = require("../../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var expect = _chai2["default"].expect;
var signupUrl = '/api/v1/auth/signup';
var loginUrl = '/api/v1/auth/signin';

_chai2["default"].use(_chaiHttp2["default"]);

describe('User', function () {
  var usersArray = function usersArray() {
    _UserModel2["default"].users = _usersData2["default"];
  };

  describe('User create', function () {
    // it('should return a new user with the supplied properties', (done) => {
    //     const userDetails = {
    //         email: 'johndoe@gmail.com',
    //         first_name: 'John',
    //         last_name: 'Doe',
    //         password: 'password',
    //         password_confirmation: 'password',
    //         // address: 'my address',
    //         phone: '08136266387',
    //         // account_number: '0119260095',
    //         // bank: 'GTB',
    //     };
    //     chai.request(server).post(signupUrl).send(userDetails).end((err, res) => {
    //         expect(res.status).to.eq(201);
    //         expect(res.body.data.email).to.eq(userDetails.email);
    //         expect(res.body.data.phone).to.eq(userDetails.phone);
    //         // expect(res.body.data.address).to.eq(userDetails.address);
    //         // expect(res.body.data.account_number).to.eq(userDetails.account_number);
    //         // expect(res.body.data.bank).to.eq(userDetails.bank);
    //         done();
    //     });
    // });
    it('should return error if password and its confirmation does not match', function (done) {
      var data = {
        email: 'chidi@gmail.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'power',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Password and confirmation does not match');
        done();
      });
    });
    it('should return error if all required fields are not supplied', function (done) {
      var data = {
        email: 'chiboychuks@gmail.com',
        first_name: 'Anthonia',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields with a valid email address');
        done();
      });
    });
    it('should return error if invalid email address is supplied', function (done) {
      var data = {
        email: 'chidi.gmail.com',
        first_name: 'Karmanis',
        last_name: 'Valec',
        password: 'password',
        password_confirmation: 'password',
        // address: 'my address',
        phone: '08136266387' // account_number: '0119260095',
        // bank: 'GTB',

      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields with a valid email address');
        done();
      });
    });
    it('should return error if length of password is less than 6 characters', function (done) {
      var data = {
        email: 'Chidiebere@gmail.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'pass',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'pass'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if last name or first name or email is more than 30 characters', function (done) {
      var data = {
        email: 'justhnodhmdjdjhdkeh@akehdgdhekdhdimdhkshs.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if user email has been used', function (done) {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('User with given email or phone already exist');
        done();
      });
    });
    it('should return error if given phone has been used', function (done) {
      usersArray();
      var data = {
        email: 'chiboychuks@gmail.com',
        first_name: 'John',
        last_name: 'Chuks',
        password: 'password',
        // address: 'my address',
        phone: _usersData2["default"][0].phone,
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('User with given email or phone already exist');
        done();
      });
    });
  }); // user sign in

  describe('User Signin', function () {
    it('should return error 400 if user did not supply password', function (done) {
      usersArray();

      _chai2["default"].request(_index2["default"]).post(loginUrl).send({
        email: 'johndoe@google.dev'
      }).then(function (res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 404 if user email is not found', function (done) {
      var data = {
        email: 'johng@gmail.com',
        password: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).then(function (res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 401 if password is incorrect for given email', function (done) {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        password: 'pasword'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Wrong username/password');
        done();
      });
    });
    it('should return a header with token and credentials if password and email are correct', function () {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        password: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res).to.have.header('x-auth');
        expect(res.body.data).to.have.property('email').eq(data.email);
      });
    });
  }); // user change password

  describe('User change password', function () {
    it('should return user with updated password', function (done) {
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
        currentPassword: 'password',
        newPassword: 'newpassword'
      }).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('Object');
        expect(res.body.data.email).to.eq(user.email);
        done();
      });
    });
    it('should return 400 if current password is wrong', function (done) {
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
        currentPassword: 'password1',
        newPassword: 'anotherpassword'
      }).end(function (err, res) {
        expect(res.body.status).to.eq(400);
        expect(res.body.message).to.eq('Wrong current password, use password reset link');
        done();
      });
    });
    it('should return 400 if current password is not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var user, token;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              usersArray();
              user = _usersData2["default"][0];
              user.isAdmin = false;
              _context.next = 5;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 5:
              token = _context.sent;

              _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
                newPassword: 'newpassword'
              }).then(function (res) {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq('Fill the required fields');
              });

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('should return 401 if user is not logged in', function (done) {
      usersArray();

      _chai2["default"].request(_index2["default"]).patch('/api/v1/user').send({
        currentPassword: 'password',
        newPassword: 'newpassword'
      }).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // admin get all users

  describe('get all users', function () {
    it('should return all registered users',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var user, token;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              usersArray();
              user = _usersData2["default"][1];
              user.isAdmin = true;
              _context2.next = 5;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 5:
              token = _context2.sent;

              _chai2["default"].request(_index2["default"]).get('/api/v1/users').set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(200);
                expect(res.body.data).to.be.an('Array');
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));
    it('should return error 401 if user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var user, token;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              usersArray();
              user = _usersData2["default"][1];
              user.isAdmin = false;
              _context3.next = 5;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 5:
              token = _context3.sent;

              _chai2["default"].request(_index2["default"]).get('/api/v1/users').set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(401);
                expect(res.body.message).to.eq('You dont have the permission to access this resource');
              });

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));
    it('should return error 401 if user is not logged in', function () {
      usersArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/users').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    });
  });
  describe('Admin make user admin', function () {
    it('Should make a user an admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var newAdmin, user, token;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              usersArray();
              _usersData2["default"][0].isAdmin = false;
              newAdmin = _usersData2["default"][0];
              _usersData2["default"][2].isAdmin = true;
              user = _usersData2["default"][2];
              _context4.next = 7;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 7:
              token = _context4.sent;

              _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(newAdmin.id)).set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(200);
                expect(res.body.data).to.have.property('id').eq(newAdmin.id); // eslint-disable-next-line no-unused-expressions

                expect(res.body.data).to.have.property('isAdmin').to.be["true"];
              });

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
    it('Should error 401 if admin is not logged in', function () {
      usersArray();
      _usersData2["default"][0].isAdmin = false;
      var newAdmin = _usersData2["default"][0];

      _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(newAdmin.id)).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    });
    it('Should return error 412 if user is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var user, token;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              usersArray();
              _usersData2["default"][2].isAdmin = true;
              user = _usersData2["default"][2];
              _context5.next = 5;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 5:
              token = _context5.sent;

              _chai2["default"].request(_index2["default"]).patch('/api/v1/user/1212121212121').set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(412);
                expect(res.body.message).to.eq('User not found or inactive');
              });

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('Should return error 412 if user is not active',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var newAdmin, user, token;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              usersArray();
              _usersData2["default"][0].isAdmin = false;
              _usersData2["default"][0].status = 'suspended';
              newAdmin = _usersData2["default"][0];
              _usersData2["default"][2].isAdmin = true;
              user = _usersData2["default"][2];
              _context6.next = 8;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 8:
              token = _context6.sent;

              _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(newAdmin.id)).set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(412);
                expect(res.body.message).to.eq('User not found or inactive');
              });

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });
  describe('User logout', function () {
    it('should log a user out of the app',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var user, token;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              usersArray();
              user = _usersData2["default"][0];
              _context7.next = 4;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 4:
              token = _context7.sent;

              _chai2["default"].request(_index2["default"]).get('/api/v1/auth/logout').set('x-auth', token).end(function (err, res) {
                expect(res.status).to.eq(200); // eslint-disable-next-line no-unused-expressions

                expect(res).not.to.have.header('x-auth');
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
  });
});