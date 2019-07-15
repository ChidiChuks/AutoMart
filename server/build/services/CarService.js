"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require("./db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CarService =
/*#__PURE__*/
function () {
  function CarService() {
    _classCallCheck(this, CarService);
  }

  _createClass(CarService, null, [{
    key: "getAllCars",
    value: function getAllCars() {
      return _db2["default"].query('SELECT * FROM cars');
    }
  }, {
    key: "getCarsInRange",
    value: function getCarsInRange(status, min, max) {
      var query = 'SELECT id, state, status, price, manufacturer, model, body_type, description, image_url FROM cars where status=$1 AND price BETWEEN $2 AND $3';
      return _db2["default"].query(query, [status, min, max]);
    }
  }, {
    key: "getCarsByProperty",
    value: function getCarsByProperty(status, reqParam, ppty) {
      var query = "SELECT id, state, status, price, manufacturer, model, body_type, description, image_url FROM cars where status=$1 AND ".concat(reqParam, "=$2 LIMIT 100");
      return _db2["default"].query(query, [status, ppty]);
    }
  }, {
    key: "getAllUnsoldCars",
    value: function getAllUnsoldCars(status) {
      var query = 'SELECT id, state, status, price, manufacturer, model, body_type, description, image_url, owner FROM cars WHERE status=$1';
      return _db2["default"].query(query, [status]);
    }
  }, {
    key: "getSingleCar",
    value: function getSingleCar(id) {
      var query = 'SELECT id, state, status, price, manufacturer, model, body_type, description, image_url FROM cars WHERE id=$1';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "deleteCar",
    value: function deleteCar(id) {
      var query = 'DELETE FROM cars WHERE id=$1 RETURNING *';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "getCarsByUser",
    value: function getCarsByUser(data) {
      var carsByUser = 'SELECT id FROM cars WHERE owner=$1 AND state=$2 AND status=\'available\' AND manufacturer=$3 AND model=$4 AND body_type=$5';
      return _db2["default"].query(carsByUser, data);
    }
  }, {
    key: "createCar",
    value: function createCar(data) {
      var createQuery = 'INSERT INTO cars (id, price, description, image_url, owner, state, manufacturer, model, body_type) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
      return _db2["default"].query(createQuery, data);
    }
  }, {
    key: "getSingleCarAllPpties",
    value: function getSingleCarAllPpties(id) {
      var query = 'SELECT * FROM cars WHERE id=$1';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "updateBySeller",
    value: function updateBySeller(data) {
      var query = 'UPDATE cars SET price=$1, description=$2, status=$3 WHERE id=$4 RETURNING *';
      return _db2["default"].query(query, data);
    }
  }, {
    key: "updateByAdmin",
    value: function updateByAdmin(data) {
      var query = 'UPDATE cars SET status=$1 WHERE id=$2 RETURNING *';
      return _db2["default"].query(query, data);
    }
  }, {
    key: "gerUserAds",
    value: function gerUserAds(userId) {
      var query = 'SELECT * FROM cars WHERE owner=$1';
      return _db2["default"].query(query, [userId]);
    }
  }]);

  return CarService;
}();

exports["default"] = CarService;