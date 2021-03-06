"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

var _db = require("../../services/db");

var _db2 = _interopRequireDefault(_db);

var _generateToken = require("../../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var expect = _chai2["default"].expect;
var signupUrl = '/api/v1/auth/signup';
var loginUrl = '/api/v1/auth/signin';
var changePasswordUrl = '/api/v1/user';
var allUsersUrl = '/api/v1/users';

_chai2["default"].use(_chaiHttp2["default"]);

describe('User', function () {
  var dataValues = function dataValues() {
    return {
      email: "".concat(Math.random().toString(36).substring(2, 15), "@gmail.com"),
      first_name: "Fi".concat(Math.random().toString(36).substring(2, 15)),
      last_name: "La".concat(Math.random().toString(36).substring(2, 15)),
      password: 'password',
      password_confirmation: 'password',
      address: 'my address',
      phone: "".concat(Math.floor(Math.random() * 10000000000))
    };
  };

  var userEmail =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var email;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db2["default"].query('SELECT email FROM users limit 1');

            case 2:
              email = _context.sent;
              return _context.abrupt("return", email.rows[0].email);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function userEmail() {
      return _ref.apply(this, arguments);
    };
  }();

  var genToken =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _ref3, rows, id;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _db2["default"].query('SELECT id FROM users limit 1');

            case 2:
              _ref3 = _context2.sent;
              rows = _ref3.rows;
              id = rows[0].id;
              return _context2.abrupt("return", (0, _generateToken2["default"])(id, false));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function genToken() {
      return _ref2.apply(this, arguments);
    };
  }();

  var adminToken =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var _ref5, rows, id;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _db2["default"].query('SELECT id FROM users limit 1');

            case 2:
              _ref5 = _context3.sent;
              rows = _ref5.rows;
              id = rows[0].id;
              return _context3.abrupt("return", (0, _generateToken2["default"])(id, true));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function adminToken() {
      return _ref4.apply(this, arguments);
    };
  }();

  before(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var data;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16), status VARCHAR(10) NOT NULL DEFAULT \'active\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 2:
            _context4.next = 4;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT \'available\', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT, image_url VARCHAR(150), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )');

          case 4:
            _context4.next = 6;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE, seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT \'pending\', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), price_offered NUMERIC NOT NULL CHECK(price_offered > 0), new_price_offered NUMERIC, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 6:
            _context4.next = 8;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, car_id BIGINT REFERENCES cars(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT \'pending\', severity VARCHAR(20) NOT NULL DEFAULT \'minor\') ');

          case 8:
            _context4.next = 10;
            return dataValues();

          case 10:
            data = _context4.sent;
            _context4.next = 13;
            return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(data);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  after(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _db2["default"].query('DELETE FROM flags');

          case 2:
            _context5.next = 4;
            return _db2["default"].query('DELETE FROM orders');

          case 4:
            _context5.next = 6;
            return _db2["default"].query('DELETE FROM cars');

          case 6:
            _context5.next = 8;
            return _db2["default"].query('DELETE FROM users');

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
  describe('User create', function () {
    it('should return error if all required fields are not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              data = dataValues();
              data.first_name = '';
              _context6.next = 4;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 4:
              res = _context6.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Fill all required fields with a valid email address');

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
    it('should return error if invalid email address is supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              data = dataValues();
              data.email = "".concat(Math.random().toString(36).substring(2, 15), "gmail.com");
              _context7.next = 4;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 4:
              res = _context7.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Fill all required fields with a valid email address');

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('should return error if length of password is less than 6 characters',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              data = dataValues();
              data.password = 'passw';
              data.password_confirmation = 'passw';
              _context8.next = 5;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 5:
              res = _context8.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');

            case 8:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should return error if last name or first name or email is more than 30 characters', function (done) {
      var data = dataValues();
      data.last_name = 'Lastnameofsomeonewithelongnamethatis';

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.error).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if user email has been used',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var _ref12, rows, data;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _db2["default"].query('SELECT email from users limit 1');

            case 2:
              _ref12 = _context9.sent;
              rows = _ref12.rows;
              data = dataValues();
              data.email = "".concat(rows[0].email);

              _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).then(function (res) {
                expect(res.status).to.eq(400);
                expect(res.body.error).to.eq('User with given email or phone already exist');
              });

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
  }); // user sign in

  describe('User Signin', function () {
    it('should login a user and set token in the header',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var email, data, res;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return userEmail();

            case 2:
              email = _context10.sent;
              data = {
                email: "".concat(email),
                password: 'password'
              };
              _context10.next = 6;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 6:
              res = _context10.sent;
              expect(res.status).to.eq(200);
              expect(res).to.have.header('x-auth');
              expect(res.body.data).to.have.property('email').eq(data.email);

            case 10:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
    it('should return error 400 if user did not supply password',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var email, res;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return userEmail();

            case 2:
              email = _context11.sent;
              _context11.next = 5;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send({
                email: email
              });

            case 5:
              res = _context11.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Invalid login credentials');

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('should return error 404 if user email is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              data = {
                email: 'ooooookoook@email.com',
                password: 'password'
              };
              _context12.next = 3;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 3:
              res = _context12.sent;
              expect(res.status).to.eq(404);
              expect(res.body.error).to.eq('Wrong username/password');

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
    it('should return error 401 if password is incorrect for given username',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var email, data, res;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return userEmail();

            case 2:
              email = _context13.sent;
              data = {
                email: "".concat(email),
                password: 'pasword'
              };
              _context13.next = 6;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 6:
              res = _context13.sent;
              expect(res.status).to.eq(401);
              expect(res.body.error).to.eq('Wrong username/password');

            case 9:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
  }); // user change password

  describe('User change password', function () {
    it('should return user with updated password',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return genToken();

            case 2:
              token = _context14.sent;
              _context14.next = 5;
              return _chai2["default"].request(_index2["default"]).patch(changePasswordUrl).set('x-auth', token).send({
                currentPassword: 'password',
                newPassword: 'newpassword'
              });

            case 5:
              res = _context14.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Object');

            case 8:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
    it('should return 400 if current password is wrong',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return genToken();

            case 2:
              token = _context15.sent;
              _context15.next = 5;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
                currentPassword: 'password1',
                newPassword: 'anotherpassword'
              });

            case 5:
              res = _context15.sent;
              expect(res.body.status).to.eq(400);
              expect(res.body.error).to.eq('Wrong current password, use password reset link');

            case 8:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('should return 400 if current password is not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return genToken();

            case 2:
              token = _context16.sent;
              _context16.next = 5;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
                newPassword: 'newpassword'
              });

            case 5:
              res = _context16.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Fill the required fields');

            case 8:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return error 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var res;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user').send({
                currentPassword: 'password',
                newPassword: 'newpassword'
              });

            case 2:
              res = _context17.sent;
              expect(res.status).to.eq(401);
              expect(res.body.error).to.eq('No authorization token provided');

            case 5:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
  }); // user logout

  describe('User logout', function () {
    it('should log a user out of the app',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return genToken();

            case 2:
              token = _context18.sent;
              _context18.next = 5;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/auth/logout').set('x-auth', token);

            case 5:
              res = _context18.sent;
              expect(res.status).to.eq(200);

            case 7:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })));
  });
});