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
    it('should create an order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var data, newUser, newAd, _ref7, rows, user, token, res;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return userId();

            case 2:
              data = _context5.sent;
              _context5.next = 5;
              return dataValues();

            case 5:
              newUser = _context5.sent;
              _context5.next = 8;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 8:
              _context5.next = 10;
              return newAdValues();

            case 10:
              newAd = _context5.sent;
              _context5.next = 13;
              return _db2["default"].query("INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('".concat(Date.now(), "', 8000000, '").concat(newAd.description, "',\n    'image_url.png', ").concat(data.id, ", '").concat(newAd.state, "', '").concat(newAd.manufacturer, "', '").concat(newAd.model, "', '").concat(newAd.body_type, "')"));

            case 13:
              _context5.next = 15;
              return _db2["default"].query('SELECT id FROM cars limit 1');

            case 15:
              _ref7 = _context5.sent;
              rows = _ref7.rows;
              _context5.next = 19;
              return _db2["default"].query('SELECT id FROM users LIMIT 1');

            case 19:
              user = _context5.sent;
              _context5.next = 22;
              return (0, _generateToken2["default"])(user.rows[0].id, false);

            case 22:
              token = _context5.sent;
              orderData.car_id = rows[0].id;
              _context5.next = 26;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData);

            case 26:
              res = _context5.sent;
              expect(res.status).to.eq(201);
              expect(res.body.data).to.have.property('id');
              expect(res.body.data).to.have.property('car_id').eq(orderData.car_id);
              expect(res.body.data.seller_id).to.eq(data.id);

            case 31:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    })));
    it('should return error 400 if carId or price is not supplied',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var token;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return genToken();

            case 2:
              token = _context6.sent;
              orderData.carId = '';

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
    it('should return error 400 if car id is invalid',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var token;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              orderData.carId = 128839238293;
              _context7.next = 3;
              return genToken();

            case 3:
              token = _context7.sent;

              _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData).end(function (err, res) {
                expect(res.status).to.eq(400);
                expect(res.body.error).to.eq('Select car and state amount you want to pay');
              });

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('should return error 400 if car is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return genToken();

            case 2:
              token = _context8.sent;
              orderData.car_id = 1288392382934;
              _context8.next = 6;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData);

            case 6:
              res = _context8.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('The car is not available or the seller is not active. Check back');

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should return error 401  if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).post('/api/v1/order').send(orderData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  }); // seller update order price

  describe('Buyer update order price while order it is not pending or cancelled', function () {
    it('should update the order price ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var newUser, orderInfo, id, buyer_id, token, newData, res;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return dataValues();

            case 2:
              newUser = _context9.sent;
              _context9.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context9.next = 7;
              return _db2["default"].query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context9.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context9.next = 12;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 12:
              _context9.next = 14;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 14:
              token = _context9.sent;
              newData = {
                orderId: id,
                newPrice: 7100000
              };
              _context9.next = 18;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 18:
              res = _context9.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.buyer_id).to.eq(buyer_id);
              expect(parseFloat(res.body.data.price_offered)).to.eq(newData.newPrice);

            case 23:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
    it('should return error 400 if newprice is not stated ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var newUser, orderInfo, id, buyer_id, token, newData, res;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return dataValues();

            case 2:
              newUser = _context10.sent;
              _context10.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context10.next = 7;
              return _db2["default"].query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context10.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context10.next = 12;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 12:
              _context10.next = 14;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 14:
              token = _context10.sent;
              newData = {
                orderId: id,
                newPrice: ''
              };
              _context10.next = 18;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 18:
              res = _context10.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Ensure to send the order id and new price');

            case 21:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
    it('should return error 400 if order id is not supplied ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var newUser, orderInfo, id, buyer_id, token, newData, res;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return dataValues();

            case 2:
              newUser = _context11.sent;
              _context11.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context11.next = 7;
              return _db2["default"].query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context11.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context11.next = 12;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 12:
              _context11.next = 14;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 14:
              token = _context11.sent;
              newData = {
                orderId: '',
                newPrice: 7100000
              };
              _context11.next = 18;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 18:
              res = _context11.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Ensure to send the order id and new price');

            case 21:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })));
    it('should return error 400 if order status is pending or cancelled',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var newUser, orderInfo, id, buyer_id, token, newData, res;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return dataValues();

            case 2:
              newUser = _context12.sent;
              _context12.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context12.next = 7;
              return _db2["default"].query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context12.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context12.next = 12;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 12:
              _context12.next = 14;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 14:
              token = _context12.sent;
              newData = {
                orderId: id,
                newPrice: 7100000
              };
              _context12.next = 18;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 18:
              res = _context12.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('Check that the order id is valid and not cancelled and your new price is different');

            case 21:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  }); // User retrieves his/her orders

  describe('User get his/her ads', function () {
    it('should return an array of the users ads',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var newUser, orderInfo, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return dataValues();

            case 2:
              newUser = _context13.sent;
              _context13.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context13.next = 7;
              return _db2["default"].query('SELECT seller_id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context13.sent;
              seller_id = orderInfo.rows[0].seller_id;
              _context13.next = 11;
              return (0, _generateToken2["default"])(seller_id, false);

            case 11:
              token = _context13.sent;
              _context13.next = 14;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token);

            case 14:
              res = _context13.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');
              expect(res.body.data[0]).to.have.property('seller_id').eq(seller_id);

            case 18:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  }); // view all orders

  describe('View all orders', function () {
    it('should return all orders placed',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var newUser, _ref17, rows, length, token, res;

      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return dataValues();

            case 2:
              newUser = _context14.sent;
              _context14.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context14.next = 7;
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref17 = _context14.sent;
              rows = _ref17.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, true);
              _context14.next = 13;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 13:
              res = _context14.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');

            case 16:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    }))); // it('should return error 404 if there are no orders', async () => {
    //   const newUser = await dataValues();
    //   await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //   const { rows } = await db.query('SELECT id FROM users ');
    //   const { length } = rows;
    //   const token = generateToken(rows[length - 1].id, true);
    //   const res = await chai.request(server).get('/api/v1/orders').set('x-auth', token);
    //   expect(res.body.status).to.eq(404);
    //   expect(res.body.error).to.eq('There are no orders now. Check back');
    // });

    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').end(function (err, res) {
        expect(res.body.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 401 if user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var newUser, _ref19, rows, length, token, res;

      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return dataValues();

            case 2:
              newUser = _context15.sent;
              _context15.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context15.next = 7;
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref19 = _context15.sent;
              rows = _ref19.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, false);
              _context15.next = 13;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 13:
              res = _context15.sent;
              expect(res.status).to.eq(401);
              expect(res.body.error).to.eq('You dont have the permission to access this resource');

            case 16:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
  }); // view a single order

  describe('View a single order', function () {
    it('should return order if it is admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var newUser, _ref21, rows, length, token, orderInfo, id, res;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return dataValues();

            case 2:
              newUser = _context16.sent;
              _context16.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context16.next = 7;
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref21 = _context16.sent;
              rows = _ref21.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, true);
              _context16.next = 13;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 13:
              orderInfo = _context16.sent;
              id = orderInfo.rows[0].id;
              _context16.next = 17;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 17:
              res = _context16.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 20:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return order if it is the seller',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var orderInfo, id, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return _db2["default"].query('SELECT id, seller_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context17.sent;
              id = orderInfo.rows[0].id;
              seller_id = orderInfo.rows[0].seller_id;
              _context17.next = 7;
              return (0, _generateToken2["default"])(seller_id, false);

            case 7:
              token = _context17.sent;
              _context17.next = 10;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 10:
              res = _context17.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 13:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
    it('should return order if it is the buyer',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var orderInfo, id, buyer_id, token, res;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _db2["default"].query('SELECT id, buyer_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context18.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context18.next = 7;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 7:
              token = _context18.sent;
              _context18.next = 10;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 10:
              res = _context18.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 13:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    }))); // it('should return error 404 if order is not found', async () => {
    //   const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
    //   const { buyer_id } = orderInfo.rows[0];
    //   const token = await generateToken(buyer_id, false);
    // eslint-disable-next-line max-len
    // const res = await chai.request(server).get('/api/v1/orders/1212727172172').set('x-auth', token);
    //   expect(res.status).to.eq(404);
    //   expect(res.body.error).to.eq('Order not found');
    // });

    it('should return error 403 if it is not buyer or seller or admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var newUser, orderInfo, id, _ref25, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return dataValues();

            case 2:
              newUser = _context19.sent;
              _context19.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context19.next = 7;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context19.sent;
              id = orderInfo.rows[0].id;
              _context19.next = 11;
              return _db2["default"].query('SELECT id from users');

            case 11:
              _ref25 = _context19.sent;
              rows = _ref25.rows;
              len = rows.length - 1;
              _context19.next = 16;
              return (0, _generateToken2["default"])(rows[len].id, false);

            case 16:
              token = _context19.sent;
              _context19.next = 19;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 19:
              res = _context19.sent;
              expect(res.status).to.eq(403);
              expect(res.body.error).to.eq('You dont have the permission to view this resource');

            case 22:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })));
  }); // update order status

  describe('Seller and Buyer update order status', function () {
    it('should update order status by seller when it is pending',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var newUser, orderInfo, id, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return dataValues();

            case 2:
              newUser = _context20.sent;
              _context20.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context20.next = 7;
              return _db2["default"].query('SELECT id, seller_id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context20.sent;
              id = orderInfo.rows[0].id;
              _context20.next = 11;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 11:
              seller_id = orderInfo.rows[0].seller_id;
              _context20.next = 14;
              return (0, _generateToken2["default"])(seller_id, false);

            case 14:
              token = _context20.sent;
              _context20.next = 17;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'accepted'
              });

            case 17:
              res = _context20.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.status).to.eq('accepted');

            case 21:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, this);
    })));
    it('should update order status by buyer if the status is accepted',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee21() {
      var newUser, orderInfo, id, buyer_id, token, res;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return dataValues();

            case 2:
              newUser = _context21.sent;
              _context21.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context21.next = 7;
              return _db2["default"].query('SELECT id, buyer_id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context21.sent;
              id = orderInfo.rows[0].id;
              _context21.next = 11;
              return _db2["default"].query("UPDATE orders SET status='accepted' WHERE id=".concat(id));

            case 11:
              buyer_id = orderInfo.rows[0].buyer_id;
              _context21.next = 14;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 14:
              token = _context21.sent;
              _context21.next = 17;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 17:
              res = _context21.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.status).to.eq('completed');

            case 21:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, this);
    })));
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee22() {
      var orderInfo, id, buyer_id, token, res;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return _db2["default"].query('SELECT id, buyer_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context22.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              _context22.next = 7;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 7:
              token = _context22.sent;
              _context22.next = 10;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id + 1)).set('x-auth', token).send({
                status: 'completed'
              });

            case 10:
              res = _context22.sent;
              expect(res.status).to.eq(404);
              expect(res.body.error).to.eq('The order is not available');

            case 13:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, this);
    })));
    it('should return error 406 if seller or buyer is inactive',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee23() {
      var newUser, orderInfo, id, buyer_id, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return dataValues();

            case 2:
              newUser = _context23.sent;
              _context23.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context23.next = 7;
              return _db2["default"].query('SELECT id, buyer_id, seller_id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context23.sent;
              id = orderInfo.rows[0].id;
              buyer_id = orderInfo.rows[0].buyer_id;
              seller_id = orderInfo.rows[0].seller_id;
              _context23.next = 13;
              return _db2["default"].query("UPDATE users SET status='suspended' WHERE id=".concat(seller_id));

            case 13:
              _context23.next = 15;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 15:
              token = _context23.sent;
              _context23.next = 18;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 18:
              res = _context23.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('You cannot update the status of this order at its state');

            case 21:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this);
    })));
    it('should return error 403 if another user/admin attempts to update the order status',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee24() {
      var newUser, orderInfo, id, _ref31, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return dataValues();

            case 2:
              newUser = _context24.sent;
              _context24.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context24.next = 7;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context24.sent;
              id = orderInfo.rows[0].id;
              _context24.next = 11;
              return _db2["default"].query('SELECT id FROM users');

            case 11:
              _ref31 = _context24.sent;
              rows = _ref31.rows;
              len = rows.length - 1;
              _context24.next = 16;
              return (0, _generateToken2["default"])(len, true);

            case 16:
              token = _context24.sent;
              _context24.next = 19;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 19:
              res = _context24.sent;
              expect(res.status).to.eq(403);
              expect(res.body.error).to.eq('You dont have the permission to modify this resource');

            case 22:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, this);
    })));
    it('should return error 400 if buyer wants to update a pending order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee25() {
      var orderInfo, id, buyer_id, token, res;
      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return _db2["default"].query('SELECT id, buyer_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context25.sent;
              id = orderInfo.rows[0].id;
              _context25.next = 6;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 6:
              buyer_id = orderInfo.rows[0].buyer_id;
              _context25.next = 9;
              return (0, _generateToken2["default"])(buyer_id, false);

            case 9:
              token = _context25.sent;
              _context25.next = 12;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 12:
              res = _context25.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('You cannot update the status of this order at its state');

            case 15:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, this);
    })));
    it('should return error 400 if seller wants to update a cancelled order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee26() {
      var orderInfo, id, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return _db2["default"].query('SELECT id, seller_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context26.sent;
              id = orderInfo.rows[0].id;
              _context26.next = 6;
              return _db2["default"].query("UPDATE orders SET status='cancelled' WHERE id=".concat(id));

            case 6:
              seller_id = orderInfo.rows[0].seller_id;
              _context26.next = 9;
              return (0, _generateToken2["default"])(seller_id, false);

            case 9:
              token = _context26.sent;
              _context26.next = 12;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'accepted'
              });

            case 12:
              res = _context26.sent;
              expect(res.status).to.eq(400);
              expect(res.body.error).to.eq('You cannot update the status of this order at its state');

            case 15:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26, this);
    })));
  }); // delete an order -  seller and admin can delete a cancelled order

  describe('deletes a cancelled order', function () {
    it('should return error 404 if seller attempts to delete an uncancelled order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee27() {
      var orderInfo, id, seller_id, token, res;
      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return _db2["default"].query('SELECT id, seller_id FROM orders LIMIT 1');

            case 2:
              orderInfo = _context27.sent;
              id = orderInfo.rows[0].id;
              _context27.next = 6;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 6:
              seller_id = orderInfo.rows[0].seller_id;
              _context27.next = 9;
              return (0, _generateToken2["default"])(seller_id, false);

            case 9:
              token = _context27.sent;
              _context27.next = 12;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 12:
              res = _context27.sent;
              expect(res.status).to.eq(404);
              expect(res.body.error).to.eq('The order does not exist');

            case 15:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27, this);
    })));
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee28() {
      var _ref36, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return _db2["default"].query('SELECT id from users');

            case 2:
              _ref36 = _context28.sent;
              rows = _ref36.rows;
              len = rows.length - 1;
              _context28.next = 7;
              return (0, _generateToken2["default"])(rows[len].id, true);

            case 7:
              token = _context28.sent;
              _context28.next = 10;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/orders/1678787878781').set('x-auth', token);

            case 10:
              res = _context28.sent;
              expect(res.status).to.eq(404);
              expect(res.body.error).to.eq('The order does not exist');

            case 13:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28, this);
    }))); // it('should return error 404 if a logged in user attempts to delete the order', async () => {
    //   const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
    //   const { id } = orderInfo.rows[0];
    //   const { rows } = await db.query('SELECT id from users');
    //   const len = rows.length - 1;
    //   const token = await generateToken(rows[len].id, true);
    //   const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', token);
    //   expect(res.status).to.eq(404);
    //   expect(res.body.error).to.eq('You dont have permission to delete this resource');
    // });
    // it('seller should delete an order that is cancelled', async () => {
    //   const token = genToken();
    //   const cars = await db.query('SELECT id FROM cars');
    //   const newOrderData = {
    //     carId: cars.rows[0].id,
    //     price_offered: 45000000,
    //   };
    //   await chai.request(server).post('/api/v1/order').set('x-auth', token).send(newOrderData);
    //   const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
    //   const { id } = orderInfo.rows[0];
    //   await db.query(`UPDATE orders SET status='cancelled' WHERE id=${id}`);
    //   const { seller_id } = orderInfo.rows[0];
    //   const tk = await generateToken(seller_id, false);
    //   const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', tk);
    //   expect(res.status).to.eq(200);
    //   expect(res.body.data.id).to.eq(id);
    // });

    it('admin should delete any order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee29() {
      var token, cars, newOrderData, orderInfo, id, _ref38, rows, tk, res;

      return regeneratorRuntime.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              token = genToken();
              _context29.next = 3;
              return _db2["default"].query('SELECT id FROM cars');

            case 3:
              cars = _context29.sent;
              newOrderData = {
                carId: cars.rows[0].id,
                price_offered: 45000000
              };
              _context29.next = 7;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(newOrderData);

            case 7:
              _context29.next = 9;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 9:
              orderInfo = _context29.sent;
              id = orderInfo.rows[0].id;
              _context29.next = 13;
              return _db2["default"].query('SELECT id FROM users LIMIT 1');

            case 13:
              _ref38 = _context29.sent;
              rows = _ref38.rows;
              tk = (0, _generateToken2["default"])(rows[0].id, true);
              _context29.next = 18;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', tk);

            case 18:
              res = _context29.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 21:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee29, this);
    })));
  }); // describe('User retrieves his/her ads', () => {
  //   it('should return error 404 if user has not sold on the platform', async () => {
  //     const newUser = await dataValues();
  //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     const { rows } = await db.query('SELECT id FROM users LIMIT 2');
  //     const token = await generateToken(rows[0].id, false);
  //     await db.query('DELETE FROM orders');
  //     const res = await chai.request(server).get('/api/v1/orders/me').set('x-auth', token);
  //     expect(res.status).to.eq(404);
  //     expect(res.body.error).to.eq('You do not have any transaction yet');
  //   });
  // });
});