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
              return _db2["default"].query("INSERT INTO users (id, email, first_name, last_name, password, address, isadmin, phone ) VALUES ('".concat(Date.now(), "', '").concat(Math.random().toString(36).substring(2, 15), "@yahoo.com', 'chukwu', 'chi', 'password', 'addreess', false, '").concat(Date.now(), "')"));

            case 2:
              _context.next = 4;
              return _db2["default"].query('SELECT id FROM users LIMIT 1');

            case 4:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              return _context.abrupt("return", rows[0]);

            case 7:
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
      phone: "".concat(Math.floor(Math.random() * 10000000000))
    };
  };

  var carManufacturers = ['Benz', 'BMW', 'Audi', 'Toyota', 'Nissan'];
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
  var orderData = {
    carId: 1288392382934,
    priceOffered: '6000000'
  };
  describe('Create order', function () {
    // it('should create an order', async() => {
    //     const data = await userId();
    //     const carId = Date.now();
    //     await db.query(`INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type) values (${carId}, 800000, 'description', 'img.jpg', ${data.id}, 'used', 'bmw', 'c300', 'sedan')`);
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const user = await db.query('SELECT id FROM users LIMIT 2');
    //     const token = await generateToken(data.id, false);
    //     console.log(data.id);
    //     const newOrder = {
    //         carId,
    //         priceOffered: '6000000',
    //     }
    //     await chai.request(server).post('/api/v1/order').set('x-auth', token).send(newOrder).then((err, res) => {
    //         console.log(res);
    //         expect(res.status).to.eq(201);
    //         expect(res.body.data).to.have.property('id');
    //         expect(res.body.data).to.have.property('carid').eq(orderData.carId);
    //         expect(res.body.data.priceoffered).to.eq(orderData.priceOffered);
    //         expect(res.body.data.sellerid).to.eq(data.id);
    //         expect(res.body.data.buyerid).to.eq(user.rows[1].id);
    //     })
    // });
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
                expect(res.body.message).to.eq('Select car and state amount you want to pay');
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
                expect(res.body.message).to.eq('Select car and state amount you want to pay');
              });

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
    it('should return error 400 if car is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return genToken();

            case 2:
              token = _context7.sent;
              orderData.carId = 1288392382934;
              _context7.next = 6;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData);

            case 6:
              res = _context7.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('The car is not available or the seller is not active. Check back');

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('should return 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).post('/api/v1/order').send(orderData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // seller update order price

  describe('Buyer update order price while order it is not pending or cancelled', function () {
    // it('should update the order price ', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     // await db.query(`INSERT INTO orders (id, buyerid, carid, sellerid, price, status, priceoffered) VALUES (${Date.now()}, ${newUser.id}, )`);
    //     const orderInfo = await db.query('SELECT id, buyerid, sellerid, priceoffered, status FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyerid } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='rejected' WHERE id=${id}`);
    //     const token = await generateToken(buyerid, false);
    //     const newData = {
    //         orderId: id,
    //         newPrice: 7100000,
    //     };
    //     const res = await chai.request(server).patch('/api/v1/order').set('x-auth', token).send(newData);
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data.id).to.eq(id);
    //     expect(res.body.data.buyerid).to.eq(buyerid);
    //     expect(parseFloat(res.body.data.priceoffered)).to.eq(newData.newPrice);
    // });
    // it('should return error 400 if newprice is not stated ', async() => {
    //     const orderNow = Date.now();
    //     const data = await dataValues();
    //     const carId = await db.query('select id from cars limit 1');
    //     await db.query(`insert into users (id, email, first_name, last_name, password, address, phone) VALUES (${Date.now()}, '${data.email}', '${data.first_name}', '${data.last_name}', '${data.password}', '${data.address}', '${data.phone}')`);
    //     const { rows } = await db.query('select id from users limit 2');
    //     await db.query(`INSERT INTO orders (id, buyerid, carid, sellerid, price, status, priceoffered) VALUES (${orderNow}, ${rows[0].id}, ${carId.rows[0].id}, ${rows[0].id}, 500000, 'rejected', 4000000)`);
    //     const token = await generateToken(rows[0].id, false);
    //     const newData = {
    //         orderId: orderNow,
    //         newPrice: '',
    //     };
    //     const res = await chai.request(server).patch('/api/v1/order').set('x-auth', token).send(newData);
    //     expect(res.status).to.eq(400);
    //     expect(res.body.message).to.eq('Ensure to send the order id and new price');
    // });
    it('should return error 400 if order id is not supplied ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              token = genToken();
              _context8.next = 3;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send({
                newPrice: 50000
              });

            case 3:
              res = _context8.sent;
              expect(res.status).to.eq(401);

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
  }); // User retrieves his/her orders

  describe('User get his/her ads', function () {
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // view all orders

  describe('View all orders', function () {
    it('should return error 404 if there are no orders',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var newUser, _ref11, rows, length, token, res;

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
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref11 = _context9.sent;
              rows = _ref11.rows;
              _context9.next = 11;
              return _db2["default"].query('DELETE FROM orders');

            case 11:
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, true);
              _context9.next = 15;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 15:
              res = _context9.sent;
              expect(res.body.status).to.eq(404);
              expect(res.body.message).to.eq('There are no orders now. Check back');

            case 18:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').end(function (err, res) {
        expect(res.body.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 401 if user is not admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var newUser, _ref13, rows, length, token, res;

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
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref13 = _context10.sent;
              rows = _ref13.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, false);
              _context10.next = 13;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 13:
              res = _context10.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You dont have the permission to access this resource');

            case 16:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
  }); // view a single order

  describe('View a single order', function () {
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return userId();

            case 2:
              user = _context11.sent;
              _context11.next = 5;
              return (0, _generateToken2["default"])(user.id, true);

            case 5:
              token = _context11.sent;
              _context11.next = 8;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/1212727172172').set('x-auth', token);

            case 8:
              res = _context11.sent;
              expect(res.status).to.eq(200);
              expect(res.body.message).to.eq('Order not found');

            case 11:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }))); // it('should return error 403 if it is not buyer or seller or admin', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { rows } = await db.query('SELECT id from users');
    //     const len = rows.length - 1;
    //     const token = await generateToken(rows[len].id, false);
    //     const res = await chai.request(server).get(`/api/v1/orders/${id}`).set('x-auth', token);
    //     expect(res.status).to.eq(403);
    //     expect(res.body.message).to.eq('You dont have the permission to view this resource');
    // });
  }); // delete an order -  seller and admin can delete a cancelled order

  describe('deletes a cancelled order', function () {
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var _ref16, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return _db2["default"].query('SELECT id from users');

            case 2:
              _ref16 = _context12.sent;
              rows = _ref16.rows;
              len = rows.length - 1;
              _context12.next = 7;
              return (0, _generateToken2["default"])(rows[len].id, true);

            case 7:
              token = _context12.sent;
              _context12.next = 10;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/orders/1678787878781').set('x-auth', token);

            case 10:
              res = _context12.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The order does not exist');

            case 13:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  });
  describe('User retrieves his/her ads', function () {
    it('should return error 404 if user has not sold on the platform',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var newUser, _ref18, rows, token, res;

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
              return _db2["default"].query('SELECT id FROM users LIMIT 2');

            case 7:
              _ref18 = _context13.sent;
              rows = _ref18.rows;
              _context13.next = 11;
              return (0, _generateToken2["default"])(rows[0].id, false);

            case 11:
              token = _context13.sent;
              _context13.next = 14;
              return _db2["default"].query('DELETE FROM orders');

            case 14:
              _context13.next = 16;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token);

            case 16:
              res = _context13.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('You do not have any transaction yet');

            case 19:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
  });
});