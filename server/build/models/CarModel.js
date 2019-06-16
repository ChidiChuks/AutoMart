"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _carsData = _interopRequireDefault(require("../test/carsData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Car =
/*#__PURE__*/
function () {
  function Car() {
    _classCallCheck(this, Car);

    this.cars = _carsData["default"];
  }
  /**
   * @description - creates a car advert
   * @params {object}
   * @return {object}
   */


  _createClass(Car, [{
    key: "createCar",
    value: function createCar(data) {
      var newCar = {
        id: Math.floor(Math.random() * 100000) + 1 + Date.now(),
        owner: data.owner || '',
        created_on: new Date().toLocaleString(),
        state: data.state || '',
        status: data.status || 'available',
        price: data.price || 0,
        manufacturer: data.manufacturer || '',
        model: data.model || '',
        body_type: data.body_type || '',
        description: data.description || '',
        img: data.img || ''
      };
      this.cars.push(newCar);
      return newCar;
    }
  }, {
    key: "getAllCars",
    value: function getAllCars() {
      return this.cars;
    }
    /**
     * @description - select cars owned by the user
     * @param {string} owner
     * @param {object} carToAdd
     * @returns {boolean}
     */

  }, {
    key: "similarUserCar",
    value: function similarUserCar(owner, carToAdd) {
      var _this = this;

      var onwerCars = [];
      var result = false;
      this.cars.forEach(function (car) {
        if (car.owner === owner) {
          onwerCars.push(car);
        }
      });

      if (onwerCars.length > 0) {
        onwerCars.find(function (car) {
          if (!_this.constructor.compareCars(car, carToAdd)) {
            result = true;
          }

          return result;
        });
      }

      return result;
    }
    /**
     * @description - return a single ad
     * @param {integer} adId
     * @returns {object}
     */

  }, {
    key: "findSingle",
    value: function findSingle(id) {
      return this.cars.find(function (car) {
        return parseInt(car.id, 10) === parseInt(id, 10);
      });
    }
    /**
     * @description - compare two selected cars
     * @param {object} car1
     * @param {object} car2
     * @returns boolean
     */

  }, {
    key: "getUnsoldCarsByProperty",

    /**
     * @description - get all unsold cars by given property - body type, manufacturer or state
     * @param {string} ppty - gotten from the req object
     * @param {string} val - gotten from the req object
     */
    value: function getUnsoldCarsByProperty(ppty, val) {
      return this.cars.filter(function (car) {
        return car.status.toLowerCase() === 'available' && car[ppty].toLowerCase() === val.toLowerCase();
      });
    }
    /**
     * @description -get all unsold cars
     * @returns {Array}
     */

  }, {
    key: "getAllUnsoldCars",
    value: function getAllUnsoldCars() {
      return this.cars.filter(function (car) {
        return car.status.toLocaleLowerCase() === 'available';
      });
    }
    /**
     * @description - update ad
     * @param {Integer} id
     * @param {Object} updateData
     * @returns {Object}
     */

  }, {
    key: "completeUpdate",
    value: function completeUpdate(id, updateData) {
      var car = this.findSingle(id);
      car.status = updateData.status || car.status;
      car.price = updateData.price || car.price;
      car.description = updateData.description || car.description;
      return car;
    }
  }, {
    key: "updateAdStatus",
    value: function updateAdStatus(id, updateData) {
      var car = this.findSingle(id);
      car.status = updateData.status || car.status;
      return car;
    }
    /**
     * @description - get cars within a price range
     * @param {Number} min
     * @param {Number} max
     * @returns {Array}
     */

  }, {
    key: "getCarsWithinPriceRange",
    value: function getCarsWithinPriceRange(min, max) {
      return this.cars.filter(function (car) {
        return parseInt(car.price, 10) >= parseInt(min, 10) && parseInt(car.price, 10) <= parseInt(max, 10);
      });
    }
    /**
     * @description - delete a car
     * @param {Object} car
     * @returns {Array} of item deleted or empty array if none is deleted
     */

  }, {
    key: "deleteCar",
    value: function deleteCar(car) {
      var addIndex = this.cars.indexOf(car);
      return this.cars.splice(addIndex, 1);
    }
  }], [{
    key: "compareCars",
    value: function compareCars(car1, car2) {
      var keysToCompare = ['state', 'status', 'manufacturer', 'model', 'body_type']; // true means not equal, false means equal

      return keysToCompare.some(function (key) {
        return car1[key] !== car2[key];
      });
    }
  }]);

  return Car;
}();

var _default = new Car();

exports["default"] = _default;