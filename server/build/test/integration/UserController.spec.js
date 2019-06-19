"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

var _UserModel = require("../../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

var _generateToken = require("../../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;
var signupUrl = '/api/v1/auth/signup';
var loginUrl = '/api/v1/auth/signin';

_chai2["default"].use(_chaiHttp2["default"]);

describe('User', function () {
  var usersArray = function usersArray() {
    _UserModel2["default"].users = _usersData2["default"];
  };

  describe('User create', function () {
    // it('should return a new user with the supplied properties', (done) => {
    //     const userDetails = {
    //         email: 'johndoe@gmail.com',
    //         first_name: 'John',
    //         last_name: 'Doe',
    //         password: 'password',
    //         password_confirmation: 'password',
    //         // address: 'my address',
    //         phone: '08136266387',
    //         // account_number: '0119260095',
    //         // bank: 'GTB',
    //     };
    //     chai.request(server).post(signupUrl).send(userDetails).end((err, res) => {
    //         expect(res.status).to.eq(201);
    //         expect(res.body.data.email).to.eq(userDetails.email);
    //         expect(res.body.data.phone).to.eq(userDetails.phone);
    //         // expect(res.body.data.address).to.eq(userDetails.address);
    //         // expect(res.body.data.account_number).to.eq(userDetails.account_number);
    //         // expect(res.body.data.bank).to.eq(userDetails.bank);
    //         done();
    //     });
    // });
    it('should return error if password and its confirmation does not match', function (done) {
      var data = {
        email: 'chidi@gmail.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'power',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Password and confirmation does not match');
        done();
      });
    });
    it('should return error if all required fields are not supplied', function (done) {
      var data = {
        email: 'chiboychuks@gmail.com',
        first_name: 'Anthonia',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields with a valid email address');
        done();
      });
    });
    it('should return error if invalid email address is supplied', function (done) {
      var data = {
        email: 'chidi.gmail.com',
        first_name: 'Karmanis',
        last_name: 'Valec',
        password: 'password',
        password_confirmation: 'password',
        // address: 'my address',
        phone: '08136266387' // account_number: '0119260095',
        // bank: 'GTB',

      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields with a valid email address');
        done();
      });
    });
    it('should return error if length of password is less than 6 characters', function (done) {
      var data = {
        email: 'Chidiebere@gmail.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'pass',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'pass'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if last name or first name or email is more than 30 characters', function (done) {
      var data = {
        email: 'justhnodhmdjdjhdkeh@akehdgdhekdhdimdhkshs.com',
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure password is atleast 6 characters, name and email not more than 30 characters');
        done();
      });
    });
    it('should return error if user email has been used', function (done) {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        first_name: 'Anthonia',
        last_name: 'Chukwuma',
        password: 'password',
        // address: 'my address',
        phone: '08136266387',
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('User with given email or phone already exist');
        done();
      });
    });
    it('should return error if given phone has been used', function (done) {
      usersArray();
      var data = {
        email: 'chiboychuks@gmail.com',
        first_name: 'John',
        last_name: 'Chuks',
        password: 'password',
        // address: 'my address',
        phone: _usersData2["default"][0].phone,
        // account_number: '0119260095',
        // bank: 'GTB',
        password_confirmation: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(signupUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('User with given email or phone already exist');
        done();
      });
    });
  }); // user sign in

  describe('User Signin', function () {
    it('should return error 400 if user did not supply password', function (done) {
      usersArray();

      _chai2["default"].request(_index2["default"]).post(loginUrl).send({
        email: 'johndoe@google.dev'
      }).then(function (res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 404 if user email is not found', function (done) {
      var data = {
        email: 'johng@gmail.com',
        password: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).then(function (res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Invalid login credentials');
        done();
      });
    });
    it('should return error 401 if password is incorrect for given email', function (done) {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        password: 'pasword'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Wrong username/password');
        done();
      });
    });
    it('should return a header with token and credentials if password and email are correct', function () {
      usersArray();
      var data = {
        email: _usersData2["default"][0].email,
        password: 'password'
      };

      _chai2["default"].request(_index2["default"]).post(loginUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res).to.have.header('x-auth');
        expect(res.body.data).to.have.property('email').eq(data.email);
      });
    });
  }); // user change password

  describe('User change password', function () {
    // it('should return user with updated password', (done) => {
    //     usersArray();
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch('/api/v1/user').set('x-auth', token)
    //         .send({ currentPassword: 'password', newPassword: 'newpassword' })
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data).to.be.an('Object');
    //             expect(res.body.data.email).to.eq(user.email);
    //             done();
    //         });
    // });
    // it('should return 400 if current password is wrong', (done) => {
    //     usersArray();
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch('/api/v1/user').set('x-auth', token)
    //         .send({ currentPassword: 'password1', newPassword: 'anotherpassword' })
    //         .end((err, res) => {
    //             expect(res.body.status).to.eq(400);
    //             expect(res.body.message).to.eq('Wrong current password, use password reset link');
    //             done();
    //         });
    // });
    // it('should return 400 if current password is not supplied', async() => {
    //     usersArray();
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch('/api/v1/user').set('x-auth', token)
    //         .send({ newPassword: 'newpassword' })
    //         .then((res) => {
    //             expect(res.status).to.eq(400);
    //             expect(res.body.message).to.eq('Fill the required fields');
    //         });
    // });
    it('should return 401 if user is not logged in', function (done) {
      usersArray();

      _chai2["default"].request(_index2["default"]).patch('/api/v1/user').send({
        currentPassword: 'password',
        newPassword: 'newpassword'
      }).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // admin get all users

  describe('get all users', function () {
    // it('should return all registered users', async() => {
    //     usersArray();
    //     const user = usersData[1];
    //     user.isAdmin = true;
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).get('/api/v1/users').set('x-auth', token).end((err, res) => {
    //         expect(res.status).to.eq(200);
    //         expect(res.body.data).to.be.an('Array');
    //     });
    // });
    // it('should return error 401 if user is not admin', async() => {
    //     usersArray();
    //     const user = usersData[1];
    //     user.isAdmin = false;
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).get('/api/v1/users').set('x-auth', token).end((err, res) => {
    //         expect(res.status).to.eq(401);
    //         expect(res.body.message).to.eq('You dont have the permission to access this resource');
    //     });
    // });
    it('should return error 401 if user is not logged in', function () {
      usersArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/users').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    });
  });
  describe('Admin make user admin', function () {
    // it('Should make a user an admin', async() => {
    //     usersArray();
    //     usersData[0].isAdmin = false;
    //     const newAdmin = usersData[0];
    //     usersData[2].isAdmin = true;
    //     const user = usersData[2];
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch(`/api/v1/user/${newAdmin.id}`).set('x-auth', token)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data).to.have.property('id').eq(newAdmin.id);
    //             // eslint-disable-next-line no-unused-expressions
    //             expect(res.body.data).to.have.property('isAdmin').to.be.true;
    //         });
    // });
    it('Should error 401 if admin is not logged in', function () {
      usersArray();
      _usersData2["default"][0].isAdmin = false;
      var newAdmin = _usersData2["default"][0];

      _chai2["default"].request(_index2["default"]).patch("/api/v1/user/".concat(newAdmin.id)).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    }); // it('Should return error 412 if user is not found', async() => {
    //     usersArray();
    //     usersData[2].isAdmin = true;
    //     const user = usersData[2];
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch('/api/v1/user/1212121212121').set('x-auth', token)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(412);
    //             expect(res.body.message).to.eq('User not found or inactive');
    //         });
    // });
    // it('Should return error 412 if user is not active', async() => {
    //     usersArray();
    //     usersData[0].isAdmin = false;
    //     usersData[0].status = 'suspended';
    //     const newAdmin = usersData[0];
    //     usersData[2].isAdmin = true;
    //     const user = usersData[2];
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).patch(`/api/v1/user/${newAdmin.id}`).set('x-auth', token)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(412);
    //             expect(res.body.message).to.eq('User not found or inactive');
    //         });
    // });
  });
  describe('User logout', function () {// it('should log a user out of the app', async() => {
    //     usersArray();
    //     const user = usersData[0];
    //     const token = await generateToken(user.id, user.isAdmin);
    //     chai.request(server).get('/api/v1/auth/logout').set('x-auth', token)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             // eslint-disable-next-line no-unused-expressions
    //             expect(res).not.to.have.header('x-auth');
    //         });
    // });
  });
});