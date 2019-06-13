

Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _CarModel = require('../models/CarModel');

const _CarModel2 = _interopRequireDefault(_CarModel);

const _FlagModel = require('../models/FlagModel');

const _FlagModel2 = _interopRequireDefault(_FlagModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Flag = {
  createFlag(req, res) {
    if (!req.body.carId || !req.body.reason) {
      return res.status(400).send({
        status: 400,
        message: 'Ensure to indicate the ad id and reason for the report',
      });
    }

    const car = _CarModel2.default.findSingle(req.body.carId);
    if (!car || car.status.toLowerCase() !== 'available') {
      return res.status(404).send({
        status: 404,
        message: 'The ad is not longer active. Thank you.',
      });
    }
    req.body.reportedBy = req.userId;
    // state the report severity level
    if (req.body.reason.toLowerCase() === 'fake' || req.body.reason.toLowerCase() === 'stolen' || req.body.reason === 'suspicious') {
      req.body.severity = 'extreme';
    }
    // send the report
    const newFlag = _FlagModel2.default.createFlag(req.body);

    return res.status(200).send({
      status: 200,
      data: newFlag,
    });
  },
};

exports.default = Flag;
