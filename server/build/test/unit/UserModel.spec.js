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
  describe('create User', function () {// it('should create a new user', () => {
    //     const data = {
    //         email: 'johndoe@gmail.com',
    //         first_name: 'John',
    //         last_name: 'Doe',
    //         password: 'password',
    //         // address: 'my address',
    //         isAdmin: false,
    //         phone: '08136266387',
    //         // account_number: '0119260095',
    //         // bank: 'GTB',
    //     };
    //     const newUser = UserModel.create(data);
    //     expect(newUser).to.have.property('id');
    //     expect(newUser).to.have.property('email').eq(data.email);
    //     expect(newUser.last_name).to.eq(data.last_name);
    // });
  });
  describe('Find user by given property', function () {
    it('should return a user with given property', function () {
      _UserModel2["default"].users = _usersData2["default"];

      var user = _UserModel2["default"].findByProperty('email', 'johndoe@gmail.com');

      expect(user).to.have.property('email').eq('johndoe@gmail.com');
      expect(user).to.have.property('first_name').to.eq('John');
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
      expect(user).to.have.property('first_name').eq(_usersData2["default"][0].first_name);
    });
  });
  describe('Make User Admin', function () {
    it('should make a user an admin', function () {
      _UserModel2["default"].users = _usersData2["default"];
      _usersData2["default"][0].isAdmin = false;
      var userId = _usersData2["default"][0].id;

      var newAdmin = _UserModel2["default"].makeUserAdmin(userId);

      expect(newAdmin).to.be.an('Object'); // eslint-disable-next-line no-unused-expressions

      expect(newAdmin.isAdmin).to.be["true"];
    });
  });
  describe('Check if user is active', function () {
    it('should return user if user is active', function () {
      _usersData2["default"][0].status = 'active';
      _UserModel2["default"].users = _usersData2["default"];

      var user = _UserModel2["default"].isUserActive('id', _usersData2["default"][0].id);

      expect(user.id).to.eq(_usersData2["default"][0].id);
      expect(user).to.be.an('Object');
    });
  });
  describe('Disable User', function () {
    it('should disable an active user', function () {
      _usersData2["default"][0].status = 'active';
      _UserModel2["default"].users = _usersData2["default"];

      var disabledUser = _UserModel2["default"].disableUser(_usersData2["default"][0].id);

      expect(disabledUser.id).to.eq(_usersData2["default"][0].id);
      expect(disabledUser.status).to.eq('disabled');
    });
  });
});