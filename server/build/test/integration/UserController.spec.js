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

require("@babel/polyfill");

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
      phone: "".concat(Math.floor(Math.random() * 10000000000)),
      account_number: 20903928394,
      bank: 'UBA'
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
  }(); // before(async() => {
  //     await db.query("CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, isAdmin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16) NOT NULL UNIQUE, account_number BIGINT NOT NULL, bank VARCHAR(20) NOT NULL, status VARCHAR(10) NOT NULL DEFAULT 'active', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  //     await db.query("CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT 'available', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT NOT NULL, img VARCHAR(150) NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )");
  //     await db.query("CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  carId BIGINT NOT NULL REFERENCES cars(id) ON DELETE RESTRICT, sellerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT 'pending', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), priceOffered NUMERIC NOT NULL CHECK(priceOffered > 0), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  //     await db.query("CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, carId BIGINT REFERENCES cars(id) ON DELETE RESTRICT, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT 'pending', severity VARCHAR(20) NOT NULL DEFAULT 'minor') ");
  //     const data = await dataValues();
  //     await chai.request(server).post(signupUrl).send(data);
  //     await chai.request(server).post(signupUrl).send(data);
  // });
  // after(async() => {
  //     await db.query("DELETE FROM flags");
  //     await db.query("DELETE FROM orders");
  //     await db.query("DELETE FROM cars");
  //     await db.query("DELETE FROM users");
  // });


  describe('User create', function () {
    it('should return a new user with the supplied properties',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var userDetails, res;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userDetails = dataValues();
              _context4.next = 3;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(userDetails);

            case 3:
              res = _context4.sent;
              expect(res.status).to.eq(201);
              expect(res.body.data).to.have.property('token');
              expect(res.body.data).to.have.property('id');
              expect(res.body.data.email).to.eq(userDetails.email);
              expect(res.body.data.phone).to.eq(userDetails.phone);
              expect(res.body.data.status).to.eq('active');

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
    it('should return error if password and its confirmation does not match',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = dataValues();
              data.password_confirmation = 'password1';
              _context5.next = 4;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 4:
              res = _context5.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Password and confirmation does not match');

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
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
              expect(res.body.message).to.eq('Fill all required fields with a valid email address');

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
              expect(res.body.message).to.eq('Fill all required fields with a valid email address');

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
              expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');

            case 8:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should return error if last name or first name or email is more than 30 characters', function (done) {
      var data = dataValues();
      data.last_name = 'Lastnameofsomeonewithalonganmethatis';

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if user email has been used',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var _ref12, rows, data, res;

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
              _context9.next = 8;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 8:
              res = _context9.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('User with given email or phone already exist');

            case 11:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
    it('should return error if given phone has been used',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var _ref14, rows, data, res;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _db2["default"].query('SELECT phone from users limit 1');

            case 2:
              _ref14 = _context10.sent;
              rows = _ref14.rows;
              data = dataValues();
              data.phone = "".concat(rows[0].phone);
              _context10.next = 8;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

            case 8:
              res = _context10.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('User with given email or phone already exist');

            case 11:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
  }); // user sign in

  describe('User Signin', function () {
    it('should login a user and set token in the header',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var email, data, res;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return userEmail();

            case 2:
              email = _context11.sent;
              data = {
                email: "".concat(email),
                password: 'password'
              };
              _context11.next = 6;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 6:
              res = _context11.sent;
              expect(res.status).to.eq(200);
              expect(res).to.have.header('x-auth');
              expect(res.body.data).to.have.property('email').eq(data.email);

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('should return error 400 if user did not supply password',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var email, res;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return userEmail();

            case 2:
              email = _context12.sent;
              _context12.next = 5;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send({
                email: email
              });

            case 5:
              res = _context12.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Invalid login credentials');

            case 8:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
    it('should return error 404 if user email is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              data = {
                email: 'ooooookoook@email.com',
                password: 'password'
              };
              _context13.next = 3;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 3:
              res = _context13.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('Wrong username/password');

            case 6:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('should return error 401 if password is incorrect for given username',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var email, data, res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return userEmail();

            case 2:
              email = _context14.sent;
              data = {
                email: "".concat(email),
                password: 'pasword'
              };
              _context14.next = 6;
              return _chai2["default"].request(_index2["default"]).post(loginUrl).send(data);

            case 6:
              res = _context14.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('Wrong username/password');

            case 9:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
  }); // user change password

  describe('User change password', function () {
    it('should return user with updated password',
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
              return _chai2["default"].request(_index2["default"]).patch(changePasswordUrl).set('x-auth', token).send({
                currentPassword: 'password',
                newPassword: 'newpassword'
              });

            case 5:
              res = _context15.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Object');

            case 8:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('should return 400 if current password is wrong',
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
                currentPassword: 'password1',
                newPassword: 'anotherpassword'
              });

            case 5:
              res = _context16.sent;
              expect(res.body.status).to.eq(400);
              expect(res.body.message).to.eq('Wrong current password, use password reset link');

            case 8:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return 400 if current password is not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return genToken();

            case 2:
              token = _context17.sent;
              _context17.next = 5;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user').set('x-auth', token).send({
                newPassword: 'newpassword'
              });

            case 5:
              res = _context17.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Fill the required fields');

            case 8:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
    it('should return 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var res;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user').send({
                currentPassword: 'password',
                newPassword: 'newpassword'
              });

            case 2:
              res = _context18.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 5:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })));
  }); // admin get all users

  describe('get all users', function () {
    it('should return all registered users',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return adminToken();

            case 2:
              token = _context19.sent;
              _context19.next = 5;
              return _chai2["default"].request(_index2["default"]).get(allUsersUrl).set('x-auth', token);

            case 5:
              res = _context19.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');

            case 8:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })));
    it('should return error 401 if user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return genToken();

            case 2:
              token = _context20.sent;
              _context20.next = 5;
              return _chai2["default"].request(_index2["default"]).get(allUsersUrl).set('x-auth', token);

            case 5:
              res = _context20.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You dont have the permission to access this resource');

            case 8:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, this);
    })));
    it('should return error 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee21() {
      var res;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/users');

            case 2:
              res = _context21.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 5:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, this);
    })));
  }); // make user admin

  describe('Admin make user admin', function () {
    it('Should make a user an admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee22() {
      var token, _ref27, rows, id, res;

      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return adminToken();

            case 2:
              token = _context22.sent;
              _context22.next = 5;
              return _db2["default"].query('SELECT id FROM users limit 2');

            case 5:
              _ref27 = _context22.sent;
              rows = _ref27.rows;
              id = rows[1].id;
              _context22.next = 10;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(id)).set('x-auth', token);

            case 10:
              res = _context22.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.have.property('id').eq(id); // eslint-disable-next-line no-unused-expressions

              expect(res.body.data).to.have.property('isadmin').to.be["true"];

            case 14:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, this);
    })));
    it('Should return error 401 if admin is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee23() {
      var _ref29, rows, id, res;

      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return _db2["default"].query('SELECT id FROM users limit 2');

            case 2:
              _ref29 = _context23.sent;
              rows = _ref29.rows;
              id = rows[1].id;
              _context23.next = 7;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(id));

            case 7:
              res = _context23.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 10:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this);
    })));
    it('Should return error 404 if user is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee24() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return adminToken();

            case 2:
              token = _context24.sent;
              _context24.next = 5;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/user/1212121212121').set('x-auth', token);

            case 5:
              res = _context24.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('User not found or inactive');

            case 8:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, this);
    })));
  }); // // user logout
  // describe('User logout', () => {
  //   it('should log a user out of the app', async () => {
  //     const token = await genToken();
  //     const res = chai.request(server).get('/api/v1/auth/logout').set('x-auth', token);
  //     expect(res.status).to.eq(200);
  //     // eslint-disable-next-line no-unused-expressions
  //     expect(res).not.to.have.header('x-auth');
  //   });
  // });

  describe('Admin disable a user', function () {
    it('should disable a user',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee25() {
      var token, _ref32, rows, id, res;

      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return adminToken();

            case 2:
              token = _context25.sent;
              _context25.next = 5;
              return _db2["default"].query('SELECT id FROM users limit 2');

            case 5:
              _ref32 = _context25.sent;
              rows = _ref32.rows;
              id = rows[1].id;
              _context25.next = 10;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/users/".concat(id)).set('x-auth', token);

            case 10:
              res = _context25.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.status).to.eq('disabled');

            case 14:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, this);
    })));
    it('should return error 404 if user is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee26() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return adminToken();

            case 2:
              token = _context26.sent;
              _context26.next = 5;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/users/1212121212121').set('x-auth', token);

            case 5:
              res = _context26.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('User not found or inactive');

            case 8:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26, this);
    })));
  });
});