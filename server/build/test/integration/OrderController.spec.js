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
    it('should create an order', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var data = {
        buyerId: user.id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('carId').eq(data.carId);
        expect(res.body.data.price).to.eq(data.price);
        expect(res.body.data.priceOffered).to.eq(data.priceOffered);
        expect(res.body.data.sellerId).to.eq(data.sellerId);
        expect(res.body.data.buyerId).to.eq(data.buyerId);
        done();
      });
    });
    it('should return error 412 if carId or price is not supplied', function (done) {
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
        expect(res.status).to.eq(412);
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
        expect(res.body.message).to.eq('Invalid ad id');
        done();
      });
    });
    it('should return error 404 if car is not found', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        buyerId: user.id,
        carId: 1112223334445,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('This car is no longer available');
        done();
      });
    });
    it('should return error 403 if car status is not == available', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      _carsData2["default"][0].status = 'sold';
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        buyerId: user.id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(403);
        expect(res.body.message).to.eq('The car is not available for purchase now');
        done();
      });
    });
    it('should return 412 if seller is not active', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      _usersData2["default"][1].status = 'suspended';
      _carsData2["default"][0].status = 'available';
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var data = {
        buyerId: user.id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/order').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(412);
        expect(res.body.message).to.eq('The seller is not permitted transactions');
        done();
      });
    });
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
  });
  describe('Seller update order price while status is still pending', function () {
    it('should update the price ', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _OrderModel2["default"].orders = _ordersData2["default"];
      var user = _usersData2["default"][0];
      _ordersData2["default"][0].buyerId = user.id;
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var newPrice = parseInt(_ordersData2["default"][0].price, 10);
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
  });
});