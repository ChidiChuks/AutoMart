"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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

var loc = _path2["default"].resolve('./');

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

var adUrl = '/api/v1/car';
var signupUrl = '/api/v1/auth/signup';
describe('Cars', function () {
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

  var updateInfo = {
    status: 'new',
    price: '7500000.00',
    description: 'This is a new description'
  };

  var dataValues = function dataValues() {
    return {
      email: "".concat(Math.random().toString(36).substring(2, 15), "@yahoo.com"),
      first_name: "Fi".concat(Math.random().toString(36).substring(2, 15)),
      last_name: "La".concat(Math.random().toString(36).substring(2, 15)),
      password: 'password',
      password_confirmation: 'password',
      address: 'my address',
      phone: "".concat(Math.floor(Math.random() * 10000000000))
    };
  };

  var carManufacturers = ['Benz', 'BMW', 'Audi', 'Toyota', 'Nissan'];
  var models = ['CL550', 'GK', 'E360', '4 Runner', 'Avalon', 'Altima', 'Maxima'];
  var bodyt = ['Sedan', 'SUV', 'Station Wagon', 'TRUCK', 'BUS'];

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
            return _db2["default"].query("CREATE TABLE IF NOT EXISTS users ( id BIGINT PRIMARY KEY, email VARCHAR(30) NOT NULL UNIQUE, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(140) NOT NULL, address VARCHAR(400) NOT NULL, isAdmin BOOLEAN NOT NULL DEFAULT FALSE, phone VARCHAR(16) NOT NULL UNIQUE, account_number BIGINT NOT NULL, bank VARCHAR(20) NOT NULL, status VARCHAR(10) NOT NULL DEFAULT 'active', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");

          case 2:
            _context3.next = 4;
            return _db2["default"].query("CREATE TABLE IF NOT EXISTS cars (id BIGINT PRIMARY KEY,  owner BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), state VARCHAR(8) NOT NULL, status VARCHAR(15) NOT NULL DEFAULT 'available', price NUMERIC(10, 2) NOT NULL CHECK(price > 0), manufacturer VARCHAR(30) NOT NULL, model VARCHAR(30) NOT NULL, body_type VARCHAR(30) NOT NULL, description TEXT NOT NULL, img VARCHAR(150) NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() )");

          case 4:
            _context3.next = 6;
            return _db2["default"].query("CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, buyerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  carId BIGINT NOT NULL REFERENCES cars(id) ON DELETE RESTRICT, sellerId BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, price NUMERIC NOT NULL CHECK(price > 0), status VARCHAR(20) NOT NULL DEFAULT 'pending', date TIMESTAMPTZ NOT NULL DEFAULT NOW(), priceOffered NUMERIC NOT NULL CHECK(priceOffered > 0), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");

          case 6:
            _context3.next = 8;
            return _db2["default"].query("CREATE TABLE IF NOT EXISTS flags (id BIGINT PRIMARY KEY, carId BIGINT REFERENCES cars(id) ON DELETE RESTRICT, created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(), reason VARCHAR(20) NOT NULL, description TEXT, reportedBy BIGINT NOT NULL REFERENCES users(id), status VARCHAR(20) NOT NULL DEFAULT 'pending', severity VARCHAR(20) NOT NULL DEFAULT 'minor') ");

          case 8:
            _context3.next = 10;
            return dataValues();

          case 10:
            data = _context3.sent;
            _context3.next = 13;
            return _chai2["default"].request(_index2["default"]).post(signupUrl).send(data);

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
            return _db2["default"].query("DELETE FROM flags");

          case 2:
            _context4.next = 4;
            return _db2["default"].query("DELETE FROM orders");

          case 4:
            _context4.next = 6;
            return _db2["default"].query("DELETE FROM cars");

          case 6:
            _context4.next = 8;
            return _db2["default"].query("DELETE FROM users");

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  describe('Create Ad', function () {
    // it('should create a new ad', async () => {
    //   const data = await userId();
    //   const newAd = await newAdValues();
    //   const token = await generateToken(data.id, false);
    //   chai.request(server)
    //     .post(adUrl)
    //     .set('x-auth', token)
    //     .attach('img', path.join(loc, '/server/test/bmwx6d.jpg'))
    //     .set('Content-Type', 'Multipart/form-data')
    //     .field('id', Date.now())
    //     .field('price', 8000000)
    //     .field('owner', data.id)
    //     .field('state', newAd.state)
    //     .field('model', newAd.model)
    //     .field('manufacturer', newAd.manufacturer)
    //     .field('body_type', newAd.body_type)
    //     .field('description', newAd.description)
    //     .then((res) => {
    //       expect(res.status).to.eq(201);
    //       expect(res.body.data).to.have.property('id');
    //       expect(res.body.data.price).to.eq(8000000);
    //       expect(res.body.data.state).to.eq(newAd.state);
    //     });
    // });
    it('should return error 400 if request does not contain all required fields',
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

              _chai2["default"].request(_index2["default"]).post(adUrl).set('x-auth', token).attach('img', _path2["default"].join(loc, '/server/test/benz.jpg')).set('Content-Type', 'Multipart/form-data').field('status', 'available').field('price', '').field('state', 'new').field('model', 'E350').field('manufacturer', 'BMW').field('body_type', 'car').field('description', 'This is additional description').then(function (res) {
                expect(res.body.status).to.eq(400);
                expect(res.body.message).to.eq('Fill all required fields');
              });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should return error 400 if user has the same car that is available',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var data, newAd, token;
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
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    'img.png', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context6.next = 10;
              return (0, _generateToken2["default"])(data.id, false);

            case 10:
              token = _context6.sent;

              _chai2["default"].request(_index2["default"]).post(adUrl).set('x-auth', token).attach('img', _path2["default"].join(loc, '/server/test/benz.jpg')).set('Content-Type', 'Multipart/form-data').field('id', Date.now()).field('price', 8000000).field('owner', data.id).field('state', newAd.state).field('model', newAd.model).field('manufacturer', newAd.manufacturer).field('body_type', newAd.body_type).field('description', newAd.description).then(function (res) {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq('You have a similar unsold car');
              });

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }))); // it('should return error 400 if there is no image', async() => {
    //     const token = await genToken();
    //     const data = newAdValues();
    //     data.img = '';
    //     const res = await chai.request(server).post(adUrl).set('x-auth', token).send(data);
    //     expect(res.body.message).to.eq('Fill all required fields');
    //     expect(res.status).to.eq(400);
    // });

    it('should return error 401 if token is not provided',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var data, res;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              data = newAdValues();
              _context7.next = 3;
              return _chai2["default"].request(_index2["default"]).post(adUrl).send(data);

            case 3:
              res = _context7.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
  }); // unsold cars according to manufacturer

  describe('view available cars by manufacturer', function () {
    it('should return a message if there are no unsold cars for a selected manufacturer',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/manufacturer/FIAT');

            case 2:
              res = _context8.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('There are no cars for the selected manufacturer');

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should return a custom error if no vehicle is found for the manufacturer',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var data, newAd, res;
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
              return _chai2["default"].request(_index2["default"]).get("/api/v1/car/manufacturer/".concat(newAd.manufacturer));

            case 10:
              res = _context9.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');

            case 13:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
  }); // unsold cars by body type

  describe('view available cars by body type', function () {
    //     it('should return all unsold cars by body type', async() => {
    //         const data = await userId();
    //         const newAd = await newAdValues();
    //         await db.query(`INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    //   '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
    //         const res = await chai.request(server).get(`/api/v1/car/bodytype/${newAd.body_type}`);
    //         expect(res.status).to.eq(200);
    //         expect(res.body).to.have.property('data').to.be.an('Array');
    //     });
    it('should return error 404 if cars of given body type are not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var data, newAd, res;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return userId();

            case 2:
              data = _context10.sent;
              _context10.next = 5;
              return newAdValues();

            case 5:
              newAd = _context10.sent;
              _context10.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context10.next = 10;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/bodytype/SEMI');

            case 10:
              res = _context10.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('There are no cars for the selected body_type');

            case 13:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
  }); // view available cars by state (used, new)

  describe('view available cars by state', function () {
    it('should return all available cars by state',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var data, newAd, res;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return userId();

            case 2:
              data = _context11.sent;
              _context11.next = 5;
              return newAdValues();

            case 5:
              newAd = _context11.sent;
              _context11.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context11.next = 10;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/car/state/".concat(newAd.state));

            case 10:
              res = _context11.sent;
              expect(res.status).to.eq(200);
              expect(res.body).to.have.property('data').to.be.an('ARRAY');
              expect(res.body.data[0]).to.have.property('state').eq(newAd.state);

            case 14:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('should return error 404 if cars are not found for selected state',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var res;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/state/not');

            case 2:
              res = _context12.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('There are no cars for the selected state');

            case 5:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  }); // view all unsold cars

  describe('view all available cars', function () {//     it('should return all unsold cars', async() => {
    //         const data = await userId();
    //         const newAd = await newAdValues();
    //         await db.query(`INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    //   '${newAd.img}', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
    //         const res = await chai.request(server).get('/api/v1/cars');
    //         expect(res.status).to.eq(200);
    //         expect(res.body).to.have.property('data').to.be.an('ARRAY');
    //     });
    // it('should return 404 when there are no unsold cars', async() => {
    //     await db.query('UPDATE cars SET status=\'sold\'');
    //     const res = await chai.request(server).get('/api/v1/cars');
    //     expect(res.status).to.eq(404);
    //     expect(res.body.message).to.eq('There are no cars available now. Check back');
    // });
  }); // get ad by id

  describe('Get ad by id', function () {
    it('should return a single ad details',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var data, newAd, _ref15, rows, id, res;

      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return userId();

            case 2:
              data = _context13.sent;
              _context13.next = 5;
              return newAdValues();

            case 5:
              newAd = _context13.sent;
              _context13.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context13.next = 10;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 10:
              _ref15 = _context13.sent;
              rows = _ref15.rows;
              id = rows[0].id;
              _context13.next = 15;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/car/".concat(id));

            case 15:
              res = _context13.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 18:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('should return error 400 with custom message if supplied id is not valid',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/12345678901');

            case 2:
              res = _context14.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Invalid ad id');

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
    it('should return error 404 with custom message if ad is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var res;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/9293837414384');

            case 2:
              res = _context15.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The ad you are looking for is no longer available');

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
  }); // seller update ad price

  describe('Seller update ad price, status and description', function () {
    it('should return the ad with updated price',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var data, newAd, _ref19, rows, id, token, res;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return userId();

            case 2:
              data = _context16.sent;
              _context16.next = 5;
              return newAdValues();

            case 5:
              newAd = _context16.sent;
              _context16.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context16.next = 10;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 10:
              _ref19 = _context16.sent;
              rows = _ref19.rows;
              id = rows[0].id;
              _context16.next = 15;
              return genToken();

            case 15:
              token = _context16.sent;
              _context16.next = 18;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(id)).set('x-auth', token).send(updateInfo);

            case 18:
              res = _context16.sent;
              expect(res.body.data.price).to.eq(updateInfo.price);
              expect(res.status).to.eq(200);
              expect(res.body.data.description).to.eq(updateInfo.description);

            case 22:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return error 404 if ad is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var data, newAd, token, res;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return userId();

            case 2:
              data = _context17.sent;
              _context17.next = 5;
              return newAdValues();

            case 5:
              newAd = _context17.sent;
              _context17.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context17.next = 10;
              return genToken();

            case 10:
              token = _context17.sent;
              _context17.next = 13;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(Date.now())).set('x-auth', token).send(updateInfo);

            case 13:
              res = _context17.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The advert you want to update is not available');

            case 16:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
    it('should return error 401 if it is not the ad owner',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var data, newAd, _ref22, rows, id, newUser, usersObj, userid, token, res;

      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return userId();

            case 2:
              data = _context18.sent;
              _context18.next = 5;
              return newAdValues();

            case 5:
              newAd = _context18.sent;
              _context18.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context18.next = 10;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 10:
              _ref22 = _context18.sent;
              rows = _ref22.rows;
              id = rows[0].id;
              _context18.next = 15;
              return dataValues();

            case 15:
              newUser = _context18.sent;
              _context18.next = 18;
              return _chai2["default"].request(_index2["default"]).post(signupUrl).send(newUser);

            case 18:
              _context18.next = 20;
              return _db2["default"].query('SELECT id FROM users LIMIT 2');

            case 20:
              usersObj = _context18.sent;
              userid = usersObj.rows[1].id;
              _context18.next = 24;
              return (0, _generateToken2["default"])(userid, false);

            case 24:
              token = _context18.sent;
              _context18.next = 27;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(id)).set('x-auth', token).send(updateInfo);

            case 27:
              res = _context18.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You do not have the permission to update this data');

            case 30:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })));
    it('should return error 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var data, newAd, _ref24, rows, id, res;

      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return userId();

            case 2:
              data = _context19.sent;
              _context19.next = 5;
              return newAdValues();

            case 5:
              newAd = _context19.sent;
              _context19.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context19.next = 10;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 10:
              _ref24 = _context19.sent;
              rows = _ref24.rows;
              id = rows[0].id;
              _context19.next = 15;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(id)).send(updateInfo);

            case 15:
              res = _context19.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 18:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })));
  }); // get single ad

  describe('User can view single ad', function () {
    it('should return full details of an ad',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var data, newAd, _ref26, rows, id, res;

      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return userId();

            case 2:
              data = _context20.sent;
              _context20.next = 5;
              return newAdValues();

            case 5:
              newAd = _context20.sent;
              _context20.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context20.next = 10;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 10:
              _ref26 = _context20.sent;
              rows = _ref26.rows;
              id = rows[0].id;
              _context20.next = 15;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/car/".concat(id));

            case 15:
              res = _context20.sent;
              expect(res.status).to.eq(200);
              expect(res.body).to.have.property('data');
              expect(res.body.data.id).to.eq(id);

            case 19:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, this);
    })));
    it('should return error 404 if ad is not found',
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
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/1212121212223');

            case 2:
              res = _context21.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The ad you are looking for is no longer available');

            case 5:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, this);
    })));
    it('should return error 400 if invalid ad id is supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee22() {
      var res;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/155873165645');

            case 2:
              res = _context22.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Invalid ad id');

            case 5:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, this);
    })));
  }); // get ads within a price range

  describe('Get ads within a price range', function () {
    it('should return an array of ads within a price range',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee23() {
      var data, newAd, res;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return userId();

            case 2:
              data = _context23.sent;
              _context23.next = 5;
              return newAdValues();

            case 5:
              newAd = _context23.sent;
              _context23.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context23.next = 10;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=5000000&max=8000000');

            case 10:
              res = _context23.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('ARRAY');

            case 13:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this);
    })));
    it('Minimum should default to 0 if not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee24() {
      var data, newAd, res;
      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return userId();

            case 2:
              data = _context24.sent;
              _context24.next = 5;
              return newAdValues();

            case 5:
              newAd = _context24.sent;
              _context24.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context24.next = 10;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?max=8000000');

            case 10:
              res = _context24.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('ARRAY');

            case 13:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, this);
    })));
    it('Maximum should default to 30000000 if not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee25() {
      var data, newAd, res;
      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return userId();

            case 2:
              data = _context25.sent;
              _context25.next = 5;
              return newAdValues();

            case 5:
              newAd = _context25.sent;
              _context25.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context25.next = 10;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=2000000');

            case 10:
              res = _context25.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('ARRAY');

            case 13:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, this);
    })));
    it('Should return error 404 if no ads are found in the given range',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee26() {
      var res;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=12000000&max=24000000');

            case 2:
              res = _context26.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('There are no cars within the selected range');

            case 5:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26, this);
    })));
  }); // admin can view all ads whether sold or available

  describe('admin view all ads', function () {
    it('should return all ads',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee27() {
      var data, newAd, token, res;
      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return userId();

            case 2:
              data = _context27.sent;
              _context27.next = 5;
              return newAdValues();

            case 5:
              newAd = _context27.sent;
              _context27.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              token = (0, _generateToken2["default"])(data.id, true);
              _context27.next = 11;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car').set('x-auth', token);

            case 11:
              res = _context27.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');
              expect(res.body.data[0]).to.be.an('Object');

            case 15:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27, this);
    })));
    it('should return error 404 if there are no ads available',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee28() {
      var data, token, res;
      return regeneratorRuntime.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return userId();

            case 2:
              data = _context28.sent;
              _context28.next = 5;
              return _db2["default"].query('DELETE FROM flags');

            case 5:
              _context28.next = 7;
              return _db2["default"].query('DELETE FROM orders');

            case 7:
              _context28.next = 9;
              return _db2["default"].query('DELETE FROM cars');

            case 9:
              token = (0, _generateToken2["default"])(data.id, true);
              _context28.next = 12;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car').set('x-auth', token);

            case 12:
              res = _context28.sent;
              expect(res.body.status).to.eq(404);
              expect(res.body.message).to.eq('There are no cars available now. Check back');

            case 15:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28, this);
    })));
    it('should return error 401 if user is not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee29() {
      var res;
      return regeneratorRuntime.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/car');

            case 2:
              res = _context29.sent;
              expect(res.body.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 5:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee29, this);
    })));
  }); // admin can delete any posted ad

  describe('Admin can delete a posted ad', function () {
    it('should delete a posted ad',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee30() {
      var user, newAd, _ref37, rows, token, res;

      return regeneratorRuntime.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return userId();

            case 2:
              user = _context30.sent;
              _context30.next = 5;
              return newAdValues();

            case 5:
              newAd = _context30.sent;
              _context30.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n      '").concat(newAd.img, "', ").concat(user.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context30.next = 10;
              return _db2["default"].query('SELECT id FROM cars LIMIT 1');

            case 10:
              _ref37 = _context30.sent;
              rows = _ref37.rows;
              token = (0, _generateToken2["default"])(user.id, true);
              _context30.next = 15;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(rows[0].id)).set('x-auth', token);

            case 15:
              res = _context30.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(rows[0].id);

            case 18:
            case "end":
              return _context30.stop();
          }
        }
      }, _callee30, this);
    })));
    it('should return error 401 if user is not admin or not logged in',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee31() {
      var data, newAd, _ref39, rows, res;

      return regeneratorRuntime.wrap(function _callee31$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return userId();

            case 2:
              data = _context31.sent;
              _context31.next = 5;
              return newAdValues();

            case 5:
              newAd = _context31.sent;
              _context31.next = 8;
              return _db2["default"].query("INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    '").concat(newAd.img, "', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 8:
              _context31.next = 10;
              return _db2["default"].query('SELECT id FROM cars LIMIT 1');

            case 10:
              _ref39 = _context31.sent;
              rows = _ref39.rows;
              _context31.next = 14;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(rows[0].id));

            case 14:
              res = _context31.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('No authorization token provided');

            case 17:
            case "end":
              return _context31.stop();
          }
        }
      }, _callee31, this);
    })));
    it('should return error 400 if wrong ad id is given',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee32() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee32$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return userId();

            case 2:
              user = _context32.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context32.next = 6;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/car/123456789012').set('x-auth', token);

            case 6:
              res = _context32.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Select the ad to delete');

            case 9:
            case "end":
              return _context32.stop();
          }
        }
      }, _callee32, this);
    })));
    it('should return error 404 if ad is not available',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee33() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee33$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return userId();

            case 2:
              user = _context33.sent;
              token = (0, _generateToken2["default"])(user.id, true);
              _context33.next = 6;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/car/1783782738238').set('x-auth', token);

            case 6:
              res = _context33.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('Selected ad not available');

            case 9:
            case "end":
              return _context33.stop();
          }
        }
      }, _callee33, this);
    })));
  });
});