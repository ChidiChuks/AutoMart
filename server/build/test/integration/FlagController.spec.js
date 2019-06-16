"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _carsData = _interopRequireDefault(require("../carsData"));

var _index = _interopRequireDefault(require("../../index"));

var _CarModel = _interopRequireDefault(require("../../models/CarModel"));

var _UserModel = _interopRequireDefault(require("../../models/UserModel"));

var _generateToken = _interopRequireDefault(require("../../lib/generateToken"));

var _usersData = _interopRequireDefault(require("../usersData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('Flags controller', function () {
  afterEach(function () {
    _CarModel["default"].cars = [];
    _UserModel["default"].users = [];
  });
  describe('Create a flag', function () {
    it('should create a flag on an ad', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData["default"][0].id,
        reason: 'Wrong Description',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('carId').eq(data.carId);
        expect(res.body.data.reason).to.eq(data.reason);
        done();
      });
    });
    it('should return error 400 if reason is not stated', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData["default"][0].id,
        reason: '',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to indicate the ad ID and reason for the report');
        done();
      });
    });
    it('should return error 400 if ad id is not stateds', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: '',
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Ensure to indicate the ad ID and reason for the report');
        done();
      });
    });
    it('should return error 404 if ad is not found', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData["default"][0] + 1,
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer active. Thank you!');
        done();
      });
    });
    it('should return error 404 if the status of the ad is not equal available', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      _carsData["default"][1].status = 'sold';
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData["default"][1],
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer active. Thank you!');
        done();
      });
    });
    it('should create an extreme flag if car is flag as stolen or fake or suspicious', function (done) {
      _carsData["default"][0].owner = _usersData["default"][1].id;
      _CarModel["default"].cars = _carsData["default"];
      _UserModel["default"].users = _usersData["default"];
      var user = _usersData["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken["default"])(user.id, user.isAdmin);
      var data = {
        carId: _carsData["default"][0].id,
        reason: 'stolen',
        description: 'Weird description of the car by the owner',
        reportedBy: user.id
      };

      _chai["default"].request(_index["default"]).post('/api/v1/flag').set('x-auth', token).send(data).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.severity).to.eq('extreme');
        done();
      });
    });
  });
});