"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _db = require("../services/db");

var _db2 = _interopRequireDefault(_db);

require("@babel/polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Order = {
  create: function () {
    var _create = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var requiredParams, query, _ref, rows, checkOrderInDb, noInDb, text, values, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req.body.buyerId = req.userId;
              requiredParams = ['carId', 'priceOffered', 'buyerId'];

              if (!((0, _validateData2["default"])(requiredParams, req.body) || req.body.carId.toString().length !== 13)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", Order.errorResponse(res, 400, 'Select car and state amount you want to pay'));

            case 4:
              query = "select cars.id, cars.status carstatus, cars.price, cars.owner, users.status sellerstatus from cars inner join users on cars.owner=users.id where cars.id=".concat(req.body.carId);
              _context.prev = 5;
              _context.next = 8;
              return _db2["default"].query(query);

            case 8:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length < 1 || rows[0].carstatus.toLowerCase() !== 'available' || rows[0].sellerstatus.toLowerCase() !== 'active' || parseInt(rows[0].owner, 10) === parseInt(req.userId, 10))) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return", Order.errorResponse(res, 400, 'The car is not available or the seller is not active. Check back'));

            case 12:
              // check that the buyer doesn't have the order in pending, accepted or completed state
              checkOrderInDb = "SELECT id FROM orders WHERE carid=".concat(req.body.carId, " AND buyerid=").concat(req.body.buyerId, " AND status NOT IN ('rejected', 'cancelled')");
              _context.next = 15;
              return _db2["default"].query(checkOrderInDb);

            case 15:
              noInDb = _context.sent;

              if (!(noInDb.rows.length > 0)) {
                _context.next = 18;
                break;
              }

              return _context.abrupt("return", Order.errorResponse(res, 400, 'You have a similar uncompleted/completed order '));

            case 18:
              text = 'INSERT INTO orders (id, buyerid, carid, sellerid, price, priceoffered) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'; // eslint-disable-next-line max-len

              values = [Date.now(), req.userId, req.body.carId, rows[0].owner, rows[0].price, req.body.priceOffered];
              _context.next = 22;
              return _db2["default"].query(text, values);

            case 22:
              result = _context.sent;
              return _context.abrupt("return", Order.successResponse(res, 201, result.rows[0]));

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](5);
              return _context.abrupt("return", Order.errorResponse(res, 500, _context.t0));

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 26]]);
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
      var requiredParams, newPrice, buyer, text, _ref2, rows, tm, query, result;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              requiredParams = ['orderId', 'newPrice'];
              newPrice = parseFloat(req.body.newPrice);

              if (!((0, _validateData2["default"])(requiredParams, req.body) || req.body.orderId.trim().length !== 13)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", Order.errorResponse(res, 400, 'Ensure to send the order id and new price'));

            case 4:
              // check that the request is coming from the buyer with a different price
              // and the order is still pending
              buyer = req.userId;
              text = "SELECT price FROM orders WHERE id=".concat(req.body.orderId, " AND buyerid=").concat(buyer, " AND status NOT IN ('pending', 'cancelled')");
              _context2.prev = 6;
              _context2.next = 9;
              return _db2["default"].query(text);

            case 9:
              _ref2 = _context2.sent;
              rows = _ref2.rows;

              if (!(rows.length !== 1 || parseFloat(rows[0].price) === parseFloat(newPrice))) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("return", Order.errorResponse(res, 400, 'Check that the order id is valid and not cancelled and your new price is different'));

            case 13:
              // update the price and return the response
              tm = new Date().toLocaleString();
              query = "UPDATE orders SET priceoffered=".concat(newPrice, ", updated_at='").concat(tm, "' WHERE id=").concat(req.body.orderId, " AND buyerid=").concat(buyer, " returning *");
              _context2.next = 17;
              return _db2["default"].query(query);

            case 17:
              result = _context2.sent;
              return _context2.abrupt("return", Order.successResponse(res, 200, result.rows[0]));

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](6);
              return _context2.abrupt("return", Order.errorResponse(res, 500, _context2.t0));

            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[6, 21]]);
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
      var userId, text, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              userId = req.userId;
              text = "SELECT * FROM orders WHERE sellerid=".concat(userId);
              _context3.prev = 2;
              _context3.next = 5;
              return _db2["default"].query(text);

            case 5:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? Order.errorResponse(res, 404, 'You do not have any transaction yet') : Order.successResponse(res, 200, rows));

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](2);
              return _context3.abrupt("return", Order.errorResponse(res, 500, _context3.t0));

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[2, 10]]);
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
      var text, _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              text = 'SELECT * FROM orders ORDER BY updated_at DESC';
              _context4.prev = 1;
              _context4.next = 4;
              return _db2["default"].query(text);

            case 4:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? Order.errorResponse(res, 404, 'There are no orders now. Check back') : Order.successResponse(res, 200, rows));

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](1);
              return _context4.abrupt("return", Order.errorResponse(res, 500, _context4.t0));

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[1, 9]]);
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
      var newStatus, orderId, reqPerson, query, updateQuery, _ref5, rows, buyer, seller, statusInDb, updatedOrder;

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

              return _context5.abrupt("return", Order.errorResponse(res, 400, 'Invalid input'));

            case 5:
              reqPerson = req.userId;
              query = "SELECT buyerid, sellerid, status FROM orders WHERE id=".concat(orderId);
              updateQuery = "UPDATE orders SET status='".concat(newStatus, "' WHERE id=").concat(orderId, " RETURNING *");
              _context5.prev = 8;
              _context5.next = 11;
              return _db2["default"].query(query);

            case 11:
              _ref5 = _context5.sent;
              rows = _ref5.rows;

              if (!(rows.length !== 1)) {
                _context5.next = 15;
                break;
              }

              return _context5.abrupt("return", Order.errorResponse(res, 404, 'The order is not available'));

            case 15:
              buyer = rows[0].buyerid;
              seller = rows[0].sellerid;
              statusInDb = rows[0].status.toLowerCase();

              if (!(reqPerson !== buyer && reqPerson !== seller)) {
                _context5.next = 20;
                break;
              }

              return _context5.abrupt("return", Order.errorResponse(res, 403, 'You dont have the permission to modify this resource'));

            case 20:
              if (Order.userUpdateStatus(reqPerson, buyer, newStatus, seller, statusInDb)) {
                _context5.next = 22;
                break;
              }

              return _context5.abrupt("return", Order.errorResponse(res, 400, 'You cannot update the status of this order at its state'));

            case 22:
              _context5.next = 24;
              return _db2["default"].query(updateQuery);

            case 24:
              updatedOrder = _context5.sent;
              return _context5.abrupt("return", Order.successResponse(res, 200, updatedOrder.rows[0]));

            case 28:
              _context5.prev = 28;
              _context5.t0 = _context5["catch"](8);
              return _context5.abrupt("return", Order.errorResponse(res, 500, _context5.t0));

            case 31:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[8, 28]]);
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
      var userId, role, query, _ref6, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(req.params.orderId.toString().length !== 13)) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return", Order.errorResponse(res, 400, 'Wrong order id'));

            case 2:
              userId = req.userId, role = req.role;
              query = role ? "DELETE FROM orders WHERE id=".concat(req.params.orderId, " RETURNING *") : "DELETE FROM orders WHERE id=".concat(req.params.orderId, " AND sellerId=").concat(userId, " AND status='cancelled' RETURNING *");
              _context6.prev = 4;
              _context6.next = 7;
              return _db2["default"].query(query);

            case 7:
              _ref6 = _context6.sent;
              rows = _ref6.rows;
              return _context6.abrupt("return", rows.length < 1 ? Order.errorResponse(res, 404, 'The order does not exist') : Order.successResponse(res, 200, rows[0]));

            case 12:
              _context6.prev = 12;
              _context6.t0 = _context6["catch"](4);
              return _context6.abrupt("return", Order.errorResponse(res, 500, _context6.t0));

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[4, 12]]);
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
      var userId, role, query, _ref7, rows, text, result;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(req.params.orderId.toString().length !== 13)) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt("return", Order.errorResponse(res, 400, 'Invalid order id'));

            case 2:
              userId = req.userId, role = req.role;
              query = "SELECT buyerid, sellerid FROM orders WHERE id=".concat(req.params.orderId);
              _context7.prev = 4;
              _context7.next = 7;
              return _db2["default"].query(query);

            case 7:
              _ref7 = _context7.sent;
              rows = _ref7.rows;

              if (!(!role && rows[0].buyerid !== userId && rows[0].sellerid !== userId)) {
                _context7.next = 11;
                break;
              }

              return _context7.abrupt("return", Order.errorResponse(res, 403, 'You dont have the permission to view this resource'));

            case 11:
              text = "SELECT * FROM orders WHERE id=".concat(req.params.orderId);
              _context7.next = 14;
              return _db2["default"].query(text);

            case 14:
              result = _context7.sent;
              return _context7.abrupt("return", result.rows.length !== 1 ? Order.errorResponse(res, 200, 'Order not found') : Order.successResponse(res, 200, result.rows[0]));

            case 18:
              _context7.prev = 18;
              _context7.t0 = _context7["catch"](4);
              return _context7.abrupt("return", Order.errorResponse(res, 500, _context7.t0));

            case 21:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[4, 18]]);
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
  },
  errorResponse: function errorResponse(res, statuscode, msg) {
    return res.status(statuscode).send({
      status: statuscode,
      message: msg
    });
  },
  successResponse: function successResponse(res, statuscode, data) {
    return res.status(statuscode).send({
      status: statuscode,
      data: data
    });
  }
};
exports["default"] = Order;