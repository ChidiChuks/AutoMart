

const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const _winston = require('winston');

const _winston2 = _interopRequireDefault(_winston);

const _index = require('./routes/index');

const _index2 = _interopRequireDefault(_index);

const _logger = require('./logger');

const _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));
_logger2.default.configure();

app.use('/api/v1', _index2.default);
const port = process.env.PORT || 3000;

app.listen(port, () => _winston2.default.log('debug', `Listening on port ${port}`));

module.exports = app;
