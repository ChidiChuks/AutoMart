"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _supertest = require("supertest");

var _supertest2 = _interopRequireDefault(_supertest);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var loc = _path2["default"].resolve('./');

var expect = _chai2["default"].expect;

_chai2["default"].use(_chaiHttp2["default"]);

var adUrl = '/api/v1/car';
describe('Cars', function () {
  var carsArray = function carsArray() {
    _CarModel2["default"].cars = _carsData2["default"];
  };

  var usersArray = function usersArray() {
    _UserModel2["default"].users = _usersData2["default"];
  };

  describe('Create Ad', function () {
    it('should return error 400 if request does not contain all required fields', function (done) {
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).post(adUrl).type('form').set('x-auth', token).attach('img', _path2["default"].join(loc, '/src/test/benz.jpg')).set('Content-Type', 'image/jpeg').field('status', 'available').field('price', '').field('state', 'new').field('model', 'CL550').field('manufacturer', 'Benz').field('body_type', 'car').field('description', 'This is additional description').end(function (err, res) {
        expect(res.body.status).to.eq(400);
        expect(res.body.message).to.eq('Fill all required fields');
        done();
      });
    });
    it('should return error 400 if user has the same car that is available', function (done) {
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      _carsData2["default"][0].owner = user.id;
      var data = _carsData2["default"][0];
      carsArray();

      _chai2["default"].request(_index2["default"]).post(adUrl).type('form').set('x-auth', token).attach('img', _path2["default"].join(loc, '/src/test/benz.jpg')).field('owner', data.owner).field('price', data.price).field('state', data.state).field('status', data.status).field('model', data.model).field('manufacturer', data.manufacturer).field('body_type', data.body_type).field('description', 'This is additional description').end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('You have a similar unsold car');
        done();
      });
    });
    it('should return error 400 if there is no image', function (done) {
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var data = {
        owner: _usersData2["default"][1].id,
        status: 'available',
        price: 2500000,
        state: 'new',
        model: 'cls v',
        manufacturer: 'Benz',
        body_type: 'Radar',
        description: 'The car is still new'
      };

      _chai2["default"].request(_index2["default"]).post(adUrl).set('x-auth', token).send(data).end(function (err, res) {
        expect(res.body.message).to.eq('Upload images for your product');
        expect(res.status).to.eq(400);
        done();
      });
    });
    it('should return error 401 if token is not provided', function (done) {
      var data = {
        owner: 'owner',
        status: 'available',
        price: '2.5m',
        state: 'new',
        manufacturer: 'Benz',
        body_type: 'car',
        description: 'The car is still new',
        img: 'https://mydummyimgurl.com'
      };

      _chai2["default"].request(_index2["default"]).post(adUrl).send(data).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // unsold cars according to manufacturer

  describe('view available cars by manufacturer', function () {
    var manufacturers = ['Benz', 'Toyota', 'BMW'];
    it('should return all unsold cars by a manufacturer', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/manufacturer/".concat(manufacturers[0])).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data').to.be.an('Array');
        done();
      });
    });
    it('should return a custom error if no vehicle is found for the manufacturer', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/manufacturer/Chidi').end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars for the selected manufacturer');
        done();
      });
    });
  }); // unsold cars by body type

  describe('view available cars by body type', function () {
    var bodyType = ['SUV', 'SEDAN', 'JEEP', 'PICKUP', 'VAN', 'WAGON', 'CONVERTIBLE', 'HATCHBACK'];
    it('should return all unsold cars by body type', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/bodytype/".concat(bodyType[1])).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data').to.be.an('Array');
        done();
      });
    });
    it('should return error 404 if cars of given body type are not found', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/bodytype/".concat(bodyType[2])).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars for the selected body_type');
        done();
      });
    });
  }); // view available cars by state (used, new)

  describe('view available cars by state', function () {
    var state = ['Used', 'New'];
    it('should return all available cars by state -used', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/state/".concat(state[0])).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data').to.be.an('ARRAY');
        expect(res.body.data[0]).to.have.property('state').eq('Used');
        done();
      });
    });
    it('should return all available cars by state -new', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/state/".concat(state[1])).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data').to.be.an('ARRAY');
        expect(res.body.data[0]).to.have.property('state').eq(state[1]);
        done();
      });
    });
    it('should return error 404 if cars are not found for selected state -old', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/state/old').end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars for the selected state');
        done();
      });
    });
  }); // view all unsold cars

  describe('view all available cars', function () {
    it('should return all unsold cars', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/cars/status/available').end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data').to.be.an('ARRAY');
        done();
      });
    });
    it('should return 404 when there are no unsold cars', function (done) {
      _CarModel2["default"].cars = [];

      _chai2["default"].request(_index2["default"]).get('/api/v1/cars/status/available').end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars available now. Check back');
        done();
      });
    });
  }); // get ad by id

  describe('Get ad by id', function () {
    it('should return a single ad details', function (done) {
      carsArray();
      var id = _carsData2["default"][0].id;

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/".concat(id)).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data.id).to.eq(id);
        done();
      });
    });
    it('should return error 400 with custom message if supplied id is not valid', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/12345678901').end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid ad id');
        done();
      });
    });
    it('should return error 404 with custom message if ad is not found', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/9293837414384').end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad you are looking for is no longer available');
        done();
      });
    });
  }); // seller update ad price

  describe('Seller update ad price', function () {
    it('should return the ad with updated price',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var user, token, reqData, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user = _usersData2["default"][0];
              user.isAdmin = false;
              _context.next = 4;
              return (0, _generateToken2["default"])(user.id, user.isAdmin);

            case 4:
              token = _context.sent;
              _carsData2["default"][0].owner = user.id;
              reqData = {
                id: _carsData2["default"][0].id,
                price: 2400000,
                description: 'This is to add further description'
              };
              _context.next = 9;
              return _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(reqData.adId)).set('x-auth', token).send(reqData);

            case 9:
              res = _context.sent;
              expect(res.body.data.price).to.eq(reqData.price);
              expect(res.status).to.eq(200);
              expect(res.body.data.description).to.eq(reqData.description);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));
    it('should return error 404 if ad is not found', function () {
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      _CarModel2["default"].cars = [];
      var reqData = {
        id: 8118278392839,
        price: 2400000,
        description: 'This is to add further description'
      };

      _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(reqData.adId)).set('x-auth', token).send(reqData).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The advert you want to update is not available');
      });
    });
    it('should return error 401 if another user attempts update an ad', function () {
      carsArray();
      usersArray();
      var user = _usersData2["default"][0];
      user.isAdmin = false;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var price = _carsData2["default"][0].price - 1000000;
      _carsData2["default"][0].owner = _usersData2["default"][1].id;
      var reqData = {
        id: _carsData2["default"][0].id,
        price: price,
        description: 'This is to add further description'
      };

      _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(reqData.adId)).set('x-auth', token).send(reqData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('You do not have the permission to update this data');
      });
    });
    it('should return error 401 if user is not logged in', function () {
      carsArray();
      var reqData = {
        id: _carsData2["default"][0].id,
        price: _carsData2["default"][0].price - 100,
        description: 'This is to add further description'
      };

      _chai2["default"].request(_index2["default"]).patch("/api/v1/car/".concat(reqData.adId)).send(reqData).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
      });
    });
  }); // get single ad

  describe('User can view single ad', function () {
    it('should return full details of an ad', function (done) {
      carsArray();
      var id = _carsData2["default"][0].id;

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/".concat(id)).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data.id).to.eq(id);
        done();
      });
    });
    it('should return error 404 if ad is not found', function (done) {
      carsArray();
      var id = _carsData2["default"][0].id + 1;

      _chai2["default"].request(_index2["default"]).get("/api/v1/car/".concat(id)).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad you are looking for is no longer available');
        done();
      });
    });
    it('should return error 400 if invalid ad id is supplied', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/155873165645').end(function (err, res) {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq('Invalid ad id');
        done();
      });
    });
  }); // get ads within a price range

  describe('Get ads within a price range', function () {
    it('should return an array of ads within a price range', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=5000000&max=8000000').end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('ARRAY');
        done();
      });
    });
    it('Minimum should default to 0 if not supplied', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?max=8000000').end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('ARRAY');
        done();
      });
    });
    it('Maximum should default to 24000000 if not supplied', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=2000000').end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('ARRAY');
        done();
      });
    });
    it('Should return error 404 if no ads are found in the given range', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car/price/?min=12000000&max=24000000').end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars within the selected range');
        done();
      });
    });
  }); // admin can view all ads whether sold or available

  describe('admin view all ads', function () {
    it('should return all ads', function (done) {
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      carsArray();
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/car').set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.be.an('Array');
        expect(res.body.data[0]).to.be.an('Object');
        done();
      });
    });
    it('should return error 404 if there are no ads available', function (done) {
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      _CarModel2["default"].cars = [];
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"]).get('/api/v1/car').set('x-auth', token).end(function (err, res) {
        expect(res.body.status).to.eq(404);
        expect(res.body.message).to.eq('There are no cars available now. Check back');
        done();
      });
    });
    it('should return error 401 if user is not logged in', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"]).get('/api/v1/car').end(function (err, res) {
        expect(res.body.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
  }); // admin can delete any posted ad

  describe('Admin can delete a posted ad', function () {
    it('should delete a posted ad', function (done) {
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      carsArray();
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(_carsData2["default"][0].id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Ad successfully deleted');
        done();
      });
    });
    it('should return error 401 if user is not admin or not logged in', function (done) {
      carsArray();

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(_carsData2["default"][0].id)).end(function (err, res) {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('No authorization token provided');
        done();
      });
    });
    it('should return error 404 if wrong ad id is given', function (done) {
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      carsArray();
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var id = _carsData2["default"][0].id + 1;

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer available');
        done();
      });
    });
    it('should return error 404 if ad is not available', function (done) {
      var user = _usersData2["default"][0];
      user.isAdmin = true;
      var token = (0, _generateToken2["default"])(user.id, user.isAdmin);
      var id = _carsData2["default"][0].id;
      _CarModel2["default"].cars = [];

      _chai2["default"].request(_index2["default"])["delete"]("/api/v1/car/".concat(id)).set('x-auth', token).end(function (err, res) {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('The ad is no longer available');
        done();
      });
    });
  });
});