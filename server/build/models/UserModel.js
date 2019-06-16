"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _usersData = _interopRequireDefault(require("../test/usersData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserModel =
/*#__PURE__*/
function () {
  function UserModel() {
    _classCallCheck(this, UserModel);

    this.users = _usersData["default"];
  }
  /**
   * @param {Object} data
   * @returns {Object}
   */


  _createClass(UserModel, [{
    key: "create",
    value: function create(data) {
      var newUser = {
        id: Math.floor(Math.random() * 100000) + 1 + Date.now(),
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        isAdmin: data.isAdmin || false,
        status: 'active'
      };
      this.users.push(newUser);
      return newUser;
    }
    /**
     * @description - function to check whether the given value already exist in the db
     * @param {string} ppty
     * @param {string} value
     * @returns {object} found user or undefined
     */

  }, {
    key: "findByProperty",
    value: function findByProperty(ppty, value) {
      return this.users.find(function (user) {
        return user[ppty] === value;
      });
    }
  }, {
    key: "getAllUsers",
    value: function getAllUsers() {
      return this.users;
    }
    /**
     * @param {Number} userid
     * @param {String} newPassword - new hashed password
     * @returns {Object}
     */

  }, {
    key: "changePassword",
    value: function changePassword(userid, newPassword) {
      var user = this.getUser(userid);
      user.password = newPassword || user.password;
      return user;
    }
    /**
     * @description - get a user
     * @param {Number} userid
     * @returns {Object}
     */

  }, {
    key: "getUser",
    value: function getUser(userid) {
      return this.users.find(function (user) {
        return user.id === parseInt(userid, 10);
      });
    }
  }]);

  return UserModel;
}();

var _default = new UserModel();

exports["default"] = _default;