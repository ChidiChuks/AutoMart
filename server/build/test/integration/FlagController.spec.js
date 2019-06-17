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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

describe('Flags controller', function () {
  afterEach(function () {
    _CarModel2["default"].cars = [];
    _UserModel2["default"].users = [];
  });
  describe('Create a flag', function () {
    it('should create a flag on an ad', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData2["default"][0].id,
        reason: 'Wrong Description',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('carId').eq(data.carId);
        expect(res.body.data.reason).to.eq(data.reason);
        done();
      });
    });
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
        expect(res.body.message).to.eq('Ensure to indicate the ad ID and reason for the report');
        done();
      });
    });
    it('should return error 400 if ad id is not stateds', function (done) {
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
        expect(res.body.message).to.eq('Ensure to indicate the ad ID and reason for the report');
        done();
      });
    });
    it('should return error 404 if ad is not found', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData2["default"][0] + 1,
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer active. Thank you!');
        done();
      });
    });
    it('should return error 404 if the status of the ad is not equal available', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      _carsData2["default"][1].status = 'sold';
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData2["default"][1],
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer active. Thank you!');
        done();
      });
    });
    it('should create an extreme flag if car is flag as stolen or fake or suspicious', function (done) {
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      _CarModel2["default"].cars = _carsData2["default"];
      _UserModel2["default"].users = _usersData2["default"];
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData2["default"][0].id,
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai2["default"].request(_index2["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.severity).to.eq('extreme');
        done();
      });
    });
  });
});