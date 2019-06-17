"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _CarModel = require("../../models/CarModel");

var _CarModel2 = _interopRequireDefault(_CarModel);

var _carsData = require("../carsData");

var _carsData2 = _interopRequireDefault(_carsData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai2["default"].expect;
describe('Car Model', function () {
  describe('Create a car advert', function () {
    it('should create a new advert', function () {
      var newCar = _CarModel2["default"].createCar({
        owner: '158372637283904',
        state: 'new',
        status: 'available',
        price: 12000000,
        manufacturer: 'Ford',
        model: 'Ford Fiesta 2017',
        body_type: 'Sedan',
        description: 'This is the description'
      });

      expect(newCar).to.have.property('created_on');
      expect(newCar).to.have.property('id');
    });
  });
  describe('Get all adverts', function () {
    it('should return have an array of all ads', function () {
      _CarModel2["default"].cars = _carsData2["default"];

      var cars = _CarModel2["default"].getAllCars();

      expect(cars).to.be.an('Array');
      expect(cars[0]).to.have.property('id');
    });
    it('should return an empty array if there are no ads', function () {
      var cars = _CarModel2["default"].getAllCars();

      expect(cars).to.be.an('Array');
    });
  });
  describe('It should return a single ad', function () {
    it('should have an ad with the given id', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var id = _carsData2["default"][0].id;

      var res = _CarModel2["default"].findSingle(id);

      expect(res).to.be.an('Object');
      expect(res.id).to.eq(id);
    });
    it('should return undefined if there is no ad with given id', function () {
      _CarModel2["default"].cars = _carsData2["default"];

      var res = _CarModel2["default"].findSingle('1111111'); // eslint-disable-next-line no-unused-expressions


      expect(res).to.be.undefined;
    });
  });
  describe('Get unsold cars by an attribute', function () {
    it('should return all unsold cars by manufacturer', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var manufacturer = _carsData2["default"][0].manufacturer;

      var res = _CarModel2["default"].getUnsoldCarsByProperty('manufacturer', manufacturer);

      expect(res).to.be.an('Array');
    });
    it('should return all unsold cars by body type', function () {
      _CarModel2["default"].cars = _carsData2["default"]; // eslint-disable-next-line camelcase

      var body_type = _carsData2["default"][0].body_type;

      var res = _CarModel2["default"].getUnsoldCarsByProperty('body_type', body_type);

      expect(res).to.be.an('Array');
    });
    it('should return all unsold cars by state', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var state = _carsData2["default"][0].state;

      var res = _CarModel2["default"].getUnsoldCarsByProperty('state', state);

      expect(res).to.be.an('Array');
    });
  });
  describe('Get all unsold cars', function () {
    it('should return all unsold cars', function () {
      _CarModel2["default"].cars = _carsData2["default"];

      var res = _CarModel2["default"].getAllUnsoldCars();

      expect(res).to.be.an('Array');
      expect(res[0]).to.have.property('status').eq('available');
    });
  });
  describe('Complete ad update', function () {
    it('should return an ad with updated properties', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var id = _carsData2["default"][1].id;
      var data = {
        state: 'New',
        status: 'Sold',
        price: 400000,
        description: 'This is a new description'
      };

      var res = _CarModel2["default"].completeUpdate(id, data);

      expect(res.status).to.eq(data.status);
      expect(res.price).to.eq(data.price);
    });
  });
  describe('Complete update status', function () {
    it('should return an ad with status updated', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var id = _carsData2["default"][0].id;
      var data = {
        status: 'Sold'
      };

      var res = _CarModel2["default"].updateAdStatus(id, data);

      expect(res.status).to.eq(data.status);
    });
  });
  describe('Complete get cars within a price range', function () {
    it('should return cars within the given price range', function () {
      _CarModel2["default"].cars = _carsData2["default"];
      var min = 5000000;
      var max = 8000000;

      var res = _CarModel2["default"].getCarsWithinPriceRange(min, max);

      expect(res).to.be.an('Array');
    });
  });
});