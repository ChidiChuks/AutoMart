"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _OrderService = require("../services/OrderService");

var _OrderService2 = _interopRequireDefault(_OrderService);

var _Util = require("../lib/Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Order = {
  create: function () {
    var _create = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var requiredParams, _ref, rows, noInDb, values, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req.body.buyer_id = req.userId;
              requiredParams = ['car_id', 'priceOffered', 'buyer_id'];

              if (!((0, _validateData2["default"])(requiredParams, req.body) || req.body.car_id.toString().length !== 13)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'Select car and state amount you want to pay'));

            case 4:
              _context.prev = 4;
              _context.next = 7;
              return _OrderService2["default"].getCarAndUsersDetails(req.body.car_id);

            case 7:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length < 1 || rows[0].carstatus.toLowerCase() !== 'available' || rows[0].sellerstatus.toLowerCase() !== 'active')) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'The car is not available or the seller is not active. Check back'));

            case 11:
              _context.next = 13;
              return _OrderService2["default"].checkOrderInDb([req.body.car_id, req.body.buyer_id]);

            case 13:
              noInDb = _context.sent;

              if (!(noInDb.rows.length > 0)) {
                _context.next = 16;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'You have a similar uncompleted/completed order '));

            case 16:
              // const text = 'INSERT INTO orders (id, buyerid, carid, sellerid, price, priceoffered) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
              // eslint-disable-next-line max-len
              values = [Date.now(), req.userId, req.body.car_id, rows[0].owner, rows[0].price, req.body.amount];
              _context.next = 19;
              return _OrderService2["default"].createOrder(values);

            case 19:
              result = _context.sent;
              return _context.abrupt("return", _Util2["default"].sendSuccess(res, 201, result.rows[0]));

            case 23:
              _context.prev = 23;
              _context.t0 = _context["catch"](4);
              return _context.abrupt("return", Order.errorResponse(res, 500, _context.t0.message));

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 23]]);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  updatePrice: function () {
    var _updatePrice = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var newPrice, buyer, _ref2, rows, tm, result;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // const requiredParams = ['orderId', 'newPrice'];
              newPrice = req.body.price; // if (validateData(requiredParams, req.body) || req.body.orderId.trim().length !== 13) {
              //     return Order.errorResponse(res, 400, 'Ensure to send the order id and new price');
              // }
              // check that the request is coming from the buyer with a different price
              // and the order is still pending

              buyer = req.userId; // const text = `SELECT price FROM orders WHERE id=${req.body.orderId} AND buyerid=${buyer} AND status NOT IN ('pending', 'cancelled')`;

              _context2.prev = 2;
              _context2.next = 5;
              return _OrderService2["default"].getOrderPrice([req.params.order_id]);

            case 5:
              _ref2 = _context2.sent;
              rows = _ref2.rows;

              if (!(rows.length !== 1 || parseFloat(rows[0].price_offered) === parseFloat(newPrice))) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", _Util2["default"].sendError(res, 400, 'Check that the order id is valid and not cancelled and your new price is different'));

            case 9:
              // update the price and return the response
              tm = new Date().toLocaleString(); // const query = `UPDATE orders SET priceoffered=${newPrice}, updated_at='${tm}' WHERE id=${req.body.orderId} AND buyerid=${buyer} returning *`;

              _context2.next = 12;
              return _OrderService2["default"].updateOrder([newPrice, tm, req.params.order_id, buyer]);

            case 12:
              result = _context2.sent;
              return _context2.abrupt("return", _Util2["default"].sendSuccess(res, 200, result.rows[0]));

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](2);
              return _context2.abrupt("return", _Util2["default"].sendError(res, 500, _context2.t0.message));

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 16]]);
    }));

    function updatePrice(_x3, _x4) {
      return _updatePrice.apply(this, arguments);
    }

    return updatePrice;
  }(),
  mySoldAds: function () {
    var _mySoldAds = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var userId, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              userId = req.userId; // const text = `SELECT * FROM orders WHERE sellerid=${userId}`;

              _context3.prev = 1;
              _context3.next = 4;
              return _OrderService2["default"].getUserOrders(userId);

            case 4:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'You do not have any transaction yet') : _Util2["default"].sendSuccess(res, 200, rows));

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", _Util2["default"].sendError(res, 500, _context3.t0.message));

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[1, 9]]);
    }));

    function mySoldAds(_x5, _x6) {
      return _mySoldAds.apply(this, arguments);
    }

    return mySoldAds;
  }(),
  getAllOrders: function () {
    var _getAllOrders = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _OrderService2["default"].getAllOrders();

            case 3:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no orders now. Check back') : _Util2["default"].sendSuccess(res, 200, rows));

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", _Util2["default"].sendError(res, 500, _context4.t0.message));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 8]]);
    }));

    function getAllOrders(_x7, _x8) {
      return _getAllOrders.apply(this, arguments);
    }

    return getAllOrders;
  }(),

  /**
   * status could be pending, accepted (by seller), rejected(by seller),
   * completed(buyer), cancelled(buyer)
   */
  updateOrderStatus: function () {
    var _updateOrderStatus = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var newStatus, orderId, reqPerson, _ref5, rows, buyer, seller, statusInDb, updatedOrder;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              newStatus = req.body.status;
              newStatus = newStatus.toLowerCase(); // get orderid

              orderId = req.params.orderId;

              if (!(!orderId || !newStatus)) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid input'));

            case 5:
              reqPerson = req.userId; // const query = `SELECT buyerid, sellerid, status FROM orders WHERE id=${orderId}`;
              // const updateQuery = `UPDATE orders SET status='${newStatus}' WHERE id=${orderId} RETURNING *`;

              _context5.prev = 6;
              _context5.next = 9;
              return _OrderService2["default"].getBuyerAndSeller(orderId);

            case 9:
              _ref5 = _context5.sent;
              rows = _ref5.rows;

              if (!(rows.length !== 1)) {
                _context5.next = 13;
                break;
              }

              return _context5.abrupt("return", _Util2["default"].sendError(res, 404, 'The order is not available'));

            case 13:
              buyer = rows[0].buyerid;
              seller = rows[0].sellerid;
              statusInDb = rows[0].status.toLowerCase();

              if (!(reqPerson !== buyer && reqPerson !== seller)) {
                _context5.next = 18;
                break;
              }

              return _context5.abrupt("return", _Util2["default"].sendError(res, 403, 'You dont have the permission to modify this resource'));

            case 18:
              if (Order.userUpdateStatus(reqPerson, buyer, newStatus, seller, statusInDb)) {
                _context5.next = 20;
                break;
              }

              return _context5.abrupt("return", _Util2["default"].sendError(res, 400, 'You cannot update the status of this order at its state'));

            case 20:
              _context5.next = 22;
              return _OrderService2["default"].updateOrderStatus([newStatus, orderId]);

            case 22:
              updatedOrder = _context5.sent;
              return _context5.abrupt("return", _Util2["default"].sendSuccess(res, 200, updatedOrder.rows[0]));

            case 26:
              _context5.prev = 26;
              _context5.t0 = _context5["catch"](6);
              return _context5.abrupt("return", _Util2["default"].sendError(res, 500, _context5.t0.message));

            case 29:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[6, 26]]);
    }));

    function updateOrderStatus(_x9, _x10) {
      return _updateOrderStatus.apply(this, arguments);
    }

    return updateOrderStatus;
  }(),
  deleteAnOrder: function () {
    var _deleteAnOrder = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var userId, role, _ref6, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(req.params.orderId.toString().length !== 13)) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return", _Util2["default"].sendError(res, 400, 'Wrong order id'));

            case 2:
              userId = req.userId, role = req.role; // const query = (role) ? `DELETE FROM orders WHERE id=${req.params.orderId} RETURNING *` :
              //     `DELETE FROM orders WHERE id=${req.params.orderId} AND sellerId=${userId} AND status='cancelled' RETURNING *`;

              _context6.prev = 3;

              if (!role) {
                _context6.next = 10;
                break;
              }

              _context6.next = 7;
              return _OrderService2["default"].adminDeleteOrder(req.params.orderId);

            case 7:
              _context6.t0 = _context6.sent;
              _context6.next = 13;
              break;

            case 10:
              _context6.next = 12;
              return _OrderService2["default"].sellerDeleteOrder([req.params.orderId, userId]);

            case 12:
              _context6.t0 = _context6.sent;

            case 13:
              _ref6 = _context6.t0;
              rows = _ref6.rows;
              return _context6.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'The order does not exist') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 18:
              _context6.prev = 18;
              _context6.t1 = _context6["catch"](3);
              return _context6.abrupt("return", _Util2["default"].sendError(res, 500, _context6.t1.message));

            case 21:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[3, 18]]);
    }));

    function deleteAnOrder(_x11, _x12) {
      return _deleteAnOrder.apply(this, arguments);
    }

    return deleteAnOrder;
  }(),
  getSingleOrder: function () {
    var _getSingleOrder = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var userId, role, _ref7, rows, result;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(req.params.orderId.toString().length !== 13)) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid order id'));

            case 2:
              userId = req.userId, role = req.role; // const query = `SELECT buyerid, sellerid FROM orders WHERE id=${req.params.orderId}`;

              _context7.prev = 3;
              _context7.next = 6;
              return _OrderService2["default"].getBuyerAndSeller(req.params.orderId);

            case 6:
              _ref7 = _context7.sent;
              rows = _ref7.rows;

              if (!(!role && rows[0].buyerid !== userId && rows[0].sellerid !== userId)) {
                _context7.next = 10;
                break;
              }

              return _context7.abrupt("return", _Util2["default"].sendError(res, 403, 'You dont have the permission to view this resource'));

            case 10:
              _context7.next = 12;
              return _OrderService2["default"].getSingleOrder(req.params.orderId);

            case 12:
              result = _context7.sent;
              return _context7.abrupt("return", result.rows.length !== 1 ? _Util2["default"].sendError(res, 404, 'Order not found') : _Util2["default"].sendSuccess(res, 200, result.rows[0]));

            case 16:
              _context7.prev = 16;
              _context7.t0 = _context7["catch"](3);
              return _context7.abrupt("return", _Util2["default"].sendError(res, 500, _context7.t0.message));

            case 19:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[3, 16]]);
    }));

    function getSingleOrder(_x13, _x14) {
      return _getSingleOrder.apply(this, arguments);
    }

    return getSingleOrder;
  }(),
  userUpdateStatus: function userUpdateStatus(reqPerson, buyer, newStatus, seller, statusInDb) {
    var sellerOptions = ['accepted', 'rejected'];
    var result = false; // buyer can cancel an accepted or rejected offer
    // buyer cannot complete a rejected offer

    if (reqPerson === buyer && newStatus === 'cancelled' && sellerOptions.includes(statusInDb)) {
      result = true;
    } else if (reqPerson === buyer && newStatus === 'completed' && statusInDb === 'accepted') {
      result = true; // seller can accept or reject a pending transaction
    } else if (reqPerson === seller && statusInDb === 'pending' && sellerOptions.includes(newStatus)) {
      result = true; // seller can change a rejected offer to accepted
    } else if (reqPerson === seller && statusInDb === 'rejected' && newStatus === 'accepted') {
      result = true;
    }

    return result;
  }
};
exports["default"] = Order;