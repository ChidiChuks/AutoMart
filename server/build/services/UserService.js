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

var UserService =
/*#__PURE__*/
function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, null, [{
    key: "getAllUsers",
    value: function getAllUsers() {
      return _db2["default"].query('SELECT (id, email, first_name, last_name, address, is_admin, phone, status) FROM users LIMIT 50');
    }
  }, {
    key: "getUserByEmail",
    value: function getUserByEmail(email) {
      var query = 'SELECT * FROM users WHERE email=$1';
      return _db2["default"].query(query, [email]);
    }
  }, {
    key: "makeUserAdmin",
    value: function makeUserAdmin(data) {
      var text = 'UPDATE users SET is_admin=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, is_admin, phone, status';
      return _db2["default"].query(text, data);
    }
  }, {
    key: "disableUser",
    value: function disableUser(data) {
      var text = 'UPDATE users SET status=$1 WHERE id=$2 AND status=$3 RETURNING id, email, first_name, last_name, is_admin, phone, status';
      return _db2["default"].query(text, data);
    }
  }, {
    key: "selectPassword",
    value: function selectPassword(id) {
      var query = 'SELECT password FROM users WHERE id=$1';
      return _db2["default"].query(query, [id]);
    }
  }, {
    key: "updateUserPassword",
    value: function updateUserPassword(data) {
      var text = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING id, email, first_name, last_name, status';
      return _db2["default"].query(text, data);
    }
  }, {
    key: "createUser",
    value: function createUser(data) {
      var text = 'INSERT INTO users (id, email, first_name, last_name, password, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      return _db2["default"].query(text, data);
    }
  }]);

  return UserService;
}();

exports["default"] = UserService;