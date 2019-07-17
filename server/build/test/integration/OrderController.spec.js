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

_chai2["default"].use(_chaiHttp2["default"]);

describe('Order transaction', function () {
  var userId =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _ref2, rows;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _db2["default"].query('SELECT id FROM users LIMIT 1');

            case 2:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              return _context.abrupt("return", rows[0]);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function userId() {
      return _ref.apply(this, arguments);
    };
  }();

  var genToken =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var userdata;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return userId();

            case 2:
              userdata = _context2.sent;
              return _context2.abrupt("return", (0, _generateToken2["default"])(userdata.id, false));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function genToken() {
      return _ref3.apply(this, arguments);
    };
  }();

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

  var carManufacturers = ['BMW', 'Audi', 'Mercedes', 'Toyota', 'Nissan'];
  var models = ['M5', 'Audi i8', 'E360', '4 Runner', 'Avalon', 'Altima', 'Maxima'];
  var bodyt = ['Sedan', 'Station Wagon', 'SUV', 'TRUCK', 'BUS'];

  var newAdValues = function newAdValues() {
    return {
      image_url: 'image_url_url',
      state: 'new',
      price: "".concat(Math.random() * 1000000000),
      manufacturer: carManufacturers["".concat(Math.floor(Math.random() * Math.floor(5)))],
      model: models["".concat(Math.floor(Math.random() * Math.floor(6)))],
      body_type: bodyt["".concat(Math.floor(Math.random() * Math.floor(5)))],
      description: "".concat(Math.random().toString(36).substr(2, 9))
    };
  };

  before(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, is_admin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16), status VARCHAR(10) NOT NULL DEFAULT \'active\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 2:
            _context3.next = 4;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT \'available\', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT, image_url VARCHAR(150), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )');

          case 4:
            _context3.next = 6;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,  car_id BIGINT NOT NULL REFERENCES cars(id) ON DELETE CASCADE, seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT \'pending\', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), price_offered NUMERIC NOT NULL CHECK(price_offered > 0), new_price_offered NUMERIC, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 6:
            _context3.next = 8;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, car_id BIGINT REFERENCES cars(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT \'pending\', severity VARCHAR(20) NOT NULL DEFAULT \'minor\') ');

          case 8:
            _context3.next = 10;
            return dataValues();

          case 10:
            data = _context3.sent;
            _context3.next = 13;
            return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(data);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  after(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _db2["default"].query('DELETE FROM flags');

          case 2:
            _context4.next = 4;
            return _db2["default"].query('DELETE FROM orders');

          case 4:
            _context4.next = 6;
            return _db2["default"].query('DELETE FROM cars');

          case 6:
            _context4.next = 8;
            return _db2["default"].query('DELETE FROM users');

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  var orderData = {
    carId: 1288392382934,
    price_offered: '6000000'
  };
  describe('Create order', function () {
    it('should return error 400 if carId or price is not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var token;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return genToken();

            case 2:
              token = _context5.sent;
              orderData.carId = '';

              _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData).end(function (err, res) {
                expect(res.status).to.eq(400);
                expect(res.body.error).to.eq('Select car and state amount you want to pay');
              });

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should return error 400 if car id is invalid',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var token;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              orderData.carId = 128839238293;
              _context6.next = 3;
              return genToken();

            case 3:
              token = _context6.sent;

              _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData).end(function (err, res) {
                expect(res.status).to.eq(400);
                expect(res.body.error).to.eq('Select car and state amount you want to pay');
              });

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
    it('should return error 401  if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).post('/api/v1/order').send(orderData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  }); // User retrieves his/her orders

  describe('User get his/her ads', function () {
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  });
});