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

_chai2["default"].use(_chaiHttp2["default"]);

describe('Flags controller', function () {
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
      email: "".concat(Math.random().toString(36).substring(2, 15), "@yahoo.com"),
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

  var carManufacturers = ['BMW', 'Audi', 'Mercedes', 'Toyota', 'Nissan'];
  var models = ['CL550', 'GK', 'E360', '4 Runner', 'Avalon', 'Altima', 'Maxima'];
  var bodyt = ['Sedan', 'Station Wagon', 'SUV', 'TRUCK', 'BUS'];

  var newAdValues = function newAdValues() {
    return {
      img: 'img_url',
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
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, isAdmin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16) NOT NULL UNIQUE, account_number BIGINT NOT NULL, bank VARCHAR(20) NOT NULL, status VARCHAR(10) NOT NULL DEFAULT \'active\', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 2:
            _context3.next = 4;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT \'available\', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT NOT NULL, img VARCHAR(150) NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )');

          case 4:
            _context3.next = 6;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  carId BIGINT NOT NULL REFERENCES cars(id) ON DELETE RESTRICT, sellerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT \'pending\', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), priceOffered NUMERIC NOT NULL CHECK(priceOffered > 0), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');

          case 6:
            _context3.next = 8;
            return _db2["default"].query('CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, carId BIGINT REFERENCES cars(id) ON DELETE RESTRICT, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT \'pending\', severity VARCHAR(20) NOT NULL DEFAULT \'minor\') ');

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
  describe('Create a flag', function () {
    it('should create a flag on an ad',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var data, newAd, _ref7, rows, carId, token, newFlag, res;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return userId();

            case 2:
              data = _context5.sent;
              _context5.next = 5;
              return newAdValues();

            case 5:
              newAd = _context5.sent;
              _context5.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context5.next = 10;
              return _db2["default"].query('SELECT id FROM cars');

            case 10:
              _ref7 = _context5.sent;
              rows = _ref7.rows;
              carId = rows[rows.length - 1].id;
              _context5.next = 15;
              return genToken();

            case 15:
              token = _context5.sent;
              newFlag = {
                carId: carId,
                reason: 'suspicious',
                description: 'This is the description of the suspicious report'
              };
              _context5.next = 19;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 19:
              res = _context5.sent;
              expect(res.status).to.eq(201);
              expect(res.body.data).to.have.property('id');
              expect(res.body.data).to.have.property('carid').eq(newFlag.carId);
              expect(res.body.data.reason).to.eq(newFlag.reason);

            case 24:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should return error 400 if reason is not stated',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var data, newAd, _ref9, rows, carId, token, newFlag, res;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return userId();

            case 2:
              data = _context6.sent;
              _context6.next = 5;
              return newAdValues();

            case 5:
              newAd = _context6.sent;
              _context6.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context6.next = 10;
              return _db2["default"].query('SELECT id FROM cars');

            case 10:
              _ref9 = _context6.sent;
              rows = _ref9.rows;
              carId = rows[rows.length - 1].id;
              _context6.next = 15;
              return genToken();

            case 15:
              token = _context6.sent;
              newFlag = {
                carId: carId,
                reason: '',
                description: 'This is the description of the suspicious report'
              };
              _context6.next = 19;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 19:
              res = _context6.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Ensure to indicate the ad id and reason for the report');

            case 22:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
    it('should return error 400 if ad id is not stateds',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var token, newFlag, res;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return genToken();

            case 2:
              token = _context7.sent;
              newFlag = {
                carId: '',
                reason: 'suspicious',
                description: 'This is the description of the suspicious report'
              };
              _context7.next = 6;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 6:
              res = _context7.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Ensure to indicate the ad id and reason for the report');

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('should return error 406 if users report has already been received',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var data, newAd, _ref12, rows, carId, token, newFlag, res;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return userId();

            case 2:
              data = _context8.sent;
              _context8.next = 5;
              return newAdValues();

            case 5:
              newAd = _context8.sent;
              _context8.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context8.next = 10;
              return _db2["default"].query('SELECT id FROM cars');

            case 10:
              _ref12 = _context8.sent;
              rows = _ref12.rows;
              carId = rows[rows.length - 1].id;
              _context8.next = 15;
              return genToken();

            case 15:
              token = _context8.sent;
              newFlag = {
                carId: carId,
                reason: 'fake',
                description: 'This is the description of the suspicious report'
              };
              _context8.next = 19;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 19:
              _context8.next = 21;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 21:
              res = _context8.sent;
              expect(res.status).to.eq(406);
              expect(res.body.message).to.eq('Your report on this ad is already recorded');

            case 24:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should create an extreme flag if car is flag as stolen or fake or suspicious',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var data, newAd, _ref14, rows, carId, token, newFlag, res;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return userId();

            case 2:
              data = _context9.sent;
              _context9.next = 5;
              return newAdValues();

            case 5:
              newAd = _context9.sent;
              _context9.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context9.next = 10;
              return _db2["default"].query('SELECT id FROM cars');

            case 10:
              _ref14 = _context9.sent;
              rows = _ref14.rows;
              carId = rows[rows.length - 1].id;
              _context9.next = 15;
              return genToken();

            case 15:
              token = _context9.sent;
              newFlag = {
                carId: carId,
                reason: 'fake',
                description: 'This is the description of the suspicious report'
              };
              _context9.next = 19;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(newFlag);

            case 19:
              res = _context9.sent;
              expect(res.status).to.eq(201);
              expect(res.body.data.severity).to.eq('extreme');

            case 22:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
  });
  describe('Update a flag', function () {
    it('should update a flag status to resolved',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var _ref16, rows, flagid, user, token, res;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _db2["default"].query('SELECT id FROM flags WHERE status=\'pending\'');

            case 2:
              _ref16 = _context10.sent;
              rows = _ref16.rows;
              flagid = rows[rows.length - 1].id;
              _context10.next = 7;
              return userId();

            case 7:
              user = _context10.sent;
              _context10.next = 10;
              return (0, _generateToken2["default"])(user.id, true);

            case 10:
              token = _context10.sent;
              _context10.next = 13;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(flagid)).set('x-auth', token);

            case 13:
              res = _context10.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(flagid);
              expect(res.body.data.status).to.eq('resolved');

            case 17:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
    it('should return error 401 if admin is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var _ref18, rows, flagid, res;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return _db2["default"].query('SELECT id FROM flags WHERE status=\'pending\'');

            case 2:
              _ref18 = _context11.sent;
              rows = _ref18.rows;
              flagid = rows[rows.length - 1].id;
              _context11.next = 7;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(flagid));

            case 7:
              res = _context11.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 10:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('should return error 401 if logged in user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var _ref20, rows, id, user, token, res;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return _db2["default"].query('SELECT id FROM flags WHERE status=\'pending\'');

            case 2:
              _ref20 = _context12.sent;
              rows = _ref20.rows;
              id = rows[rows.length - 1].id;
              _context12.next = 7;
              return userId();

            case 7:
              user = _context12.sent;
              token = (0, _generateToken2["default"])(user.id, false);
              _context12.next = 11;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(id)).set('x-auth', token);

            case 11:
              res = _context12.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You dont have the permission to access this resource');

            case 14:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
    it('should return error 404 if flag id is wrong',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return userId();

            case 2:
              user = _context13.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context13.next = 6;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/flag/1261727827383').set('x-auth', token);

            case 6:
              res = _context13.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('Flag already updated or not available');

            case 9:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('should return error 400 if flag id is wrong',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return userId();

            case 2:
              user = _context14.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context14.next = 6;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/flag/126172782738').set('x-auth', token);

            case 6:
              res = _context14.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Invalid flag id');

            case 9:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
  });
  describe('Get all flags', function () {
    it('should return all flags',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return userId();

            case 2:
              user = _context15.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context15.next = 6;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/flags').set('x-auth', token);

            case 6:
              res = _context15.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');
              expect(res.body.data[0]).to.be.an('Object');

            case 10:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('should return error 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var res;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/flags');

            case 2:
              res = _context16.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 5:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return error 401 if user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return userId();

            case 2:
              user = _context17.sent;
              token = (0, _generateToken2["default"])(user.id, false);
              _context17.next = 6;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/flags').set('x-auth', token);

            case 6:
              res = _context17.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You dont have the permission to access this resource');

            case 9:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
  });
  describe('Admin can delete a given flag', function () {
    it('should delete a given flag id',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var _ref27, rows, id, user, token, res;

      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _db2["default"].query('SELECT id FROM flags LIMIT 1');

            case 2:
              _ref27 = _context18.sent;
              rows = _ref27.rows;
              id = rows[rows.length - 1].id;
              _context18.next = 7;
              return userId();

            case 7:
              user = _context18.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context18.next = 11;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/flags/".concat(id)).set('x-auth', token);

            case 11:
              res = _context18.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 14:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })));
    it('should return error 400 if flag id is wrong',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return userId();

            case 2:
              user = _context19.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context19.next = 6;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/flags/126172782738').set('x-auth', token);

            case 6:
              res = _context19.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Invalid flag id');

            case 9:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })));
  });
  it('should return error 404 if flag is not found',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee20() {
    var user, token, res;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return userId();

          case 2:
            user = _context20.sent;
            token = (0, _generateToken2["default"])(user.id, true);
            _context20.next = 6;
            return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/flags/1271278338293').set('x-auth', token);

          case 6:
            res = _context20.sent;
            expect(res.status).to.eq(404);
            expect(res.body.message).to.eq('Flag not found');

          case 9:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, this);
  })));
});