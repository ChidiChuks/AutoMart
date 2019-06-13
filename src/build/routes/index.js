

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const _multer = require('multer');

const _multer2 = _interopRequireDefault(_multer);

const _UserController = require('../controllers/UserController');

const _UserController2 = _interopRequireDefault(_UserController);

const _CarController = require('../controllers/CarController');

const _CarController2 = _interopRequireDefault(_CarController);

const _auth = require('../middleware/auth');

const _auth2 = _interopRequireDefault(_auth);

const _admin = require('../middleware/admin');

const _admin2 = _interopRequireDefault(_admin);

const _OrderController = require('../controllers/OrderController');

const _OrderController2 = _interopRequireDefault(_OrderController);

const _FlagController = require('../controllers/FlagController');

const _FlagController2 = _interopRequireDefault(_FlagController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = _multer2.default.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = (0, _multer2.default)({
  storage,
  fileFilter,
  limits: { fileSize: 500000 },
});

const router = _express2.default.Router();

// user signup
router.post('/auth/signup', _UserController2.default.create);

// users
router.get('/users', _admin2.default, _UserController2.default.getAll);

// user login
router.post('/auth/signin', _UserController2.default.signIn);

// change password
router.patch('/user', _auth2.default, _UserController2.default.changePassword);

// get cars within a price range
router.get('/car/price/', _CarController2.default.getCarsWithinPriceRange);

// create an advert
router.post('/car', _auth2.default, upload.single('img'), _CarController2.default.create);

// get cars by manufacturer
router.get('/car/manufacturer/:manufacturer', _CarController2.default.getCarsByProperty);

// get cars by body type
router.get('/car/bodytype/:body_type', _CarController2.default.getCarsByProperty);

// get cars by state
router.get('/car/state/:state', _CarController2.default.getCarsByProperty);

// get a single ad
router.get('/car/:id', _CarController2.default.getSingleAd);

// update ad
router.patch('/car/:id', _auth2.default, _CarController2.default.updateAdvert);

// get all unsold cars
router.get('/cars/status/available', _CarController2.default.getAllUnsoldCars);

// get all cars
router.get('/car', _admin2.default, _CarController2.default.getAll);

// admin delete an ad
router.delete('/car/:id', _admin2.default, _CarController2.default.deleteAd);

// user make an order
router.post('/order', _auth2.default, _OrderController2.default.create);

// seller update offer price
router.patch('/order', _auth2.default, _OrderController2.default.updatePrice);

// flag an ad
router.post('/flag', _auth2.default, _FlagController2.default.createFlag);
router.get('/', (req, res) => res.status(200).send('Hello world'));

exports.default = router;
