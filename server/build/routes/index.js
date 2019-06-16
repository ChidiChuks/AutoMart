"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _UserController = _interopRequireDefault(require("../controllers/UserController"));

var _CarController = _interopRequireDefault(require("../controllers/CarController"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _admin = _interopRequireDefault(require("../middleware/admin"));

var _logout = _interopRequireDefault(require("../middleware/logout"));

var _OrderController = _interopRequireDefault(require("../controllers/OrderController"));

var _FlagController = _interopRequireDefault(require("../controllers/FlagController"));

var _upload = _interopRequireDefault(require("../lib/upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // user signup


router.post('/auth/signup', _UserController["default"].create); // user login

router.post('/auth/signin', _UserController["default"].signIn); // user log out

router.get('/auth/logout', _logout["default"], _UserController["default"].logout); // get cars within a price range

router.get('/car/price/', _CarController["default"].getCarsWithinPriceRange); // get cars by manufacturer

router.get('/car/manufacturer/:manufacturer', _CarController["default"].getCarsByProperty); // get cars by body type

router.get('/car/bodytype/:body_type', _CarController["default"].getCarsByProperty); // get cars by state

router.get('/car/state/:state', _CarController["default"].getCarsByProperty); // get a single ad

router.get('/car/:id', _CarController["default"].getSingleAd); // get all unsold cars

router.get('/cars/status/available', _CarController["default"].getAllUnsoldCars);
/**
 * Protected routes - users
 */
// user make an order

router.post('/order', _auth["default"], _OrderController["default"].create); // create an advert

router.post('/car', _auth["default"], _upload["default"].single('img'), _CarController["default"].create); // User gets all his/her sold ads

router.get('/orders/me', _auth["default"], _OrderController["default"].mySoldAds); // view an order detail

router.get('/orders/:orderId', _auth["default"], _OrderController["default"].getSingleOrder); // delete order seller and admin can delete

router["delete"]('/orders/:orderId', _auth["default"], _OrderController["default"].deleteAnOrder); // seller update offer price

router.patch('/order', _auth["default"], _OrderController["default"].updatePrice);
router.patch('/orders/:orderId', _auth["default"], _OrderController["default"].updateOrderStatus); // flag an ad

router.post('/flag', _auth["default"], _FlagController["default"].createFlag); // update ad. Possible status include [ available, pending, suspended, accepted, sold]

router.patch('/car/:id', _auth["default"], _CarController["default"].updateAdvert); // change password

router.patch('/user', _auth["default"], _UserController["default"].changePassword);
/**
 * Protected routes - Admin
 */
// get all cars

router.get('/car', _admin["default"], _CarController["default"].getAll); // admin delete an ad

router["delete"]('/car/:id', _admin["default"], _CarController["default"].deleteAd); // make user an admin

router.patch('/user/:id', _admin["default"], _UserController["default"].makeAdmin); // view all orders

router.get('/orders', _admin["default"], _OrderController["default"].getAllOrders); // disable a user

router.patch('/users/:userId', _admin["default"], _UserController["default"].disableUser); // update a flag

router.patch('/flag/:flagId', _admin["default"], _FlagController["default"].updateFlag); // delete a flag

router["delete"]('/flags/:flagId', _admin["default"], _FlagController["default"].deleteFlag); // admin get all users

router.get('/users', _admin["default"], _UserController["default"].getAll);
router.get('/flags', _admin["default"], _FlagController["default"].getAllFlags);
router.get('/', function (req, res) {
  return res.status(200).send('Hello world');
});
var _default = router;
exports["default"] = _default;