"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _CarModel = _interopRequireDefault(require("../models/CarModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

_cloudinary["default"].v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});

var Car = {
  create: function () {
    var _create = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var owner, newCarData, checkInDb, image, newCar;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.body.manufacturer || !req.body.state || !req.body.status || !req.body.price || !req.body.model || !req.body.body_type)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Fill all required fields'
              }));

            case 2:
              owner = req.userId;
              newCarData = {
                owner: owner,
                state: req.body.state,
                status: req.body.status,
                price: req.body.price,
                manufacturer: req.body.manufacturer,
                model: req.body.model,
                body_type: req.body.body_type,
                description: req.body.description
              };
              checkInDb = _CarModel["default"].similarUserCar(owner, newCarData);

              if (!checkInDb) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'You have a similar unsold car'
              }));

            case 7:
              if (req.file) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'Upload images for your product'
              }));

            case 9:
              _context.prev = 9;
              _context.next = 12;
              return _cloudinary["default"].uploader.upload(req.file.path, {
                folder: 'automart/',
                format: 'png'
              });

            case 12:
              image = _context.sent;
              newCarData.img = image.url;
              newCar = _CarModel["default"].createCar(newCarData);
              return _context.abrupt("return", res.status(201).send({
                status: 201,
                data: newCar
              }));

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](9);
              return _context.abrupt("return", res.status(400).send({
                status: 400,
                message: 'There\'s problem uploading your image, try again'
              }));

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[9, 18]]);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  getAll: function getAll(req, res) {
    var cars = _CarModel["default"].getAllCars();

    if (cars.length < 1) {
      return res.send({
        status: 404,
        message: 'There are no cars available now. Check back'
      });
    }

    return res.send({
      status: 200,
      data: cars
    });
  },
  getCarsByProperty: function getCarsByProperty(req, res) {
    var reqParam = Object.keys(req.params)[0];
    var cars;

    if (reqParam.toLowerCase() === 'manufacturer') {
      cars = _CarModel["default"].getUnsoldCarsByProperty(reqParam, req.params.manufacturer);
    } else if (reqParam.toLowerCase() === 'body_type') {
      cars = _CarModel["default"].getUnsoldCarsByProperty(reqParam, req.params.body_type);
    } else {
      cars = _CarModel["default"].getUnsoldCarsByProperty(reqParam, req.params.state);
    }

    if (cars.length < 1) {
      return res.status(404).send({
        status: 404,
        message: "There are no cars for the selected ".concat(reqParam)
      });
    }

    return res.status(200).send({
      status: 'success',
      data: cars
    });
  },
  getAllUnsoldCars: function getAllUnsoldCars(req, res) {
    var cars = _CarModel["default"].getAllUnsoldCars();

    if (cars.length < 1) {
      return res.status(404).send({
        status: 404,
        message: 'There are no cars available now. Check back'
      });
    }

    return res.status(200).send({
      status: 200,
      data: cars
    });
  },
  getSingleAd: function getSingleAd(req, res) {
    if (req.params.id.trim().length !== 13) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid ad id'
      });
    }

    var car = _CarModel["default"].findSingle(req.params.id);

    if (!car) {
      return res.status(404).send({
        status: 404,
        message: 'The ad you are looking for is no longer available'
      });
    }

    return res.status(200).send({
      status: 200,
      data: car
    });
  },
  updateAdvert: function updateAdvert(req, res) {
    var car = _CarModel["default"].findSingle(req.body.id);

    if (!car) {
      return res.status(404).send({
        status: 404,
        message: 'The advert you want to update is not available'
      });
    }

    var userId = req.userId,
        role = req.role;

    if (parseInt(userId, 10) !== parseInt(car.owner, 10) && !role) {
      return res.status(401).send({
        status: 401,
        message: 'You do not have the permission to update this data'
      });
    }

    var updatedCar;

    if (parseInt(userId, 10) === parseInt(car.owner, 10)) {
      updatedCar = _CarModel["default"].completeUpdate(req.body.id, req.body);
    } else {
      updatedCar = _CarModel["default"].updateAdStatus(req.body.id, req.body);
    }

    return res.status(200).send({
      status: 200,
      data: updatedCar
    });
  },
  getCarsWithinPriceRange: function getCarsWithinPriceRange(req, res) {
    var min = req.query.min ? req.query.min : 0;
    var max = req.query.max ? req.query.max : 3000000;

    var cars = _CarModel["default"].getCarsWithinPriceRange(min, max);

    if (cars.length < 1) {
      return res.status(404).send({
        status: 404,
        message: 'There are no cars within the selected range'
      });
    }

    return res.status(200).send({
      status: 200,
      data: cars
    });
  },
  deleteAd: function deleteAd(req, res) {
    if (!req.params.id) {
      return res.status(400).send({
        status: 400,
        message: 'Invalid request'
      });
    }

    var car = _CarModel["default"].findSingle(req.params.id);

    if (!car) {
      return res.status(404).send({
        status: 404,
        message: 'The ad is no longer available'
      });
    }

    var deleteACarAd = _CarModel["default"].deleteCar(car);

    if (deleteACarAd.length < 1) {
      return res.status(500).send({
        status: 500,
        message: 'Ad not deleted, please retry'
      });
    }

    return res.status(200).send({
      status: 200,
      message: 'Ad successfully deleted'
    });
  }
};
var _default = Car;
exports["default"] = _default;