"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _UserModel = _interopRequireDefault(require("../../models/UserModel"));

var _usersData = _interopRequireDefault(require("../usersData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;
describe('User Model', function () {
  describe('create User', function () {
    it('should create a new user', function () {
      var data = {
        name: 'Blessing Finer',
        email: 'blessing@gmail.com',
        password: 'password'
      };

      var newUser = _UserModel["default"].create(data);

      expect(newUser).to.have.property('id');
      expect(newUser).to.have.property('email').eq(data.email);
      expect(newUser.name).to.eq(data.name);
    });
  });
  describe('Find user by given property', function () {
    it('should return a user with given property', function () {
      _UserModel["default"].users = _usersData["default"];

      var user = _UserModel["default"].findByProperty('email', 'johndoe@gmail.com');

      expect(user).to.have.property('email').eq('johndoe@gmail.com');
    });
  });
  describe('Get all users', function () {
    it('should return an array of all users', function () {
      _UserModel["default"].users = _usersData["default"];

      var users = _UserModel["default"].getAllUsers();

      expect(users).to.be.an('Array');
      expect(users.length).to.eq(_usersData["default"].length);
    });
  });
  describe('Change password', function () {
    it('should modify users password', function () {
      _UserModel["default"].users = _usersData["default"];
      var userId = _usersData["default"][0].id;

      var userWithUpdatedPassword = _UserModel["default"].changePassword(userId, 'newpassword');

      expect(userWithUpdatedPassword).to.have.property('password').eq('newpassword');
    });
  });
  describe('Get User', function () {
    it('should return a user with given id', function () {
      _UserModel["default"].users = _usersData["default"];
      var userId = _usersData["default"][0].id;

      var user = _UserModel["default"].getUser(userId);

      expect(user).to.be.an('Object');
      expect(user).to.have.property('email').eq(_usersData["default"][0].email);
    });
  });
});