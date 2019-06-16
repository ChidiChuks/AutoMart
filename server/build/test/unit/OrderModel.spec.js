"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _OrderModel = _interopRequireDefault(require("../../models/OrderModel"));

var _usersData = _interopRequireDefault(require("../usersData"));

var _carsData = _interopRequireDefault(require("../carsData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;
describe('Order Model', function () {
  describe('Create order', function () {
    it('It should create a new order', function () {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      var price = parseInt(_carsData["default"][0].price, 10) - 500000;
      var data = {
        buyerId: _usersData["default"][0].id,
        carId: _carsData["default"][0].id,
        price: _carsData["default"][0].price,
        priceOffered: price,
        sellerId: _usersData["default"][1].id
      };

      var newOrder = _OrderModel["default"].createOrder(data);

      expect(newOrder).to.have.property('date');
      expect(newOrder).to.have.property('priceOffered').eq(price);
      expect(newOrder.sellerId).to.eq(_usersData["default"][1].id);
    });
  });
});