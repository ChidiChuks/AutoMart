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

var FlagService =
/*#__PURE__*/
function () {
  function FlagService() {
    _classCallCheck(this, FlagService);
  }

  _createClass(FlagService, null, [{
    key: "getAllFlags",
    value: function getAllFlags() {
      return _db2["default"].query('SELECT * FROM flags GROUP BY status, id');
    }
  }, {
    key: "deleteFlag",
    value: function deleteFlag(id) {
      var query = 'DELETE FROM flags WHERE id=$1 RETURNING *';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "updateFlag",
    value: function updateFlag(id) {
      var text = 'UPDATE flags SET status=\'resolved\' WHERE id=$1 AND status=\'pending\' RETURNING *';
      return _db2["default"].query(text, [id]);
    }
  }, {
    key: "getReportByUser",
    value: function getReportByUser(data) {
      var query = 'SELECT id FROM flags WHERE car_id=$1 AND reportedby=$2';
      return _db2["default"].query(query, data);
    }
  }, {
    key: "getCarOwner",
    value: function getCarOwner(carId) {
      var text = 'SELECT owner FROM cars WHERE id=$1 AND status=\'available\'';
      return _db2["default"].query(text, [carId]);
    }
  }, {
    key: "createNewFlag",
    value: function createNewFlag(data) {
      var text = 'INSERT INTO flags(id, car_id, reason, description, reportedby, severity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      return _db2["default"].query(text, data);
    }
  }]);

  return FlagService;
}();

exports["default"] = FlagService;