"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OrderModel =
/*#__PURE__*/
function () {
  function OrderModel() {
    _classCallCheck(this, OrderModel);

    this.orders = [];
  }
  /**
   * @description - create a new order
   * @param {Object} data
   * @returns {Object}
   */


  _createClass(OrderModel, [{
    key: "createOrder",
    value: function createOrder(data) {
      var newOrder = {
        id: Date.now(),
        buyerId: data.buyerId,
        carId: data.carId,
        sellerId: data.sellerId,
        price: data.price || 0,
        status: data.status || 'pending',
        date: new Date().toLocaleString(),
        priceOffered: data.priceOffered,
        deliveredDate: data.deliveredDate || new Date().toLocaleString()
      };
      this.orders.push(newOrder);
      return newOrder;
    }
    /**
     * @param {Number} orderId
     * @param {Number} newPrice
     * @returns {Object}
     */

  }, {
    key: "updateOrderPrice",
    value: function updateOrderPrice(orderId, newPrice) {
      var order = this.getOrder(orderId);
      order.priceOffered = parseFloat(newPrice);
      return order;
    }
    /**
     * @param {Number} orderId
     * @returns {Object}
     */

  }, {
    key: "getOrder",
    value: function getOrder(orderId) {
      return this.orders.find(function (order) {
        return parseInt(order.id, 10) === parseInt(orderId, 10);
      });
    }
  }, {
    key: "getSoldAdsByUser",
    value: function getSoldAdsByUser(userId) {
      return this.orders.filter(function (order) {
        return order.status === 'completed' && parseInt(order.sellerId, 10) === parseInt(userId, 10);
      });
    }
  }, {
    key: "getAllOrders",
    value: function getAllOrders() {
      return this.orders;
    }
  }, {
    key: "updateOrderStatus",
    value: function updateOrderStatus(orderId, status) {
      var order = this.getOrder(orderId);
      order.status = status || order.status;
      return order;
    }
  }, {
    key: "deleteOrder",
    value: function deleteOrder(order) {
      var orderIndex = this.orders.indexOf(order);
      return this.orders.splice(orderIndex, 1);
    }
  }]);

  return OrderModel;
}();

var _default = new OrderModel();

exports["default"] = _default;