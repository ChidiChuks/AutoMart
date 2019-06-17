"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CarModel = require("../models/CarModel");

var _CarModel2 = _interopRequireDefault(_CarModel);

var _UserModel = require("../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _OrderModel = require("../models/OrderModel");

var _OrderModel2 = _interopRequireDefault(_OrderModel);

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Order = {
  create: function create(req, res) {
    req.body.buyerId = req.userId;
    var requiredParams = ['carId', 'priceOffered', 'buyerId'];

    if ((0, _validateData2["default"])(requiredParams, req.body) || req.body.carId.toString().length !== 13) {
      return res.status(400).send({
        status: 400,
        message: 'Select car and state amount you want to pay'
      });
    } // verify the car and its status


    var car = _CarModel2["default"].carIsEligible(req.body.carId);

    if (!car) {
      return res.status(404).send({
        status: 404,
        message: 'This car is not available for purchase'
      });
    }

    var seller = _UserModel2["default"].isUserActive('id', car.owner);

    if (!seller) {
      return res.status(404).send({
        status: 404,
        message: 'Unverified seller. Kindly check back'
      });
    }

    var order = _OrderModel2["default"].createOrder({
      buyerId: req.body.buyerId,
      sellerId: car.owner,
      carId: req.body.carId,
      price: car.price,
      priceOffered: req.body.priceOffered
    });

    return res.status(200).send({
      status: 200,
      data: {
        id: order.id,
        carId: req.body.carId,
        date: order.date,
        status: order.status,
        price: order.price,
        priceOffered: order.priceOffered,
        sellerId: seller.id,
        buyerId: order.buyerId
      }
    });
  },
  updatePrice: function updatePrice(req, res) {
    var requiredParams = ['orderId', 'newPrice'];

    if ((0, _validateData2["default"])(requiredParams, req.body)) {
      return res.status(400).send({
        status: 400,
        message: 'Ensure to send the order id and new price'
      });
    } // check that the order exist and status is still pending


    var order = _OrderModel2["default"].getOrder(req.body.orderId);

    if (!order || order.status.toLowerCase() !== 'pending') {
      return res.status(404).send({
        status: 404,
        message: 'Check that the order is still pending'
      });
    } // check that the request is coming from the buyer


    var buyer = req.userId;

    if (parseInt(buyer, 10) !== parseInt(order.buyerId, 10)) {
      return res.status(403).send({
        status: 403,
        message: 'You dont have the permission to modify this order'
      });
    } // check that the new price is diff from the former


    if (parseFloat(req.body.newPrice) === parseFloat(order.priceOffered)) {
      return res.status(400).send({
        status: 400,
        message: 'The new offered price and the old are the same'
      });
    } // update the price and return the response


    var updatedPriceOrder = _OrderModel2["default"].updateOrderPrice(req.body.orderId, req.body.newPrice);

    return res.status(200).send({
      status: 200,
      data: updatedPriceOrder
    });
  },
  mySoldAds: function mySoldAds(req, res) {
    var userId = req.userId;

    var soldAds = _OrderModel2["default"].getSoldAdsByUser(userId);

    if (soldAds.length === 0) {
      return res.status(404).send({
        status: 404,
        message: 'You have not sold on the platform'
      });
    }

    return res.status(200).send({
      status: 200,
      data: soldAds
    });
  },
  getAllOrders: function getAllOrders(req, res) {
    var orders = _OrderModel2["default"].getAllOrders();

    if (orders < 1) {
      return res.send({
        status: 404,
        message: 'There are no orders now. Check back'
      });
    }

    return res.send({
      status: 200,
      data: orders
    });
  },

  /**
   * status could be pending, accepted (by seller), rejected(by seller),
   * completed(buyer), cancelled(buyer)
   */
  updateOrderStatus: function updateOrderStatus(req, res) {
    var reqPerson = parseInt(req.userId, 10); // get orderid

    var _req$params = req.params,
        orderId = _req$params.orderId,
        status = _req$params.status;

    if (!orderId || !status) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid input'
      });
    } // retrieve the order


    var order = _OrderModel2["default"].getOrder(orderId);

    if (!order) {
      return res.status(404).send({
        status: 404,
        message: 'Order details not found'
      });
    } // check if seller and buyer are active


    var seller = _UserModel2["default"].isUserActive('id', order.sellerId);

    var buyer = _UserModel2["default"].isUserActive('id', order.buyerId);

    if (!seller || !buyer) {
      return res.status(406).send({
        status: 406,
        message: 'Seller or buyer inactive'
      });
    } // buyer


    if (reqPerson !== parseInt(buyer.id, 10) && reqPerson !== parseInt(seller.id, 10)) {
      return res.status(403).send({
        status: 403,
        message: 'You dont have the permission to modify this resource'
      });
    }

    var updatedOrder = _OrderModel2["default"].updateOrderStatus(orderId, status);

    return res.status(200).send({
      status: 200,
      data: updatedOrder
    });
  },
  deleteAnOrder: function deleteAnOrder(req, res) {
    var order = _OrderModel2["default"].getOrder(req.params.orderId);

    if (!order) {
      return res.status(404).send({
        status: 404,
        message: 'The order does not exist'
      });
    }

    var seller = parseInt(order.sellerId, 10); // seller can deleted a cancelled order

    var requester = parseInt(req.userId, 10);

    if (requester !== seller && !req.role) {
      return res.status(403).send({
        status: 403,
        message: 'You dont have permission to delete this resource'
      });
    }

    if (order.status.toLowerCase() !== 'cancelled' && requester === seller) {
      return res.status(400).send({
        status: 400,
        message: 'You cannot delete an incomplete transaction'
      });
    }

    var deletedOrder = _OrderModel2["default"].deleteOrder(order);

    return res.status(200).send({
      status: 200,
      data: deletedOrder[0]
    });
  },
  getSingleOrder: function getSingleOrder(req, res) {
    var order = _OrderModel2["default"].getOrder(req.params.orderId);

    if (!order) {
      return res.status(404).send({
        status: 404,
        message: 'Order not found'
      });
    }

    var requester = parseInt(req.userId, 10);

    if (requester !== parseInt(order.sellerId, 10) && requester !== parseInt(order.buyerId, 10) && !req.role) {
      return res.status(403).send({
        status: 403,
        message: 'You dont have the permission to view this resource'
      });
    }

    return res.status(200).send({
      status: 200,
      data: order
    });
  }
};
exports["default"] = Order;