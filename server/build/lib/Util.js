"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Util =
/*#__PURE__*/
function () {
  function Util() {
    _classCallCheck(this, Util);

    this.statusCode = null;
    this.data = null;
    this.message = null;
  }

  _createClass(Util, [{
    key: "sendError",
    value: function sendError(res, statusCode, message) {
      this.statusCode = statusCode;
      this.error = message;
      return res.status(this.statusCode).send({
        status: this.statusCode,
        error: this.error
      });
    }
  }, {
    key: "sendSuccess",
    value: function sendSuccess(res, statusCode, data) {
      this.statusCode = statusCode;
      this.data = data;
      this.type = 'success';
      return res.status(statusCode).send({
        status: this.statusCode,
        data: this.data
      });
    }
  }]);

  return Util;
}();

exports["default"] = new Util();