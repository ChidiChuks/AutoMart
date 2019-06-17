"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var storage = _multer2["default"].diskStorage({
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = (0, _multer2["default"])({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500000
  }
});
exports["default"] = upload;