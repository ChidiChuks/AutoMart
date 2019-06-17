"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _UserModel = require("../../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;
describe('User Model', function () {
  describe('create User', function () {
    it('should create a new user', function () {
      var data = {
        name: 'Blessing Finer',
        email: 'blessing@gmail.com',
        password: 'password'
      };

      var newUser = _UserModel2["default"].create(data);

      expect(newUser).to.have.property('id');
      expect(newUser).to.have.property('email').eq(data.email);
      expect(newUser.name).to.eq(data.name);
    });
  });
  describe('Find user by given property', function () {
    it('should return a user with given property', function () {
      _UserModel2["default"].users = _usersData2["default"];

      var user = _UserModel2["default"].findByProperty('email', 'johndoe@gmail.com');

      expect(user).to.have.property('email').eq('johndoe@gmail.com');
    });
  });
  describe('Get all users', function () {
    it('should return an array of all users', function () {
      _UserModel2["default"].users = _usersData2["default"];

      var users = _UserModel2["default"].getAllUsers();

      expect(users).to.be.an('Array');
      expect(users.length).to.eq(_usersData2["default"].length);
    });
  });
  describe('Change password', function () {
    it('should modify users password', function () {
      _UserModel2["default"].users = _usersData2["default"];
      var userId = _usersData2["default"][0].id;

      var userWithUpdatedPassword = _UserModel2["default"].changePassword(userId, 'newpassword');

      expect(userWithUpdatedPassword).to.have.property('password').eq('newpassword');
    });
  });
  describe('Get User', function () {
    it('should return a user with given id', function () {
      _UserModel2["default"].users = _usersData2["default"];
      var userId = _usersData2["default"][0].id;

      var user = _UserModel2["default"].getUser(userId);

      expect(user).to.be.an('Object');
      expect(user).to.have.property('email').eq(_usersData2["default"][0].email);
    });
  });
});