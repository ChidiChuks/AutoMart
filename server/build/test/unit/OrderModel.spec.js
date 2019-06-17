"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _OrderModel = require("../../models/OrderModel");

var _OrderModel2 = _interopRequireDefault(_OrderModel);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

var _carsData = require("../carsData");

var _carsData2 = _interopRequireDefault(_carsData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;
describe('Order Model', function () {
  describe('Create order', function () {
    it('It should create a new order', function () {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      var price = parseInt(_carsData2["default"][0].price, 10) - 500000;
      var data = {
        buyerId: _usersData2["default"][0].id,
        carId: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price,
        priceOffered: price,
        sellerId: _usersData2["default"][1].id
      };

      var newOrder = _OrderModel2["default"].createOrder(data);

      expect(newOrder).to.have.property('date');
      expect(newOrder).to.have.property('priceOffered').eq(price);
      expect(newOrder.sellerId).to.eq(_usersData2["default"][1].id);
    });
  });
});