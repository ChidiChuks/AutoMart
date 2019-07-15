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

var _CarService = require("../services/CarService");

var _CarService2 = _interopRequireDefault(_CarService);

var _Util = require("../lib/Util");

var _Util2 = _interopRequireDefault(_Util);

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
      var requiredFields, values, _ref, rows, image, carPpties, newCar;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // eslint-disable-next-line max-len
              requiredFields = ['state', 'price', 'manufacturer', 'model', 'body_type', 'description'];
              req.body.owner = req.userId;

              if (!(0, _validateData2["default"])(requiredFields, req.body)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'Fill all required fields'));

            case 4:
              // const carsByUser = `SELECT id FROM cars WHERE owner=$1 AND state=$2 AND status='available' AND manufacturer=$3 AND model=$4 AND body_type=$5`;
              // eslint-disable-next-line no-multi-str
              // const createQuery = 'INSERT INTO cars (id, price, description, img, owner, state, manufacturer, model, body_type, status) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
              // eslint-disable-next-line max-len
              values = [req.body.owner, req.body.state, req.body.manufacturer, req.body.model, req.body.body_type];
              _context.prev = 5;
              _context.next = 8;
              return _CarService2["default"].query(carsByUser, values);

            case 8:
              _ref = _context.sent;
              rows = _ref.rows;

              if (!(rows.length > 0)) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return", _Util2["default"].sendError(res, 400, 'You have a similar unsold car'));

            case 12:
              if (!req.file) {
                _context.next = 18;
                break;
              }

              _context.next = 15;
              return _cloudinary2["default"].uploader.upload(req.file.path, {
                folder: 'automart/',
                format: 'jpg'
              });

            case 15:
              _context.t0 = _context.sent;
              _context.next = 19;
              break;

            case 18:
              _context.t0 = {
                url: req.img_url
              };

            case 19:
              image = _context.t0;
              carPpties = [Date.now(), req.body.price, req.body.description, image.url].concat(values);
              _context.next = 23;
              return _CarService2["default"].createCar(carPpties);

            case 23:
              newCar = _context.sent;
              return _context.abrupt("return", _Util2["default"].sendSuccess(res, 201, newCar.rows[0]));

            case 27:
              _context.prev = 27;
              _context.t1 = _context["catch"](5);
              return _context.abrupt("return", _Util2["default"].sendError(res, 500, _context.t1.message));

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 27]]);
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
              return _CarService2["default"].getAllCars();

            case 4:
              _ref2 = _context2.sent;
              rows = _ref2.rows;

              if (!(rows.length < 1)) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back'));

            case 8:
              return _context2.abrupt("return", _Util2["default"].sendSuccess(res, 200, rows));

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](1);
              return _context2.abrupt("return", _Util2["default"].sendError(res, 500, _context2.t0.message));

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
      var reqParam, ppty, _ref3, rows;

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
              _context3.prev = 10;
              _context3.next = 13;
              return _CarService2["default"].getCarsByProperty('available', reqParam, ppty);

            case 13:
              _ref3 = _context3.sent;
              rows = _ref3.rows;
              return _context3.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, "There are no cars for the selected ".concat(reqParam)) : _Util2["default"].sendSuccess(res, 200, rows));

            case 18:
              _context3.prev = 18;
              _context3.t1 = _context3["catch"](10);
              return _context3.abrupt("return", _Util2["default"].sendError(res, 500, _context3.t1.message));

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[10, 18]]);
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
      var _ref4, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _CarService2["default"].getAllUnsoldCars();

            case 3:
              _ref4 = _context4.sent;
              rows = _ref4.rows;
              return _context4.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back') : _Util2["default"].sendSuccess(res, 200, rows));

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", _Util2["default"].sendError(res, 500, _context4.t0.message));

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 8]]);
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
      var _ref5, rows;

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
              _context5.prev = 2;
              _context5.next = 5;
              return _CarService2["default"].getSingleCar(req.params.id);

            case 5:
              _ref5 = _context5.sent;
              rows = _ref5.rows;
              return _context5.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'The ad you are looking for is no longer available') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](2);
              return _context5.abrupt("return", _Util2["default"].sendError(res, 500, _context5.t0.message));

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[2, 10]]);
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
      var reqFields, _ref6, rows, userId, role, adminQ, data, result;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              reqFields = ['status', 'price', 'description'];

              if ((0, _validateData2["default"])(reqFields, req.body)) {
                _Util2["default"].sendError(res, 400, 'Fill all fields');
              } // const query = `SELECT * FROM cars WHERE id=${req.params.id}`;


              _context6.prev = 2;
              _context6.next = 5;
              return _CarService2["default"].getSingleCarAllPpties(req.params.id);

            case 5:
              _ref6 = _context6.sent;
              rows = _ref6.rows;

              if (!(rows.length < 1)) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return", _Util2["default"].sendError(res, 404, 'The advert you want to update is not available'));

            case 9:
              userId = req.userId, role = req.role;

              if (!(parseInt(userId, 10) !== parseInt(rows[0].owner, 10) && !role)) {
                _context6.next = 12;
                break;
              }

              return _context6.abrupt("return", _Util2["default"].sendError(res, 401, 'You do not have the permission to update this data'));

            case 12:
              adminQ = [req.body.status, req.params.id];
              data = [req.body.price, req.body.description].concat(adminQ); // if it's seller update status, price & desc. else if its admin only the status
              // status can be available, sold or suspended;
              // const text = (parseInt(userId, 10) === parseInt(rows[0].owner, 10)) ?
              //     `UPDATE cars SET status='${req.body.status}', price=${req.body.price}, description='${req.body.description}' WHERE id=${req.params.id} RETURNING *` :
              //     `UPDATE cars SET status='${req.body.status}' WHERE id=${req.params.id} RETURNING *`;

              if (!(parseInt(userId, 10) === parseInt(rows[0].owner, 10))) {
                _context6.next = 20;
                break;
              }

              _context6.next = 17;
              return _CarService2["default"].updateBySeller(data);

            case 17:
              _context6.t0 = _context6.sent;
              _context6.next = 23;
              break;

            case 20:
              _context6.next = 22;
              return _CarService2["default"].updateByAdmin(adminQ);

            case 22:
              _context6.t0 = _context6.sent;

            case 23:
              result = _context6.t0;
              return _context6.abrupt("return", _Util2["default"].sendSuccess(res, 200, result.rows[0]));

            case 27:
              _context6.prev = 27;
              _context6.t1 = _context6["catch"](2);
              return _context6.abrupt("return", _Util2["default"].sendError(res, 500, _context6.t1.message));

            case 30:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[2, 27]]);
    }));

    function updateAdvert(_x11, _x12) {
      return _updateAdvert.apply(this, arguments);
    }

    return updateAdvert;
  }(),
  getCars: function () {
    var _getCars = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var params, paramsArray, paramsLength, min, max, _ref7, rows, reqParam, ppty, _ref8, _rows, _ref9, _rows2;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              params = req.query;
              paramsArray = Object.keys(params);
              paramsLength = Object.keys(params).length;
              _context7.prev = 3;

              if (!(paramsLength === 3 && JSON.stringify(paramsArray) === JSON.stringify(['status', 'min_price', 'max_price']))) {
                _context7.next = 12;
                break;
              }

              min = req.query.min_price ? req.query.min_price : 0;
              max = req.query.max_price ? req.query.max_price : 30000000; // console.log(min);

              _context7.next = 9;
              return _CarService2["default"].getCarsInRange(req.query.status, min, max);

            case 9:
              _ref7 = _context7.sent;
              rows = _ref7.rows;
              return _context7.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars within the selected range') : _Util2["default"].sendSuccess(res, 200, rows));

            case 12:
              if (!(paramsLength === 2)) {
                _context7.next = 28;
                break;
              }

              reqParam = Object.keys(req.query)[1];
              _context7.t0 = reqParam.toLowerCase();
              _context7.next = _context7.t0 === 'manufacturer' ? 17 : _context7.t0 === 'body_type' ? 19 : 21;
              break;

            case 17:
              ppty = req.query.manufacturer;
              return _context7.abrupt("break", 23);

            case 19:
              ppty = req.query.body_type;
              return _context7.abrupt("break", 23);

            case 21:
              ppty = req.query.state;
              return _context7.abrupt("break", 23);

            case 23:
              _context7.next = 25;
              return _CarService2["default"].getCarsByProperty(req.query.status, reqParam, ppty);

            case 25:
              _ref8 = _context7.sent;
              _rows = _ref8.rows;
              return _context7.abrupt("return", _rows.length < 1 ? _Util2["default"].sendError(res, 404, "There are no cars for the selected ".concat(reqParam)) : _Util2["default"].sendSuccess(res, 200, _rows));

            case 28:
              if (!(paramsLength === 1)) {
                _context7.next = 34;
                break;
              }

              _context7.next = 31;
              return _CarService2["default"].getAllUnsoldCars(req.query.status);

            case 31:
              _ref9 = _context7.sent;
              _rows2 = _ref9.rows;
              return _context7.abrupt("return", _rows2.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back') : _Util2["default"].sendSuccess(res, 200, _rows2));

            case 34:
              return _context7.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid query parameters'));

            case 37:
              _context7.prev = 37;
              _context7.t1 = _context7["catch"](3);
              return _context7.abrupt("return", _Util2["default"].sendError(res, 500, _context7.t1.message));

            case 40:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[3, 37]]);
    }));

    function getCars(_x13, _x14) {
      return _getCars.apply(this, arguments);
    }

    return getCars;
  }(),
  // async getCarsWithinPriceRange(req, res) {
  //     const min = req.query.min ? req.query.min : 0;
  //     const max = req.query.max ? req.query.max : 30000000;
  //     const query = `SELECT id, state, status, price, manufacturer, model, body_type, description, img FROM cars where price BETWEEN ${min} AND ${max}`;
  //     try {
  //         const { rows } = await db.query(query);
  //         return (rows.length < 1) ? Car.errorResponse(res, 404, 'There are no cars within the selected range') :
  //             Car.successResponse(res, 200, rows);
  //     } catch (err) {
  //         return Car.errorResponse(res, 500, err);
  //     }
  // },
  deleteAd: function () {
    var _deleteAd = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var _ref10, rows;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(req.params.car_id.trim().length !== 13)) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt("return", _Util2["default"].sendError(res, 400, 'Select the ad to delete'));

            case 2:
              _context8.prev = 2;
              _context8.next = 5;
              return _CarService2["default"].deleteCar(req.params.car_id);

            case 5:
              _ref10 = _context8.sent;
              rows = _ref10.rows;
              return _context8.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'Selected ad not available') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8["catch"](2);
              return _context8.abrupt("return", _Util2["default"].sendError(res, 500, _context8.t0.message));

            case 13:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this, [[2, 10]]);
    }));

    function deleteAd(_x15, _x16) {
      return _deleteAd.apply(this, arguments);
    }

    return deleteAd;
  }(),
  getMyAds: function () {
    var _getMyAds = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(req, res) {
      var userId, _ref11, rows;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              userId = req.userId;
              _context9.prev = 1;
              _context9.next = 4;
              return _CarService2["default"].gerUserAds(userId);

            case 4:
              _ref11 = _context9.sent;
              rows = _ref11.rows;
              return _context9.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'You do not have ads yet') : _Util2["default"].sendSuccess(res, 200, rows));

            case 9:
              _context9.prev = 9;
              _context9.t0 = _context9["catch"](1);
              return _context9.abrupt("return", _Util2["default"].sendError(res, 500, _context9.t0.message));

            case 12:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this, [[1, 9]]);
    }));

    function getMyAds(_x17, _x18) {
      return _getMyAds.apply(this, arguments);
    }

    return getMyAds;
  }()
};
exports["default"] = Car;