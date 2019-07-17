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
    //     it('should create an order', async() => {
    //         const data = await userId();
    //         const newUser = await dataValues();
    //         await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //         const newAd = await newAdValues();
    //         await db.query(`INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ('${Date.now()}', 8000000, '${newAd.description}',
    // 'image_url.png', ${data.id}, '${newAd.state}', '${newAd.manufacturer}', '${newAd.model}', '${newAd.body_type}')`);
    //         const { rows } = await db.query('SELECT id FROM cars limit 1');
    //         const user = await db.query('SELECT id FROM users LIMIT 1');
    //         const token = await generateToken(user.rows[0].id, false);
    //         orderData.car_id = rows[0].id;
    //         const res = await chai.request(server).post('/api/v1/order').set('x-auth', token).send(orderData);
    //         expect(res.status).to.eq(201);
    //         expect(res.body.data).to.have.property('id');
    //         expect(res.body.data).to.have.property('car_id').eq(orderData.car_id);
    //         expect(res.body.data.seller_id).to.eq(data.id);
    //     });
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
    }))); // it('should return error 400 if car is not found', async() => {
    //     const token = await genToken();
    //     orderData.car_id = 1288392382934;
    //     const res = await chai.request(server).post('/api/v1/order').set('x-auth', token).send(orderData);
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('The car is not available or the seller is not active. Check back');
    // });

    it('should return error 401  if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).post('/api/v1/order').send(orderData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  }); // seller update order price

  describe('Buyer update order price while order it is not pending or cancelled', function () {// it('should update the order price ', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyer_id } = orderInfo.rows[0];
    //     const token = await generateToken(buyer_id, true);
    //     const res = await chai.request(server).patch(`/api/v1/order/${id}/price`).set('x-auth', token).send({ price: 7100000 });
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data.id).to.eq(id);
    //     expect(res.body.data.buyer_id).to.eq(buyer_id);
    // });
    // it('should return error 400 if newprice is not stated ', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyer_id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='rejected' WHERE id=${id}`);
    //     const token = await generateToken(buyer_id, false);
    //     const newData = {
    //         order_id: id,
    //         price: '',
    //     };
    //     const res = await chai.request(server).patch(`/api/v1/order/${id}/price`).set('x-auth', token).send(newData);
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('Ensure to send the order id and new price');
    // });
    // it('should return error 400 if order id is not supplied ', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');
    //     // const { id } = orderInfo.rows[0];
    //     // const { buyer_id } = orderInfo.rows[0];
    //     // await db.query(`UPDATE orders SET status='rejected' WHERE id=${id}`);
    //     const token = await generateToken('id');
    //     // const newData = {
    //     //     orderId: '',
    //     //     newPrice: 7100000,
    //     // };
    //     const res = await chai.request(server).patch(`/api/v1/order`).set('x-auth', token);
    //     expect(res.body.status).to.eq(400);
    //     expect(res.body.error).to.eq('Ensure to send the order id and new price');
    // });
    // it('should return error 400 if order status is pending or cancelled', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id, seller_id, price_offered, status FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyer_id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='pending' WHERE id=${id}`);
    //     const token = await generateToken(buyer_id, false);
    //     const newData = {
    //         orderId: id,
    //         newPrice: 7100000,
    //     };
    //     const res = await chai.request(server).patch('/api/v1/order').set('x-auth', token).send(newData);
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('Check that the order id is valid and not cancelled and your new price is different');
    // });
  }); // User retrieves his/her orders

  describe('User get his/her ads', function () {
    // it('should return an array of the users ads', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT seller_id FROM orders LIMIT 1');
    //     const { seller_id } = orderInfo.rows[0];
    //     const token = await generateToken(seller_id, false);
    //     const res = await chai.request(server).get(`/api/v1/orders/${seller_id}`).set('x-auth', token);
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data).to.be.an('Array');
    //     expect(res.body.data[0]).to.have.property('seller_id').eq(seller_id);
    // });
    it('should return error 401 if user is not logged in', function (done) {
      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq('No authorization token provided');
        done();
      });
    });
  }); // view all orders
  // describe('View all orders', () => {
  //     // it('should return all orders placed', async() => {
  //     //     const newUser = await dataValues();
  //     //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     //     const { rows } = await db.query('SELECT id FROM users ');
  //     //     const { length } = rows;
  //     //     const token = generateToken(rows[length - 1].id, true);
  //     //     const res = await chai.request(server).get('/api/v1/orders').set('x-auth', token);
  //     //     expect(res.status).to.eq(200);
  //     //     expect(res.body.data).to.be.an('Array');
  //     // });
  //     // it('should return error 404 if there are no orders', async () => {
  //     //   const newUser = await dataValues();
  //     //   await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     //   const { rows } = await db.query('SELECT id FROM users ');
  //     //   const { length } = rows;
  //     //   const token = generateToken(rows[length - 1].id, true);
  //     //   const res = await chai.request(server).get('/api/v1/orders').set('x-auth', token);
  //     //   expect(res.body.status).to.eq(404);
  //     //   expect(res.body.error).to.eq('There are no orders now. Check back');
  //     // });
  //     // it('should return error 401 if user is not logged in', (done) => {
  //     //     chai.request(server).get('/api/v1/orders').end((err, res) => {
  //     //         expect(res.body.status).to.eq(401);
  //     //         expect(res.body.err).to.eq('No authorization token provided');
  //     //         done();
  //     //     });
  //     // });
  //     // it('should return error 401 if user is not admin', async() => {
  //     //     const newUser = await dataValues();
  //     //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     //     const { rows } = await db.query('SELECT id FROM users ');
  //     //     const { length } = rows;
  //     //     const token = generateToken(rows[length - 1].id, false);
  //     //     const res = await chai.request(server).get('/api/v1/orders').set('x-auth', token);
  //     //     expect(res.status).to.eq(401);
  //     //     expect(res.body.error).to.eq('You dont have the permission to access this resource');
  //     // });
  // });
  // view a single order
  // describe('View a single order', () => {
  //     // it('should return order if it is admin', async() => {
  //     //     const newUser = await dataValues();
  //     //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     //     const { rows } = await db.query('SELECT id FROM users ');
  //     //     const { length } = rows;
  //     //     const token = generateToken(rows[length - 1].id, true);
  //     //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     const res = await chai.request(server).get(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //     expect(res.status).to.eq(200);
  //     //     expect(res.body.data.id).to.eq(id);
  //     // });
  //     // it('should return order if it is the seller', async() => {
  //     //     const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     const { seller_id } = orderInfo.rows[0];
  //     //     const token = await generateToken(id, seller_id, false);
  //     //     const res = await chai.request(server).get(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //     expect(res.status).to.eq(200);
  //     //     expect(res.body.data.id).to.eq(id);
  //     // });
  //     // it('should return order if it is the buyer', async() => {
  //     //     const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     const { buyer_id } = orderInfo.rows[0];
  //     //     const token = await generateToken(buyer_id, false);
  //     //     const res = await chai.request(server).get(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //     expect(res.status).to.eq(200);
  //     //     expect(res.body.data.id).to.eq(id);
  //     // });
  //     // it('should return error 404 if order is not found', async () => {
  //     //   const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
  //     //   const { buyer_id } = orderInfo.rows[0];
  //     //   const token = await generateToken(buyer_id, false);
  //     // eslint-disable-next-line max-len
  //     // const res = await chai.request(server).get('/api/v1/orders/1212727172172').set('x-auth', token);
  //     //   expect(res.status).to.eq(404);
  //     //   expect(res.body.error).to.eq('Order not found');
  //     // });
  //     // it('should return error 403 if it is not buyer or seller or admin', async() => {
  //     //     const newUser = await dataValues();
  //     //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
  //     //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     const { rows } = await db.query('SELECT id from users');
  //     //     const len = rows.length - 1;
  //     //     const token = await generateToken(rows[len].id, false);
  //     //     const res = await chai.request(server).get(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //     expect(res.status).to.eq(403);
  //     //     expect(res.body.error).to.eq('You dont have the permission to view this resource');
  //     // });
  // });
  // update order status

  describe('Seller and Buyer update order status', function () {// it('should update order status by seller when it is pending', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='pending' WHERE id=${id}`);
    //     const { seller_id } = orderInfo.rows[0];
    //     const token = await generateToken(seller_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'accepted' });
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data.id).to.eq(id);
    //     expect(res.body.data.status).to.eq('accepted');
    // });
    // it('should update order status by buyer if the status is accepted', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='accepted' WHERE id=${id}`);
    //     const { buyer_id } = orderInfo.rows[0];
    //     const token = await generateToken(buyer_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'completed' });
    //     expect(res.status).to.eq(200);
    //     expect(res.body.data.id).to.eq(id);
    //     expect(res.body.data.status).to.eq('completed');
    // });
    // it('should return error 404 if order is not found', async() => {
    //     const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyer_id } = orderInfo.rows[0];
    //     const token = await generateToken(buyer_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id + 1}`).set('x-auth', token).send({ status: 'completed' });
    //     expect(res.status).to.eq(404);
    //     expect(res.body.error).to.eq('The order is not available');
    // });
    // it('should return error 406 if seller or buyer is inactive', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id, buyer_id, seller_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { buyer_id } = orderInfo.rows[0];
    //     const { seller_id } = orderInfo.rows[0];
    //     await db.query(`UPDATE users SET status='suspended' WHERE id=${seller_id}`);
    //     const token = await generateToken(buyer_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'completed' });
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('You cannot update the status of this order at its state');
    // });
    // it('should return error 403 if another user/admin attempts to update the order status', async() => {
    //     const newUser = await dataValues();
    //     await chai.request(server).post('/api/v1/auth/signup').send(newUser);
    //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     const { rows } = await db.query('SELECT id FROM users');
    //     const len = rows.length - 1;
    //     const token = await generateToken(len, true);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'completed' });
    //     expect(res.status).to.eq(403);
    //     expect(res.body.error).to.eq('You dont have the permission to modify this resource');
    // });
    // it('should return error 400 if buyer wants to update a pending order', async() => {
    //     const orderInfo = await db.query('SELECT id, buyer_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='pending' WHERE id=${id}`);
    //     const { buyer_id } = orderInfo.rows[0];
    //     const token = await generateToken(buyer_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'completed' });
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('You cannot update the status of this order at its state');
    // });
    // it('should return error 400 if seller wants to update a cancelled order', async() => {
    //     const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
    //     const { id } = orderInfo.rows[0];
    //     await db.query(`UPDATE orders SET status='cancelled' WHERE id=${id}`);
    //     const { seller_id } = orderInfo.rows[0];
    //     const token = await generateToken(seller_id, false);
    //     const res = await chai.request(server).patch(`/api/v1/orders/${id}`).set('x-auth', token).send({ status: 'accepted' });
    //     expect(res.status).to.eq(400);
    //     expect(res.body.error).to.eq('You cannot update the status of this order at its state');
    // });
  }); // delete an order -  seller and admin can delete a cancelled order
  // describe('deletes a cancelled order', () => {
  //     // it('should return error 404 if seller attempts to delete an uncancelled order', async() => {
  //     //     const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     await db.query(`UPDATE orders SET status='rejected' WHERE id=${id}`);
  //     //     const { seller_id } = orderInfo.rows[0];
  //     //     const token = await generateToken(seller_id, false);
  //     //     const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //     expect(res.status).to.eq(404);
  //     //     expect(res.body.error).to.eq('The order does not exist');
  //     // });
  //     // it('should return error 404 if order is not found', async() => {
  //     //     const { rows } = await db.query('SELECT id from users');
  //     //     const len = rows.length - 1;
  //     //     const token = await generateToken(rows[len].id, true);
  //     //     const res = await chai.request(server).delete('/api/v1/orders/1678787878781').set('x-auth', token);
  //     //     expect(res.status).to.eq(404);
  //     //     expect(res.body.error).to.eq('The order does not exist');
  //     // });
  //     // it('should return error 404 if a logged in user attempts to delete the order', async () => {
  //     //   const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
  //     //   const { id } = orderInfo.rows[0];
  //     //   const { rows } = await db.query('SELECT id from users');
  //     //   const len = rows.length - 1;
  //     //   const token = await generateToken(rows[len].id, true);
  //     //   const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', token);
  //     //   expect(res.status).to.eq(404);
  //     //   expect(res.body.error).to.eq('You dont have permission to delete this resource');
  //     // });
  //     // it('seller should delete an order that is cancelled', async () => {
  //     //   const token = genToken();
  //     //   const cars = await db.query('SELECT id FROM cars');
  //     //   const newOrderData = {
  //     //     carId: cars.rows[0].id,
  //     //     price_offered: 45000000,
  //     //   };
  //     //   await chai.request(server).post('/api/v1/order').set('x-auth', token).send(newOrderData);
  //     //   const orderInfo = await db.query('SELECT id, seller_id FROM orders LIMIT 1');
  //     //   const { id } = orderInfo.rows[0];
  //     //   await db.query(`UPDATE orders SET status='cancelled' WHERE id=${id}`);
  //     //   const { seller_id } = orderInfo.rows[0];
  //     //   const tk = await generateToken(seller_id, false);
  //     //   const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', tk);
  //     //   expect(res.status).to.eq(200);
  //     //   expect(res.body.data.id).to.eq(id);
  //     // });
  //     // it('admin should delete any order', async() => {
  //     //     const token = genToken();
  //     //     const cars = await db.query('SELECT id FROM cars');
  //     //     const newOrderData = {
  //     //         carId: cars.rows[0].id,
  //     //         price_offered: 45000000,
  //     //     };
  //     //     await chai.request(server).post('/api/v1/order').set('x-auth', token).send(newOrderData);
  //     //     const orderInfo = await db.query('SELECT id FROM orders LIMIT 1');
  //     //     const { id } = orderInfo.rows[0];
  //     //     const { rows } = await db.query('SELECT id FROM users LIMIT 1');
  //     //     const tk = generateToken(rows[0].id, true);
  //     //     const res = await chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', tk);
  //     //     expect(res.status).to.eq(200);
  //     //     expect(res.body.data.id).to.eq(id);
  //     // });
  // });
  // describe('User retrieves his/her ads', () => {
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