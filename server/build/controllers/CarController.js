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
              // eslint-disable-next-line max-len
              values = [req.body.owner, req.body.state, req.body.manufacturer, req.body.model, req.body.body_type];
              _context.prev = 5;
              _context.next = 8;
              return _CarService2["default"].getCarsByUser(values);

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
                format: 'png'
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
      var _ref2, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _CarService2["default"].getAllCars();

            case 3:
              _ref2 = _context2.sent;
              rows = _ref2.rows;
              return _context2.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back') : _Util2["default"].sendSuccess(res, 200, rows));

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", _Util2["default"].sendError(res, 500, _context2.t0.message));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 8]]);
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

              return _context5.abrupt("return", _Util2["default"].sendError(res, 400, 'Invalid ad id'));

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
  updateAdStatus: function () {
    var _updateAdStatus = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(req, res) {
      var car_id, status, userId, _ref6, rows, updatedCar;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              car_id = req.params.car_id;
              status = req.body.status;
              userId = req.userId;

              if (!(!car_id || car_id.trim().length !== 13 || !status)) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt("return", _Util2["default"].sendError(res, 400, 'Supply a valid ad id and status'));

            case 5:
              _context6.prev = 5;
              _context6.next = 8;
              return _CarService2["default"].getSingleCarAllPpties(car_id);

            case 8:
              _ref6 = _context6.sent;
              rows = _ref6.rows;

              if (!(rows.length !== 1 || parseFloat(rows[0].owner) !== parseFloat(userId))) {
                _context6.next = 12;
                break;
              }

              return _context6.abrupt("return", _Util2["default"].sendError(res, 400, 'Only sellers can update cars that are availabe'));

            case 12:
              _context6.next = 14;
              return _CarService2["default"].updateStatus(status, car_id);

            case 14:
              updatedCar = _context6.sent;
              return _context6.abrupt("return", _Util2["default"].sendSuccess(res, 200, updatedCar.rows[0]));

            case 18:
              _context6.prev = 18;
              _context6.t0 = _context6["catch"](5);
              return _context6.abrupt("return", _Util2["default"].sendError(res, 500, _context6.t0.message));

            case 21:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[5, 18]]);
    }));

    function updateAdStatus(_x11, _x12) {
      return _updateAdStatus.apply(this, arguments);
    }

    return updateAdStatus;
  }(),
  updateAdPrice: function () {
    var _updateAdPrice = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7(req, res) {
      var car_id, price, userId, _ref7, rows, updatedCar;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              car_id = req.params.car_id;
              price = req.body.price;
              userId = req.userId;

              if (!(!car_id || car_id.trim().length !== 13 || !price)) {
                _context7.next = 5;
                break;
              }

              return _context7.abrupt("return", _Util2["default"].sendError(res, 400, 'Supply a valid ad id and status'));

            case 5:
              _context7.prev = 5;
              _context7.next = 8;
              return _CarService2["default"].getSingleCarAllPpties(car_id);

            case 8:
              _ref7 = _context7.sent;
              rows = _ref7.rows;

              if (!(rows.length !== 1 || parseFloat(rows[0].owner) !== parseFloat(userId))) {
                _context7.next = 12;
                break;
              }

              return _context7.abrupt("return", _Util2["default"].sendError(res, 400, 'Only sellers can update cars that are availabe'));

            case 12:
              _context7.next = 14;
              return _CarService2["default"].updatePrice(price, car_id);

            case 14:
              updatedCar = _context7.sent;
              return _context7.abrupt("return", _Util2["default"].sendSuccess(res, 200, updatedCar.rows[0]));

            case 18:
              _context7.prev = 18;
              _context7.t0 = _context7["catch"](5);
              return _context7.abrupt("return", _Util2["default"].sendError(res, 500, _context7.t0.message));

            case 21:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[5, 18]]);
    }));

    function updateAdPrice(_x13, _x14) {
      return _updateAdPrice.apply(this, arguments);
    }

    return updateAdPrice;
  }(),
  updateAdvert: function () {
    var _updateAdvert = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(req, res) {
      var reqFields, _ref8, rows, userId, role, adminQ, data, result;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              reqFields = ['status', 'price', 'description'];

              if (!(0, _validateData2["default"])(reqFields, req.body)) {
                _context8.next = 3;
                break;
              }

              return _context8.abrupt("return", _Util2["default"].sendError(res, 400, 'Fill all fields'));

            case 3:
              _context8.prev = 3;
              _context8.next = 6;
              return _CarService2["default"].getSingleCarAllPpties(req.params.id);

            case 6:
              _ref8 = _context8.sent;
              rows = _ref8.rows;

              if (!(rows.length < 1)) {
                _context8.next = 10;
                break;
              }

              return _context8.abrupt("return", _Util2["default"].sendError(res, 404, 'The advert you want to update is not available'));

            case 10:
              userId = req.userId, role = req.role;

              if (!(parseInt(userId, 10) !== parseInt(rows[0].owner, 10) && !role)) {
                _context8.next = 13;
                break;
              }

              return _context8.abrupt("return", _Util2["default"].sendError(res, 401, 'You do not have the permission to update this data'));

            case 13:
              adminQ = [req.body.status, req.params.id];
              data = [req.body.price, req.body.description].concat(adminQ);

              if (!(parseInt(userId, 10) === parseInt(rows[0].owner, 10))) {
                _context8.next = 21;
                break;
              }

              _context8.next = 18;
              return _CarService2["default"].updateBySeller(data);

            case 18:
              _context8.t0 = _context8.sent;
              _context8.next = 24;
              break;

            case 21:
              _context8.next = 23;
              return _CarService2["default"].updateByAdmin(adminQ);

            case 23:
              _context8.t0 = _context8.sent;

            case 24:
              result = _context8.t0;
              return _context8.abrupt("return", _Util2["default"].sendSuccess(res, 200, result.rows[0]));

            case 28:
              _context8.prev = 28;
              _context8.t1 = _context8["catch"](3);
              return _context8.abrupt("return", _Util2["default"].sendError(res, 500, _context8.t1.message));

            case 31:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this, [[3, 28]]);
    }));

    function updateAdvert(_x15, _x16) {
      return _updateAdvert.apply(this, arguments);
    }

    return updateAdvert;
  }(),
  getCars: function () {
    var _getCars = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee9(req, res) {
      var params, paramsArray, paramsLength, min, max, _ref9, _rows, reqParam, ppty, _ref10, _rows2, _ref11, _rows3, _ref12, rows;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              params = req.query;
              paramsArray = Object.keys(params);
              paramsLength = Object.keys(params).length;
              _context9.prev = 3;

              if (!(paramsLength === 3 && JSON.stringify(paramsArray) === JSON.stringify(['status', 'min_price', 'max_price']))) {
                _context9.next = 12;
                break;
              }

              min = req.query.min_price ? req.query.min_price : 0;
              max = req.query.max_price ? req.query.max_price : 30000000;
              _context9.next = 9;
              return _CarService2["default"].getCarsInRange(req.query.status, min, max);

            case 9:
              _ref9 = _context9.sent;
              _rows = _ref9.rows;
              return _context9.abrupt("return", _rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars within the selected range') : _Util2["default"].sendSuccess(res, 200, _rows));

            case 12:
              if (!(paramsLength === 2)) {
                _context9.next = 28;
                break;
              }

              reqParam = Object.keys(req.query)[1];
              _context9.t0 = reqParam.toLowerCase();
              _context9.next = _context9.t0 === 'manufacturer' ? 17 : _context9.t0 === 'body_type' ? 19 : 21;
              break;

            case 17:
              ppty = req.query.manufacturer;
              return _context9.abrupt("break", 23);

            case 19:
              ppty = req.query.body_type;
              return _context9.abrupt("break", 23);

            case 21:
              ppty = req.query.state;
              return _context9.abrupt("break", 23);

            case 23:
              _context9.next = 25;
              return _CarService2["default"].getCarsByProperty(req.query.status, reqParam, ppty);

            case 25:
              _ref10 = _context9.sent;
              _rows2 = _ref10.rows;
              return _context9.abrupt("return", _rows2.length < 1 ? _Util2["default"].sendError(res, 404, "There are no cars for the selected ".concat(reqParam)) : _Util2["default"].sendSuccess(res, 200, _rows2));

            case 28:
              if (!(paramsLength === 1)) {
                _context9.next = 34;
                break;
              }

              _context9.next = 31;
              return _CarService2["default"].getAllUnsoldCars(req.query.status);

            case 31:
              _ref11 = _context9.sent;
              _rows3 = _ref11.rows;
              return _context9.abrupt("return", _rows3.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back') : _Util2["default"].sendSuccess(res, 200, _rows3));

            case 34:
              _context9.next = 36;
              return _CarService2["default"].getAllCars();

            case 36:
              _ref12 = _context9.sent;
              rows = _ref12.rows;
              return _context9.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'There are no cars available now. Check back') : _Util2["default"].sendSuccess(res, 200, rows));

            case 41:
              _context9.prev = 41;
              _context9.t1 = _context9["catch"](3);
              return _context9.abrupt("return", _Util2["default"].sendError(res, 500, _context9.t1.message));

            case 44:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this, [[3, 41]]);
    }));

    function getCars(_x17, _x18) {
      return _getCars.apply(this, arguments);
    }

    return getCars;
  }(),
  deleteAd: function () {
    var _deleteAd = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(req, res) {
      var _ref13, rows;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              if (!(req.params.car_id.trim().length !== 13)) {
                _context10.next = 2;
                break;
              }

              return _context10.abrupt("return", _Util2["default"].sendError(res, 400, 'Select the ad to delete'));

            case 2:
              _context10.prev = 2;
              _context10.next = 5;
              return _CarService2["default"].deleteCar(req.params.car_id);

            case 5:
              _ref13 = _context10.sent;
              rows = _ref13.rows;
              return _context10.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'Selected ad not available') : _Util2["default"].sendSuccess(res, 200, rows[0]));

            case 10:
              _context10.prev = 10;
              _context10.t0 = _context10["catch"](2);
              return _context10.abrupt("return", _Util2["default"].sendError(res, 500, _context10.t0.message));

            case 13:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this, [[2, 10]]);
    }));

    function deleteAd(_x19, _x20) {
      return _deleteAd.apply(this, arguments);
    }

    return deleteAd;
  }(),
  getMyAds: function () {
    var _getMyAds = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11(req, res) {
      var userId, _ref14, rows;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              userId = req.userId;
              _context11.prev = 1;
              _context11.next = 4;
              return _CarService2["default"].gerUserAds(userId);

            case 4:
              _ref14 = _context11.sent;
              rows = _ref14.rows;
              return _context11.abrupt("return", rows.length < 1 ? _Util2["default"].sendError(res, 404, 'You do not have ads yet') : _Util2["default"].sendSuccess(res, 200, rows));

            case 9:
              _context11.prev = 9;
              _context11.t0 = _context11["catch"](1);
              return _context11.abrupt("return", _Util2["default"].sendError(res, 500, _context11.t0.message));

            case 12:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this, [[1, 9]]);
    }));

    function getMyAds(_x21, _x22) {
      return _getMyAds.apply(this, arguments);
    }

    return getMyAds;
  }()
};
exports["default"] = Car;