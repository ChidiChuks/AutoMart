"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require("./db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OrderService =
/*#__PURE__*/
function () {
  function OrderService() {
    _classCallCheck(this, OrderService);
  }

  _createClass(OrderService, null, [{
    key: "getOrderPrice",
    value: function getOrderPrice(data) {
      var text = 'SELECT price_offered FROM orders WHERE id=$1 AND status NOT IN (\'accepted\', \'cancelled\')';
      return _db2["default"].query(text, data);
    }
  }, {
    key: "updateOrder",
    value: function updateOrder(data) {
      var query = 'UPDATE orders SET new_price_offered=$1, updated_at=$2 WHERE id=$3 AND buyer_id=$4 returning *';
      return _db2["default"].query(query, data);
    }
  }, {
    key: "getUserOrders",
    value: function getUserOrders(id) {
      var text = 'SELECT * FROM orders WHERE seller_id=$1';
      return _db2["default"].query(text, [id]);
    }
  }, {
    key: "getAllOrders",
    value: function getAllOrders() {
      return _db2["default"].query('SELECT * FROM orders ORDER BY updated_at DESC');
    }
  }, {
    key: "getBuyerAndSeller",
    value: function getBuyerAndSeller(id) {
      var query = 'SELECT buyer_id, seller_id, status FROM orders WHERE id=$1';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "updateOrderStatus",
    value: function updateOrderStatus(data) {
      var text = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
      return _db2["default"].query(text, data);
    }
  }, {
    key: "adminDeleteOrder",
    value: function adminDeleteOrder(id) {
      var query = 'DELETE FROM orders WHERE id=$1 RETURNING *';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "sellerDeleteOrder",
    value: function sellerDeleteOrder(data) {
      var query = 'DELETE FROM orders WHERE id=$1 AND seller_id=$2 AND status=\'cancelled\' RETURNING *';
      return _db2["default"].query(query, data);
    }
  }, {
    key: "getSingleOrder",
    value: function getSingleOrder(id) {
      var text = 'SELECT * FROM orders WHERE id=$1';
      return _db2["default"].query(text, [id]);
    }
  }, {
    key: "getCarAndUsersDetails",
    value: function getCarAndUsersDetails(carId) {
      var query = 'select cars.id, cars.status carstatus, cars.price, cars.owner, users.status sellerstatus from cars inner join users on cars.owner=users.id where cars.id=$1';
      return _db2["default"].query(query, [carId]);
    }
  }, {
    key: "checkOrderInDb",
    value: function () {
      var _checkOrderInDb = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(data) {
        var text;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                text = 'SELECT id FROM orders WHERE car_id=$1 AND buyer_id=$2 AND status NOT IN (\'rejected\', \'cancelled\')';
                return _context.abrupt("return", _db2["default"].query(text, data));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function checkOrderInDb(_x) {
        return _checkOrderInDb.apply(this, arguments);
      }

      return checkOrderInDb;
    }()
  }, {
    key: "createOrder",
    value: function () {
      var _createOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(data) {
        var text;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                text = 'INSERT INTO orders (id, buyer_id, car_id, seller_id, price, price_offered) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                return _context2.abrupt("return", _db2["default"].query(text, data));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createOrder(_x2) {
        return _createOrder.apply(this, arguments);
      }

      return createOrder;
    }()
  }]);

  return OrderService;
}();

exports["default"] = OrderService;