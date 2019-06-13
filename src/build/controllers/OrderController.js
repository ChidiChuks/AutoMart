

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _CarModel = require('../models/CarModel');

const _CarModel2 = _interopRequireDefault(_CarModel);

const _UserModel = require('../models/UserModel');

const _UserModel2 = _interopRequireDefault(_UserModel);

const _OrderModel = require('../models/OrderModel');

const _OrderModel2 = _interopRequireDefault(_OrderModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Order = {
  create(req, res) {
    if (!req.body.carId || !req.body.priceOffered) {
      return res.status(412).send({
        status: 412,
        message: 'Select car and state amount you want to pay',
      });
    }
    // check whether the car id is valid
    if (req.body.carId.toString().length !== 13) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid ad id',
      });
    }

    // verify the car and its status
    const car = _CarModel2.default.findSingle(req.body.carId);
    if (!car) {
      return res.status(404).send({
        status: 404,
        message: 'This car is no longer available',
      });
    }

    if (car.status.toLowerCase() !== 'available') {
      return res.status(403).send({
        status: 403,
        message: 'The car is not available for purchase now',
      });
    }
    const buyerId = req.userId;

    const seller = _UserModel2.default.getUser(car.owner);
    if (!seller) {
      return res.status(404).send({
        status: 404,
        message: 'Unverified seller. Kindly check back',
      });
    }
    // checks if the user is active
    if (seller.status !== 'active') {
      return res.status(412).send({
        status: 412,
        message: 'The seller is not permitted transactions',
      });
    }
    const order = _OrderModel2.default.createOrder({
      buyerId,
      sellerId: car.owner,
      carId: req.body.carId,
      price: car.price,
      priceOffered: req.body.priceOffered,
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
        buyerId,
      },
    });
  },
  updatePrice(req, res) {
    // check that req contains the new price and orderid
    if (!req.body.orderId || !req.body.newPrice) {
      return res.status(400).send({
        status: 400,
        message: 'Ensure to send the order id and new price',
      });
    }
    // check that the order exist and status is still pending
    const order = _OrderModel2.default.getSingleOrder(req.body.orderId);
    if (!order || order.status.toLowerCase() !== 'pending') {
      return res.status(404).send({
        status: 404,
        message: 'Check that the order is still pending',
      });
    }

    // check that the request is coming from the buyer
    const buyer = req.userId;

    if (parseInt(buyer, 10) !== parseInt(order.buyerId, 10)) {
      return res.status(403).send({
        status: 403,
        message: 'You dont have the permission to modify this order',
      });
    }

    // check that the new price is diff from the former
    if (parseFloat(req.body.newPrice) === parseFloat(order.priceOffered)) {
      return res.status(400).send({
        status: 400,
        message: 'The new offered price and the old are the same',
      });
    }
    // update the price and return the response
    const updatedPriceOrder = _OrderModel2.default.updateOrderPrice(req.body.orderId, req.body.newPrice);
    return res.status(200).send({
      status: 200,
      data: updatedPriceOrder,
    });
  },
};

exports.default = Order;
