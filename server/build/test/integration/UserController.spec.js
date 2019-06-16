"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../../index"));

var _UserModel = _interopRequireDefault(require("../../models/UserModel"));

var _usersData = _interopRequireDefault(require("../usersData"));

var _generateToken = _interopRequireDefault(require("../../lib/generateToken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var expect = _chai["default"].expect;
var signupUrl = '/api/v1/auth/signup';
var loginUrl = '/api/v1/auth/signin';

_chai["default"].use(_chaiHttp["default"]);

describe('User', function () {
  var usersArray = function usersArray() {
    _UserModel["default"].users = _usersData["default"];
  };

  describe('User create', function () {
    it('should return a new user with the supplied properties', function (done) {
      var userDetails = {
        name: 'Krank Ertin',
        email: 'kkkkkkjj@gmail.com',
        password: 'password'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(userDetails).end(function (err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.data.email).to.eq(userDetails.email);
        done();
      });
    });
    it('should return error if password and its confirmation does not match', function (done) {
      var data = {
        name: 'Chidiebere',
        email: 'chidiebere_chukwuma@yahoo.com',
        password: 'power'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Password does not match');
        done();
      });
    });
    it('should return error if all required fields are not supplied', function (done) {
      var data = {
        name: 'Chidiebere',
        email: 'chidiebere_chukwuma@yahoo.com',
        password: ' '
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields');
        done();
      });
    });
    it('should return error if invalid email address is supplied', function (done) {
      var data = {
        name: 'Chidiebere',
        email: 'chidi.gmail.com',
        password: 'powerful'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid / empty email supplied');
        done();
      });
    });
    it('should return error if length of password is less than 6 characters', function (done) {
      var data = {
        name: 'Chidiebere',
        email: 'chidi.gmail.com',
        password: 'passw'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Password is too short');
        done();
      });
    });
    it('should return error if name is more than 50 characters or email is more than 30 characters', function (done) {
      var data = {
        name: 'Chidiebere',
        email: 'justhnodhmdjdjhdkeh@akehdgdhekdhdimdhkshs.com',
        password: 'password'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Name or email is too long');
        done();
      });
    });
    it('should return error if user email has been used', function (done) {
      usersArray();
      var data = {
        name: 'Chidiebere',
        email: _usersData["default"][0].email,
        password: 'password'
      };

      _chai["default"].request(_index["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('User with given email already exist');
        done();
      });
    });
  }); // user sign in

  describe('User Signin', function () {
    it('should return error 400 if user did not supply password', function (done) {
      usersArray();

      _chai["default"].request(_index["default"]).post(loginUrl).send({
        email: 'johndoe@google.dev'
      }).then(function (res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 404 if user email is not found', function (done) {
      var data = {
        email: 'jjjohng@gmail.com',
        password: 'password'
      };

      _chai["default"].request(_index["default"]).post(loginUrl).send(data).then(function (res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 401 if password is incorrect for given email', function (done) {
      usersArray();
      var data = {
        email: _usersData["default"][0].email,
        password: 'pasword'
      };

      _chai["default"].request(_index["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Wrong username/password');
        done();
      });
    });
    it('should return a header with token and credentials if password and email are correct', function () {
      usersArray();
      var data = {
        email: _usersData["default"][0].email,
        password: 'password'
      };

      _chai["default"].request(_index["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res).to.have.header('x-auth');
        expect(res.body.data).to.have.property('email').eq(data.email);
      });
    });
  }); // user change password

  describe('User change password', function () {
    it('should return user with updated password', function (done) {
      usersArray();
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);

      _chai["default"].request(_index["default"]).patch('/api/v1/user').set('x-auth', token).send({
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
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);

      _chai["default"].request(_index["default"]).patch('/api/v1/user').set('x-auth', token).send({
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
              user = _usersData["default"][0];
              user.isAdmin = false;
              _context.next = 5;
              return (0, _generateToken["default"])(user.id, user.isAdmin);

            case 5:
              token = _context.sent;

              _chai["default"].request(_index["default"]).patch('/api/v1/user').set('x-auth', token).send({
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
      }, _callee);
    })));
    it('should return 401 if user is not logged in', function (done) {
      usersArray();

      _chai["default"].request(_index["default"]).patch('/api/v1/user').send({
        currentPassword: 'password',
        newPassword: 'newpassword'
      }).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  });
});