"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _carsData = require("../carsData");

var _carsData2 = _interopRequireDefault(_carsData);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

var _CarModel = require("../../models/CarModel");

var _CarModel2 = _interopRequireDefault(_CarModel);

var _UserModel = require("../../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _generateToken = require("../../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

var _ordersData = require("../ordersData");

var _ordersData2 = _interopRequireDefault(_ordersData);

var _OrderModel = require("../../models/OrderModel");

var _OrderModel2 = _interopRequireDefault(_OrderModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

describe('Order transaction', function () {
  describe('Create order', function () {
    // it('should create an order', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const price = parseInt(carsData[0].price, 10) - 500000;
    //     const data = {
    //         buyerId: user.id,
    //         carId: carsData[0].id,
    //         price: carsData[0].price,
    //         priceOffered: price,
    //         sellerId: usersData[1].id,
    //     };
    //     chai.request(server).post('/api/v1/order').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data).to.have.property('id');
    //             expect(res.body.data).to.have.property('carId').eq(data.carId);
    //             expect(res.body.data.price).to.eq(data.price);
    //             expect(res.body.data.priceOffered).to.eq(data.priceOffered);
    //             expect(res.body.data.sellerId).to.eq(data.sellerId);
    //             expect(res.body.data.buyerId).to.eq(data.buyerId);
    //             done();
    //         });
    // });
    it('should return error 400 if carId or price is not supplied', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        buyerId: user.id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: '',
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Select car and state amount you want to pay');
        done();
      });
    });
    it('should return error 400 if car id is invalid', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        buyerId: user.id,
        carId: 111222333444,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Select car and state amount you want to pay');
        done();
      });
    }); // it('should return error 404 if car is not found', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const price = parseInt(carsData[0].price, 10) - 500000;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         buyerId: user.id,
    //         carId: 1112223334445,
    //         price: carsData[0].price,
    //         priceOffered: price,
    //         sellerId: usersData[1].id,
    //     };
    //     chai.request(server).post('/api/v1/order').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(404);
    //             expect(res.body.message).to.eq('This car is not available for purchase');
    //             done();
    //         });
    // });
    // it('should return error 404 if car status is not == available', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     carsData[0].status = 'sold';
    //     const price = parseInt(carsData[0].price, 10) - 500000;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         buyerId: user.id,
    //         carId: carsData[0].id,
    //         price: carsData[0].price,
    //         priceOffered: price,
    //         sellerId: usersData[1].id,
    //     };
    //     chai.request(server).post('/api/v1/order').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(404);
    //             expect(res.body.message).to.eq('This car is not available for purchase');
    //             done();
    //         });
    // });
    // it('should return 404 if seller is not active', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     usersData[1].status = 'suspended';
    //     carsData[0].status = 'available';
    //     const token = generateToken(user.id, user.isAdmin);
    //     const price = parseInt(carsData[0].price, 10) - 500000;
    //     const data = {
    //         buyerId: user.id,
    //         carId: carsData[0].id,
    //         price: carsData[0].price,
    //         priceOffered: price,
    //         sellerId: usersData[1].id,
    //     };
    //     chai.request(server).post('/api/v1/order').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(404);
    //             expect(res.body.message).to.eq('Unverified seller. Kindly check back');
    //             done();
    //         });
    // });

    it('should return 401 if user is not logged in', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var data = {
        buyerId: user.id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').send(data).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // seller update order price

  describe('Seller update order price while status is still pending', function () {
    it('should update the order price ', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].sellerId = user.id;
      _ordersData2["default"][0].status = 'pending';
      _ordersData2["default"][0].buyerId = _usersData2["default"][0].id;
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var newPrice = parseInt(_ordersData2["default"][0].price, 10) - 100000;
      var data = {
        orderId: _ordersData2["default"][0].id,
        newPrice: newPrice
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.priceOffered).to.eq(data.newPrice);
        expect(res.body.data.buyerId).to.eq(user.id);
        done();
      });
    });
    it('should return error 400 if newprice is not stated ', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].buyerId = user.id;
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        orderId: _ordersData2["default"][0].id,
        newPrice: ''
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to send the order id and new price');
        done();
      });
    });
    it('should return error 400 if order id is not supplied ', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].buyerId = user.id;
      user.isAdmin = false;
      var newPrice = parseInt(_ordersData2["default"][0].price, 10);
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        orderId: '',
        newPrice: newPrice
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to send the order id and new price');
        done();
      });
    });
    it('should return error 404 if order is not found', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].buyerId = user.id;
      user.isAdmin = false;
      var newPrice = parseInt(_ordersData2["default"][0].price, 10);
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        orderId: '6667778889990',
        newPrice: newPrice
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Check that the order is still pending');
        done();
      });
    });
    it('should return error 404 if order is no longer pending', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].buyerId = user.id;
      user.isAdmin = false;
      var newPrice = parseInt(_ordersData2["default"][0].price, 10);
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      _ordersData2["default"][0].status = 'Rejected';
      var data = {
        orderId: _ordersData2["default"][0].id,
        newPrice: newPrice
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Check that the order is still pending');
        done();
      });
    });
    it('should return error 400 if old and new prices are the same ', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      _ordersData2["default"][0].status = 'pending';
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        orderId: _ordersData2["default"][0].id,
        newPrice: _ordersData2["default"][0].priceOffered
      };

      _chai2["default"].request(_index2["default"]).patch('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('The new offered price and the old are the same');
        done();
      });
    });
  }); // User retrieves his/her ads

  describe('User get his/her sold ads', function () {
    it('should return an array of the users sold ads', function (done) {
      _ordersData2["default"][0].sellerId = _usersData2["default"][0].id;
      _ordersData2["default"][0].status = 'completed';
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('Array');
        expect(res.body.data[0]).to.have.property('sellerId').eq(user.id);
        expect(res.body.data[0]).to.have.property('status').eq('completed');
        done();
      });
    });
    it('should return error 404 if user has not sold on the platform', function (done) {
      _ordersData2["default"][0].sellerId = _usersData2["default"][1].id;
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('You have not sold on the platform');
        done();
      });
    });
    it('should return error 401 if user is not logged in', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders/me').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // view all orders

  describe('View all orders', function () {
    it('should return all orders placed', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('Array');
        expect(res.body.data[0]).to.have.property('id').eq(_ordersData2["default"][0].id);
        done();
      });
    });
    it('should return error 404 if there are no orders', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = [];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token).end(function (err, res) {
        expect(res.body.status).to.eq(404);
        expect(res.body.message).to.eq('There are no orders now. Check back');
        done();
      });
    });
    it('should return error 401 if user is not logged in', function (done) {
      _OrderModel2["default"].orders = _ordersData2["default"];

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').end(function (err, res) {
        expect(res.body.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 401 if user is not admin', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/orders').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('You dont have the permission to access this resource');
        done();
      });
    });
  }); // view a single order

  describe('View a single order', function () {
    it('should return order if it is admin', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        done();
      });
    });
    it('should return order if it is the seller', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].sellerId = _usersData2["default"][0].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        done();
      });
    });
    it('should return order if it is the buyer', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].buyerId = _usersData2["default"][0].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        done();
      });
    });
    it('should return error 404 if order is not found', function (done) {
      _UserModel2["default"].users = _usersData2["default"];

      var _ref = _ordersData2["default"][0] + 1,
          id = _ref.id;

      _ordersData2["default"][0].buyerId = _usersData2["default"][0].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Order not found');
        done();
      });
    });
    it('should return error 403 if it is not buyer or seller or admin', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].buyerId = _usersData2["default"][1].id;
      _ordersData2["default"][0].sellerId = _usersData2["default"][2].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(403);
        expect(res.body.message).to.eq('You dont have the permission to view this resource');
        done();
      });
    });
  }); // delete an order -  seller and admin can delete a cancelled order

  describe('deletes a cancelled order', function () {
    it('should return error 400 if seller attempts to delete an uncancelled order', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].status = 'rejected';
      _ordersData2["default"][0].sellerId = _usersData2["default"][0].id;
      _ordersData2["default"][0].buyerId = _usersData2["default"][1].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('You cannot delete an incomplete transaction');
        done();
      });
    });
    it('should return error 404 if order is not found', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]('/api/v1/orders/1678787878781').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The order does not exist');
        done();
      });
    });
    it('should return error 403 if a logged in user attempts to delete the order', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].sellerId = _usersData2["default"][0].id;
      _ordersData2["default"][0].buyerId = _usersData2["default"][1].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][2];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(403);
        expect(res.body.message).to.eq('You dont have permission to delete this resource');
        done();
      });
    });
    it('seller should delete an order that is cancelled', function (done) {
      _UserModel2["default"].users = _usersData2["default"];
      var id = _ordersData2["default"][0].id;
      _ordersData2["default"][0].status = 'cancelled';
      _ordersData2["default"][0].sellerId = _usersData2["default"][0].id;
      _ordersData2["default"][0].buyerId = _usersData2["default"][1].id;
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/orders/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        done();
      });
    }); // it('admin should delete any order', (done) => {
    //     UserModel.users = usersData;
    //     const { id } = ordersData[0];
    //     ordersData[0].status = 'accepted';
    //     OrderModel.orders = ordersData;
    //     const user = usersData[0];
    //     user.isAdmin = true;
    //     const token = generateToken(user.id, user.isAdmin);
    //     chai.request(server).delete(`/api/v1/orders/${id}`).set('x-auth', token)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data.id).to.eq(id);
    //             done();
    //         });
    // });
  });
});