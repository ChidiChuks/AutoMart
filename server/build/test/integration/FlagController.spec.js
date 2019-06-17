"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _carsData = require("../carsData");

var _carsData2 = _interopRequireDefault(_carsData);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

var _CarModel = require("../../models/CarModel");

var _CarModel2 = _interopRequireDefault(_CarModel);

var _UserModel = require("../../models/UserModel");

var _UserModel2 = _interopRequireDefault(_UserModel);

var _generateToken = require("../../lib/generateToken");

var _generateToken2 = _interopRequireDefault(_generateToken);

var _usersData = require("../usersData");

var _usersData2 = _interopRequireDefault(_usersData);

var _flagsData = require("../flagsData");

var _flagsData2 = _interopRequireDefault(_flagsData);

var _FlagModel = require("../../models/FlagModel");

var _FlagModel2 = _interopRequireDefault(_FlagModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

describe('Flags controller', function () {
  describe('Create a flag', function () {
    // it('should create a flag on an ad', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         carId: carsData[0].id,
    //         reason: 'Wrong Description',
    //         description: 'The car description is misleading',
    //         reportedBy: user.id,
    //     };
    //     chai.request(server).post('/api/v1/flag').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data).to.have.property('id');
    //             expect(res.body.data).to.have.property('carId').eq(data.carId);
    //             expect(res.body.data.reason).to.eq(data.reason);
    //             expect(res.body.message).to.eq('Ok. Flag has been created');
    //             done();
    //         });
    // });
    it('should return error 400 if reason is not stated', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData2["default"][0].id,
        reason: '',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to indicate the ad id and reason for the report');
        done();
      });
    });
    it('should return error 400 if ad id is not stated', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: '',
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to indicate the ad id and reason for the report');
        done();
      });
    }); // it('should return error 404 if ad is not found', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         carId: carsData[0] + 1,
    //         reason: 'stolen',
    //         description: 'Weird description of the car by the owner',
    //         reportedBy: user.id,
    //     };
    //     chai.request(server).post('/api/v1/flag').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(404);
    //             expect(res.body.message).to.eq('The ad is no longer active. Thank you.');
    //             done();
    //         });
    // });
    // it('should return error 404 if the status of the ad is not equal available', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     carsData[1].status = 'sold';
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         carId: carsData[1],
    //         reason: 'stolen',
    //         description: 'Weird description of the car by the owner',
    //         reportedBy: user.id,
    //     };
    //     chai.request(server).post('/api/v1/flag').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(404);
    //             expect(res.body.message).to.eq('The ad is no longer active. Thank you.');
    //             done();
    //         });
    // });
    // it('should create an extreme flag if car is flag as stolen or fake or suspicious', (done) => {
    //     carsData[0].owner = usersData[1].id;
    //     CarModel.cars = carsData;
    //     UserModel.users = usersData;
    //     const user = usersData[0];
    //     user.isAdmin = false;
    //     const token = generateToken(user.id, user.isAdmin);
    //     const data = {
    //         carId: carsData[0].id,
    //         reason: 'stolen',
    //         description: 'Weird description of the car by the owner',
    //         reportedBy: user.id,
    //     };
    //     chai.request(server).post('/api/v1/flag').set('x-auth', token).send(data)
    //         .end((err, res) => {
    //             expect(res.status).to.eq(200);
    //             expect(res.body.data.severity).to.eq('extreme');
    //             done();
    //         });
    // });
  });
  describe('Update a flag', function () {
    it('should update a flag status to resolved', function () {
      _flagsData2["default"][0].status = 'pending';
      var id = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        expect(res.body.data.status).to.eq('resolved');
      });
    });
    it('should return error 401 if user is not logged in', function () {
      _flagsData2["default"][0].status = 'pending';
      var id = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];

      _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(id)).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    });
    it('should return error 401 if logged in user is not admin', function () {
      _flagsData2["default"][0].status = 'pending';
      var id = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('You dont have the permission to access this resource');
      });
    });
    it('should return error 404 if flag id is wrong', function () {
      _flagsData2["default"][0].status = 'pending';
      var id = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).patch("/api/v1/flag/".concat(id + 1)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('Flag not found');
      });
    });
  });
  describe('Get all flags', function () {
    it('should return all flags', function (done) {
      var user = _usersData2["default"][0];
      _FlagModel2["default"].flags = _flagsData2["default"];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/flags').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('Array');
        expect(res.body.data[0]).to.be.an('Object');
        done();
      });
    });
    it('should return error 404 if there are no flags', function (done) {
      var user = _usersData2["default"][0];
      _FlagModel2["default"].flags = [];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/flags').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no flags now.');
        done();
      });
    });
    it('should return error 401 if user is not logged in', function (done) {
      _FlagModel2["default"].flags = _flagsData2["default"];

      _chai2["default"].request(_index2["default"]).get('/api/v1/flags').end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 401 if user is not admin', function (done) {
      var user = _usersData2["default"][0];
      _FlagModel2["default"].flags = _flagsData2["default"];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/flags').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('You dont have the permission to access this resource');
        done();
      });
    });
  });
  describe('Admin can delete a given flag', function () {
    it('should delete a given flag id', function (done) {
      var user = _usersData2["default"][0];
      var flagId = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/flags/".concat(flagId)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Flag successfully deleted');
        done();
      });
    });
    it('should return error 404 if flag is not found', function (done) {
      var user = _usersData2["default"][0];
      var flagId = _flagsData2["default"][0].id + 1;
      _FlagModel2["default"].flags = _flagsData2["default"];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/flags/".concat(flagId)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The flag is no longer available');
        done();
      });
    });
    it('should return error 401 if user is not logged in', function (done) {
      var flagId = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/flags/".concat(flagId)).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 401 if user is not admin', function (done) {
      var user = _usersData2["default"][0];
      var flagId = _flagsData2["default"][0].id;
      _FlagModel2["default"].flags = _flagsData2["default"];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/flags/".concat(flagId)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('You dont have the permission to access this resource');
        done();
      });
    });
  });
});