"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _usersData = _interopRequireDefault(require("../usersData"));

var _carsData = _interopRequireDefault(require("../carsData"));

var _FlagModel = _interopRequireDefault(require("../../models/FlagModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;
describe('Flag model', function () {
  describe('Create a flag', function () {
    it('should create a minor new flag', function (done) {
      var data = {
        carId: _carsData["default"][0].id,
        reason: 'Over price',
        description: 'The car has been used for more than 10 years. The price is too ridiculous',
        reportedBy: _usersData["default"][0].id
      };

      var newFlag = _FlagModel["default"].createFlag(data);

      var flags = _FlagModel["default"].flags;
      expect(newFlag).to.have.property('id');
      expect(newFlag).to.have.property('carId').eq(data.carId);
      expect(newFlag).to.have.property('status').eq('pending');
      expect(newFlag).to.have.property('reportedBy').eq(data.reportedBy);
      expect(newFlag).to.have.property('severity').eq('minor');
      expect(flags.length).to.be.greaterThan(0);
      done();
    });
    it('should create a severe flag', function (done) {
      var data = {
        carId: _carsData["default"][1].id,
        reason: 'Stolen',
        severity: 'Extreme',
        description: 'Vehicle seems stolen and reported',
        reportedBy: _usersData["default"][1].id
      };

      var newFlag = _FlagModel["default"].createFlag(data);

      var flags = _FlagModel["default"].flags;
      expect(newFlag).to.have.property('id');
      expect(newFlag).to.have.property('carId').eq(data.carId);
      expect(newFlag).to.have.property('status').eq('pending');
      expect(newFlag).to.have.property('severity').eq(data.severity);
      expect(newFlag).to.have.property('reportedBy').eq(data.reportedBy);
      expect(flags.length).to.be.greaterThan(0);
      done();
    });
  });
});