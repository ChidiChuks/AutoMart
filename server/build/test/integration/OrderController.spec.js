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
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return dataValues();

          case 2:
            data = _context3.sent;
            _context3.next = 5;
            return _db2["default"].query("insert into users (id, email, first_name, last_name, password, address, phone) VALUES (".concat(Date.now(), ", '").concat(data.email, "', '").concat(data.first_name, "', '").concat(data.last_name, "', '").concat(data.password, "', '").concat(data.address, "', '").concat(data.phone, "')"));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }))); // after(async() => {
  //     await db.query("DELETE FROM flags");
  //     await db.query("DELETE FROM orders");
  //     await db.query("DELETE FROM cars");
  //     await db.query("DELETE FROM users");
  // });

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
    regeneratorRuntime.mark(function _callee4() {
      var token;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return genToken();

            case 2:
              token = _context4.sent;
              orderData.carId = '';

              _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData).end(function (err, res) {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq('Select car and state amount you want to pay');
              });

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
    it('should return error 400 if car id is invalid',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var token;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              orderData.carId = 128839238293;
              _context5.next = 3;
              return genToken();

            case 3:
              token = _context5.sent;

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
    it('should return error 400 if car is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var token, res;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return genToken();

            case 2:
              token = _context6.sent;
              orderData.carId = 1288392382934;
              _context6.next = 6;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(orderData);

            case 6:
              res = _context6.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('The car is not available or the seller is not active. Check back');

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
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
    it('should return error 400 if newprice is not stated ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var orderNow, carId, _ref9, rows, token, newData, res;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              orderNow = Date.now();
              _context7.next = 3;
              return _db2["default"].query('select id from cars limit 1');

            case 3:
              carId = _context7.sent;
              _context7.next = 6;
              return _db2["default"].query('select id from users limit 2');

            case 6:
              _ref9 = _context7.sent;
              rows = _ref9.rows;
              _context7.next = 10;
              return _db2["default"].query("INSERT INTO orders (id, buyerid, carid, sellerid, price, status, priceoffered) VALUES (".concat(orderNow, ", ").concat(rows[0].id, ", ").concat(carId.rows[0].id, ", ").concat(rows[1].id, ", 500000, 'rejected', 4000000)"));

            case 10:
              _context7.next = 12;
              return (0, _generateToken2["default"])(rows[0].id, false);

            case 12:
              token = _context7.sent;
              newData = {
                orderId: orderNow,
                newPrice: ''
              };
              _context7.next = 16;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 16:
              res = _context7.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Ensure to send the order id and new price');

            case 19:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    })));
    it('should return error 400 if order id is not supplied ',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8() {
      var newUser, orderInfo, id, buyerid, token, newData, res;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return dataValues();

            case 2:
              newUser = _context8.sent;
              _context8.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context8.next = 7;
              return _db2["default"].query('SELECT id, buyerid, sellerid, priceoffered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context8.sent;
              id = orderInfo.rows[0].id;
              buyerid = orderInfo.rows[0].buyerid;
              _context8.next = 12;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 12:
              _context8.next = 14;
              return (0, _generateToken2["default"])(buyerid, false);

            case 14:
              token = _context8.sent;
              newData = {
                orderId: '',
                newPrice: 7100000
              };
              _context8.next = 18;
              return _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(newData);

            case 18:
              res = _context8.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Ensure to send the order id and new price');

            case 21:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    })));
    it('should return error 400 if order status is pending or cancelled',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9() {
      var newUser, orderInfo, id, buyerid, token, newData, res;
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
              return _db2["default"].query('SELECT id, buyerid, sellerid, priceoffered, status FROM orders LIMIT 1');

            case 7:
              orderInfo = _context9.sent;
              id = orderInfo.rows[0].id;
              buyerid = orderInfo.rows[0].buyerid;
              _context9.next = 12;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 12:
              _context9.next = 14;
              return (0, _generateToken2["default"])(buyerid, false);

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
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('Check that the order id is valid and not cancelled and your new price is different');

            case 21:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));
  }); // User retrieves his/her orders

  describe('User get his/her ads', function () {
    it('should return an array of the users ads',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var newUser, orderInfo, sellerid, token, res;
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
              return _db2["default"].query('SELECT sellerid FROM orders LIMIT 1');

            case 7:
              orderInfo = _context10.sent;
              sellerid = orderInfo.rows[0].sellerid;
              _context10.next = 11;
              return (0, _generateToken2["default"])(sellerid, false);

            case 11:
              token = _context10.sent;
              _context10.next = 14;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token);

            case 14:
              res = _context10.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');
              expect(res.body.data[0]).to.have.property('sellerid').eq(sellerid);

            case 18:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    })));
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // view all orders

  describe('View all orders', function () {
    it('should return all orders placed',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var newUser, _ref14, rows, length, token, res;

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
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref14 = _context11.sent;
              rows = _ref14.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, true);
              _context11.next = 13;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 13:
              res = _context11.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data).to.be.an('Array');

            case 16:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }))); // it('should return error 404 if there are no orders', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const { rows } = await db.query('SELECT id FROM users ');
    //     await db.query('DELETE FROM orders');
    //     const { length } = rows;
    //     const token = generateToken(rows[length - 1].id, true);
    //     const res = await chai.request(server).get('/api/v1/orders').set('x-auth', token);
    //     console.log(res)
    //     expect(res.body.status).to.eq(404);
    //     expect(res.body.message).to.eq('There are no orders now. Check back');
    // });

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
    regeneratorRuntime.mark(function _callee12() {
      var newUser, _ref16, rows, length, token, res;

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
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref16 = _context12.sent;
              rows = _ref16.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, false);
              _context12.next = 13;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token);

            case 13:
              res = _context12.sent;
              expect(res.status).to.eq(401);
              expect(res.body.message).to.eq('You dont have the permission to access this resource');

            case 16:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  }); // view a single order

  describe('View a single order', function () {
    it('should return order if it is admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var newUser, _ref18, rows, length, token, orderInfo, id, res;

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
              return _db2["default"].query('SELECT id FROM users ');

            case 7:
              _ref18 = _context13.sent;
              rows = _ref18.rows;
              length = rows.length;
              token = (0, _generateToken2["default"])(rows[length - 1].id, true);
              _context13.next = 13;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 13:
              orderInfo = _context13.sent;
              id = orderInfo.rows[0].id;
              _context13.next = 17;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 17:
              res = _context13.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 20:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })));
    it('should return order if it is the seller',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var orderInfo, id, sellerid, token, res;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return _db2["default"].query('SELECT id, sellerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context14.sent;
              id = orderInfo.rows[0].id;
              sellerid = orderInfo.rows[0].sellerid;
              _context14.next = 7;
              return (0, _generateToken2["default"])(sellerid, false);

            case 7:
              token = _context14.sent;
              _context14.next = 10;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 10:
              res = _context14.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 13:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })));
    it('should return order if it is the buyer',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var orderInfo, id, buyerid, token, res;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return _db2["default"].query('SELECT id, buyerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context15.sent;
              id = orderInfo.rows[0].id;
              buyerid = orderInfo.rows[0].buyerid;
              _context15.next = 7;
              return (0, _generateToken2["default"])(buyerid, false);

            case 7:
              token = _context15.sent;
              _context15.next = 10;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 10:
              res = _context15.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);

            case 13:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })));
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var user, token, res;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return userId();

            case 2:
              user = _context16.sent;
              _context16.next = 5;
              return (0, _generateToken2["default"])(user.id, true);

            case 5:
              token = _context16.sent;
              _context16.next = 8;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/1212727172172').set('x-auth', token);

            case 8:
              res = _context16.sent;
              expect(res.status).to.eq(200);
              expect(res.body.message).to.eq('Order not found');

            case 11:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
    it('should return error 403 if it is not buyer or seller or admin',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      var newUser, orderInfo, id, _ref23, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return dataValues();

            case 2:
              newUser = _context17.sent;
              _context17.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context17.next = 7;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context17.sent;
              id = orderInfo.rows[0].id;
              _context17.next = 11;
              return _db2["default"].query('SELECT id from users');

            case 11:
              _ref23 = _context17.sent;
              rows = _ref23.rows;
              len = rows.length - 1;
              _context17.next = 16;
              return (0, _generateToken2["default"])(rows[len].id, false);

            case 16:
              token = _context17.sent;
              _context17.next = 19;
              return _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 19:
              res = _context17.sent;
              expect(res.status).to.eq(403);
              expect(res.body.message).to.eq('You dont have the permission to view this resource');

            case 22:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })));
  }); // update order status

  describe('Seller and Buyer update order status', function () {
    it('should update order status by seller when it is pending',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var newUser, orderInfo, id, sellerid, token, res;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return dataValues();

            case 2:
              newUser = _context18.sent;
              _context18.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context18.next = 7;
              return _db2["default"].query('SELECT id, sellerid FROM orders LIMIT 1');

            case 7:
              orderInfo = _context18.sent;
              id = orderInfo.rows[0].id;
              _context18.next = 11;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 11:
              sellerid = orderInfo.rows[0].sellerid;
              _context18.next = 14;
              return (0, _generateToken2["default"])(sellerid, false);

            case 14:
              token = _context18.sent;
              _context18.next = 17;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'accepted'
              });

            case 17:
              res = _context18.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.status).to.eq('accepted');

            case 21:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })));
    it('should update order status by buyer if the status is accepted',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var newUser, orderInfo, id, buyerid, token, res;
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
              return _db2["default"].query('SELECT id, buyerid FROM orders LIMIT 1');

            case 7:
              orderInfo = _context19.sent;
              id = orderInfo.rows[0].id;
              _context19.next = 11;
              return _db2["default"].query("UPDATE orders SET status='accepted' WHERE id=".concat(id));

            case 11:
              buyerid = orderInfo.rows[0].buyerid;
              _context19.next = 14;
              return (0, _generateToken2["default"])(buyerid, false);

            case 14:
              token = _context19.sent;
              _context19.next = 17;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 17:
              res = _context19.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(id);
              expect(res.body.data.status).to.eq('completed');

            case 21:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })));
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var orderInfo, id, buyerid, token, res;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return _db2["default"].query('SELECT id, buyerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context20.sent;
              id = orderInfo.rows[0].id;
              buyerid = orderInfo.rows[0].buyerid;
              _context20.next = 7;
              return (0, _generateToken2["default"])(buyerid, false);

            case 7:
              token = _context20.sent;
              _context20.next = 10;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id + 1)).set('x-auth', token).send({
                status: 'completed'
              });

            case 10:
              res = _context20.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The order is not available');

            case 13:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, this);
    })));
    it('should return error 406 if seller or buyer is inactive',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee21() {
      var newUser, orderInfo, id, buyerid, sellerid, token, res;
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
              return _db2["default"].query('SELECT id, buyerid, sellerid FROM orders LIMIT 1');

            case 7:
              orderInfo = _context21.sent;
              id = orderInfo.rows[0].id;
              buyerid = orderInfo.rows[0].buyerid;
              sellerid = orderInfo.rows[0].sellerid;
              _context21.next = 13;
              return _db2["default"].query("UPDATE users SET status='suspended' WHERE id=".concat(sellerid));

            case 13:
              _context21.next = 15;
              return (0, _generateToken2["default"])(buyerid, false);

            case 15:
              token = _context21.sent;
              _context21.next = 18;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 18:
              res = _context21.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('You cannot update the status of this order at its state');

            case 21:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, this);
    })));
    it('should return error 403 if another user/admin attempts to update the order status',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee22() {
      var newUser, orderInfo, id, _ref29, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return dataValues();

            case 2:
              newUser = _context22.sent;
              _context22.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context22.next = 7;
              return _db2["default"].query('SELECT id FROM orders LIMIT 1');

            case 7:
              orderInfo = _context22.sent;
              id = orderInfo.rows[0].id;
              _context22.next = 11;
              return _db2["default"].query('SELECT id FROM users');

            case 11:
              _ref29 = _context22.sent;
              rows = _ref29.rows;
              len = rows.length - 1;
              _context22.next = 16;
              return (0, _generateToken2["default"])(len, true);

            case 16:
              token = _context22.sent;
              _context22.next = 19;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 19:
              res = _context22.sent;
              expect(res.status).to.eq(403);
              expect(res.body.message).to.eq('You dont have the permission to modify this resource');

            case 22:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, this);
    })));
    it('should return error 400 if buyer wants to update a pending order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee23() {
      var orderInfo, id, buyerid, token, res;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return _db2["default"].query('SELECT id, buyerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context23.sent;
              id = orderInfo.rows[0].id;
              _context23.next = 6;
              return _db2["default"].query("UPDATE orders SET status='pending' WHERE id=".concat(id));

            case 6:
              buyerid = orderInfo.rows[0].buyerid;
              _context23.next = 9;
              return (0, _generateToken2["default"])(buyerid, false);

            case 9:
              token = _context23.sent;
              _context23.next = 12;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'completed'
              });

            case 12:
              res = _context23.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('You cannot update the status of this order at its state');

            case 15:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this);
    })));
    it('should return error 400 if seller wants to update a cancelled order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee24() {
      var orderInfo, id, sellerid, token, res;
      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return _db2["default"].query('SELECT id, sellerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context24.sent;
              id = orderInfo.rows[0].id;
              _context24.next = 6;
              return _db2["default"].query("UPDATE orders SET status='cancelled' WHERE id=".concat(id));

            case 6:
              sellerid = orderInfo.rows[0].sellerid;
              _context24.next = 9;
              return (0, _generateToken2["default"])(sellerid, false);

            case 9:
              token = _context24.sent;
              _context24.next = 12;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/orders/".concat(id)).set('x-auth', token).send({
                status: 'accepted'
              });

            case 12:
              res = _context24.sent;
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq('You cannot update the status of this order at its state');

            case 15:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, this);
    })));
  }); // delete an order -  seller and admin can delete a cancelled order

  describe('deletes a cancelled order', function () {
    it('should return error 404 if seller attempts to delete an uncancelled order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee25() {
      var orderInfo, id, sellerid, token, res;
      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              _context25.next = 2;
              return _db2["default"].query('SELECT id, sellerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context25.sent;
              id = orderInfo.rows[0].id;
              _context25.next = 6;
              return _db2["default"].query("UPDATE orders SET status='rejected' WHERE id=".concat(id));

            case 6:
              sellerid = orderInfo.rows[0].sellerid;
              _context25.next = 9;
              return (0, _generateToken2["default"])(sellerid, false);

            case 9:
              token = _context25.sent;
              _context25.next = 12;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 12:
              res = _context25.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The order does not exist');

            case 15:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, this);
    })));
    it('should return error 404 if order is not found',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee26() {
      var _ref34, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return _db2["default"].query('SELECT id from users');

            case 2:
              _ref34 = _context26.sent;
              rows = _ref34.rows;
              len = rows.length - 1;
              _context26.next = 7;
              return (0, _generateToken2["default"])(rows[len].id, true);

            case 7:
              token = _context26.sent;
              _context26.next = 10;
              return _chai2["default"].request(_index2["default"])["delete"]('/api/v1/orders/1678787878781').set('x-auth', token);

            case 10:
              res = _context26.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The order does not exist');

            case 13:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26, this);
    })));
    it('should return error 404 if a logged in user attempts to delete the order',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee27() {
      var orderInfo, id, _ref36, rows, len, token, res;

      return regeneratorRuntime.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return _db2["default"].query('SELECT id, sellerid FROM orders LIMIT 1');

            case 2:
              orderInfo = _context27.sent;
              id = orderInfo.rows[0].id;
              _context27.next = 6;
              return _db2["default"].query('SELECT id from users');

            case 6:
              _ref36 = _context27.sent;
              rows = _ref36.rows;
              len = rows.length - 1;
              _context27.next = 11;
              return (0, _generateToken2["default"])(rows[len].id, false);

            case 11:
              token = _context27.sent;
              _context27.next = 14;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token);

            case 14:
              res = _context27.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('The order does not exist');

            case 17:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27, this);
    })));
    it('seller should delete an order that is cancelled',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee28() {
      var orderNow, carId, _ref38, rows, tk, res;

      return regeneratorRuntime.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              orderNow = Date.now();
              _context28.next = 3;
              return _db2["default"].query('select id from cars limit 1');

            case 3:
              carId = _context28.sent;
              _context28.next = 6;
              return _db2["default"].query('select id from users limit 2');

            case 6:
              _ref38 = _context28.sent;
              rows = _ref38.rows;
              _context28.next = 10;
              return _db2["default"].query("INSERT INTO orders (id, buyerid, carid, sellerid, price, status, priceoffered) VALUES (".concat(orderNow, ", ").concat(rows[0].id, ", ").concat(carId.rows[0].id, ", ").concat(rows[1].id, ", 500000, 'cancelled', 4000000)"));

            case 10:
              _context28.next = 12;
              return (0, _generateToken2["default"])(rows[1].id, false);

            case 12:
              tk = _context28.sent;
              _context28.next = 15;
              return _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(orderNow)).set('x-auth', tk);

            case 15:
              res = _context28.sent;
              expect(res.status).to.eq(200);
              expect(res.body.data.id).to.eq(orderNow.toString());

            case 18:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28, this);
    }))); // it('admin should delete any order', async() => {
    //     const token = genToken();
    //     const cars = await db.query('SELECT id FROM cars');
    //     const newOrderData = {
    //         carId: cars.rows[0].id,
    //         priceOffered: 45000000,
    //     };
    //     await chai.request(server).post('/api/v1/order').set('x-auth', token).send(newOrderData);
    //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { rows } = await db.query('SELECT id FROM users LIMIT 1');
    //     const tk = generateToken(rows[0].id, true);
    //     const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', tk);
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data.id).to.eq(id);
    // });
  });
  describe('User retrieves his/her ads', function () {
    it('should return error 404 if user has not sold on the platform',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee29() {
      var newUser, _ref40, rows, token, res;

      return regeneratorRuntime.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return dataValues();

            case 2:
              newUser = _context29.sent;
              _context29.next = 5;
              return _chai2["default"].request(_index2["default"]).post('/api/v1/auth/signup').send(newUser);

            case 5:
              _context29.next = 7;
              return _db2["default"].query('SELECT id FROM users LIMIT 2');

            case 7:
              _ref40 = _context29.sent;
              rows = _ref40.rows;
              _context29.next = 11;
              return (0, _generateToken2["default"])(rows[0].id, false);

            case 11:
              token = _context29.sent;
              _context29.next = 14;
              return _db2["default"].query('DELETE FROM orders');

            case 14:
              _context29.next = 16;
              return _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token);

            case 16:
              res = _context29.sent;
              expect(res.status).to.eq(404);
              expect(res.body.message).to.eq('You do not have any transaction yet');

            case 19:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee29, this);
    })));
  });
});