"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _validateData = require("../lib/validateData");

var _validateData2 = _interopRequireDefault(_validateData);

var _db = require("../services/db");

var _db2 = _interopRequireDefault(_db);

require("@babel/polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv2["default"].config();

_cloudinary2["default"].v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});

var Car = {
  create: function () {
    var _create = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(req, res) {
      var requiredFields, carsByUser, createQuery, values, _ref, rows, image, carPpties, newCar;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // eslint-disable-next-line max-len
              requiredFields = ['owner', 'state', 'price', 'manufacturer', 'model', 'body_type', 'description'];
              req.body.owner = req.userId;

              if (!(0, _validateData2["default"])(requiredFields, req.body || !req.file)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", Car.errorResponse(res, 400, 'Fill all required fields'));

            case 4:
              // eslint-disable-next-line max-len
              carsByUser = "SELECT id FROM cars WHERE owner=$1 AND state=$2 AND status='available' AND manufacturer=$3 AND model=$4 AND body_type=$5"; // eslint-disable-next-line no-multi-str

              createQuery = 'INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type, status) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
              _context.prev = 6;
              // eslint-disable-next-line max-len
              values = [req.body.owner, req.body.state, req.body.manufacturer, req.body.model, req.body.body_type];
              _context.next = 10;
              return _db2["default"].query(carsByUser, values);

            case 10:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length > 0)) {
                _context.next = 14;
                break;
              }

              return _context.abrupt("return", Car.errorResponse(res, 400, 'You have a similar unsold car'));

            case 14:
              _context.next = 16;
              return _cloudinary2["default"].uploader.upload(req.file.path, {
                folder: 'AutoMart/',
                format: 'jpg'
              });

            case 16:
              image = _context.sent;
              carPpties = [Date.now(), req.body.price, req.body.description, image.url].concat(values, ['available']);
              _context.next = 20;
              return _db2["default"].query(createQuery, carPpties);

            case 20:
              newCar = _context.sent;
              return _context.abrupt("return", Car.successResponse(res, 201, newCar.rows[0]));

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](6);
              return _context.abrupt("return", Car.errorResponse(res, 500, _context.t0));

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[6, 24]]);
    }));

    function create(_x, _x2) {
      return _create.apply(this, arguments);
    }

    return create;
  }(),
  getAll: function () {
    var _getAll = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(req, res) {
      var query, _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // const cars = CarModel.getAllCars();
              query = 'SELECT * FROM cars LIMIT 100';
              _context2.prev = 1;
              _context2.next = 4;
              return _db2["default"].query(query);

            case 4:
              _ref2 = _context2.sent;
              rows = _ref2.rows;

              if (!(rows.length < 1)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", Car.errorResponse(res, 404, 'There are no cars available now. Check back'));

            case 8:
              return _context2.abrupt("return", Car.successResponse(res, 200, rows));

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", Car.errorResponse(res, 500, _context2.t0));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 11]]);
    }));

    function getAll(_x3, _x4) {
      return _getAll.apply(this, arguments);
    }

    return getAll;
  }(),
  getCarsByProperty: function () {
    var _getCarsByProperty = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(req, res) {
      var reqParam, ppty, query, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              reqParam = Object.keys(req.params)[0];
              _context3.t0 = reqParam.toLowerCase();
              _context3.next = _context3.t0 === 'manufacturer' ? 4 : _context3.t0 === 'body_type' ? 6 : 8;
              break;

            case 4:
              ppty = req.params.manufacturer;
              return _context3.abrupt("break", 10);

            case 6:
              ppty = req.params.body_type;
              return _context3.abrupt("break", 10);

            case 8:
              ppty = req.params.state;
              return _context3.abrupt("break", 10);

            case 10:
              query = "SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars where status='available' AND ".concat(reqParam, "='").concat(ppty, "' LIMIT 100");
              _context3.prev = 11;
              _context3.next = 14;
              return _db2["default"].query(query);

            case 14:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? Car.errorResponse(res, 404, "There are no cars for the selected ".concat(reqParam)) : Car.successResponse(res, 200, rows));

            case 19:
              _context3.prev = 19;
              _context3.t1 = _context3["catch"](11);
              return _context3.abrupt("return", Car.errorResponse(res, 500, _context3.t1));

            case 22:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[11, 19]]);
    }));

    function getCarsByProperty(_x5, _x6) {
      return _getCarsByProperty.apply(this, arguments);
    }

    return getCarsByProperty;
  }(),
  getAllUnsoldCars: function () {
    var _getAllUnsoldCars = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(req, res) {
      var query, _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = "SELECT id, state, status, price, manufacturer, model, body_type, description, img, owner FROM cars WHERE status='available'";
              _context4.prev = 1;
              _context4.next = 4;
              return _db2["default"].query(query);

            case 4:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? Car.errorResponse(res, 404, 'There are no cars available now. Check back') : Car.successResponse(res, 200, rows));

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](1);
              return _context4.abrupt("return", Car.errorResponse(res, 500, _context4.t0));

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[1, 9]]);
    }));

    function getAllUnsoldCars(_x7, _x8) {
      return _getAllUnsoldCars.apply(this, arguments);
    }

    return getAllUnsoldCars;
  }(),
  getSingleAd: function () {
    var _getSingleAd = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5(req, res) {
      var query, _ref5, rows, car;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(req.params.id.trim().length !== 13)) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return", Car.errorResponse(res, 400, 'Invalid ad id'));

            case 2:
              query = "SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars WHERE id=".concat(req.params.id);
              _context5.prev = 3;
              _context5.next = 6;
              return _db2["default"].query(query);

            case 6:
              _ref5 = _context5.sent;
              rows = _ref5.rows;
              car = rows[0];

              if (car) {
                _context5.next = 11;
                break;
              }

              return _context5.abrupt("return", Car.errorResponse(res, 404, 'The ad you are looking for is no longer available'));

            case 11:
              return _context5.abrupt("return", Car.successResponse(res, 200, car));

            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](3);
              return _context5.abrupt("return", Car.errorResponse(res, 500, _context5.t0));

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[3, 14]]);
    }));

    function getSingleAd(_x9, _x10) {
      return _getSingleAd.apply(this, arguments);
    }

    return getSingleAd;
  }(),
  updateAdvert: function () {
    var _updateAdvert = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var reqFields, query, _ref6, rows, userId, role, text, result, updatedCar;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              reqFields = ['status', 'price', 'description'];

              if ((0, _validateData2["default"])(reqFields, req.body)) {
                Car.errorResponse(res, 400, 'Fill all fields');
              }

              query = "SELECT * FROM cars WHERE id=".concat(req.params.id);
              _context6.prev = 3;
              _context6.next = 6;
              return _db2["default"].query(query);

            case 6:
              _ref6 = _context6.sent;
              rows = _ref6.rows;

              if (!(rows.length < 1)) {
                _context6.next = 10;
                break;
              }

              return _context6.abrupt("return", Car.errorResponse(res, 404, 'The advert you want to update is not available'));

            case 10:
              userId = req.userId, role = req.role;

              if (!(parseInt(userId, 10) !== parseInt(rows[0].owner, 10) && !role)) {
                _context6.next = 13;
                break;
              }

              return _context6.abrupt("return", Car.errorResponse(res, 401, 'You do not have the permission to update this data'));

            case 13:
              // if it's seller update status, price & desc. else if its admin only the status
              // status can be available, sold or suspended;
              text = parseInt(userId, 10) === parseInt(rows[0].owner, 10) ? "UPDATE cars SET status='".concat(req.body.status, "', price=").concat(req.body.price, ", description='").concat(req.body.description, "' WHERE id=").concat(req.params.id, " RETURNING *") : "UPDATE cars SET status='".concat(req.body.status, "' WHERE id=").concat(req.params.id, " RETURNING *");
              _context6.next = 16;
              return _db2["default"].query(text);

            case 16:
              result = _context6.sent;
              updatedCar = result.rows[0];
              return _context6.abrupt("return", Car.successResponse(res, 200, updatedCar));

            case 21:
              _context6.prev = 21;
              _context6.t0 = _context6["catch"](3);
              return _context6.abrupt("return", Car.errorResponse(res, 500, _context6.t0));

            case 24:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[3, 21]]);
    }));

    function updateAdvert(_x11, _x12) {
      return _updateAdvert.apply(this, arguments);
    }

    return updateAdvert;
  }(),
  getCarsWithinPriceRange: function () {
    var _getCarsWithinPriceRange = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var min, max, query, _ref7, rows;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              min = req.query.min ? req.query.min : 0;
              max = req.query.max ? req.query.max : 30000000;
              query = "SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars where price BETWEEN ".concat(min, " AND ").concat(max);
              _context7.prev = 3;
              _context7.next = 6;
              return _db2["default"].query(query);

            case 6:
              _ref7 = _context7.sent;
              rows = _ref7.rows;
              return _context7.abrupt("return", rows.length < 1 ? Car.errorResponse(res, 404, 'There are no cars within the selected range') : Car.successResponse(res, 200, rows));

            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](3);
              return _context7.abrupt("return", Car.errorResponse(res, 500, _context7.t0));

            case 14:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[3, 11]]);
    }));

    function getCarsWithinPriceRange(_x13, _x14) {
      return _getCarsWithinPriceRange.apply(this, arguments);
    }

    return getCarsWithinPriceRange;
  }(),
  deleteAd: function () {
    var _deleteAd = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var query, _ref8, rows;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(req.params.id.trim().length !== 13)) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt("return", Car.errorResponse(res, 400, 'Select the ad to delete'));

            case 2:
              query = "DELETE FROM cars WHERE id=".concat(req.params.id, " RETURNING *");
              _context8.prev = 3;
              _context8.next = 6;
              return _db2["default"].query(query);

            case 6:
              _ref8 = _context8.sent;
              rows = _ref8.rows;
              return _context8.abrupt("return", rows.length < 1 ? Car.errorResponse(res, 404, 'Selected ad not available') : Car.successResponse(res, 200, rows[0]));

            case 11:
              _context8.prev = 11;
              _context8.t0 = _context8["catch"](3);
              return _context8.abrupt("return", Car.errorResponse(res, 500, _context8.t0));

            case 14:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this, [[3, 11]]);
    }));

    function deleteAd(_x15, _x16) {
      return _deleteAd.apply(this, arguments);
    }

    return deleteAd;
  }(),
  errorResponse: function errorResponse(res, code, message) {
    return res.status(code).send({
      status: code,
      message: message
    });
  },
  successResponse: function successResponse(res, code, data) {
    return res.status(code).send({
      status: code,
      data: data
    });
  }
};
exports["default"] = Car;