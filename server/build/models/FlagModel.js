"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Flag =
/*#__PURE__*/
function () {
  function Flag() {
    _classCallCheck(this, Flag);

    this.flags = [];
  }

  _createClass(Flag, [{
    key: "createFlag",
    value: function createFlag(data) {
      var newFlag = {
        id: Date.now(),
        carId: data.carId,
        created_on: new Date().toLocaleString(),
        reason: data.reason || '',
        description: data.description || '',
        reportedBy: data.reportedBy || '',
        status: 'pending',
        severity: data.severity || 'minor'
      };
      this.flags.push(newFlag);
      return newFlag;
    }
    /**
     * @description - return a single flag
     * @param {integer} flagId
     * @returns {object}
     */

  }, {
    key: "findSingleFlag",
    value: function findSingleFlag(id) {
      return this.flags.find(function (flag) {
        return parseInt(flag.id, 10) === parseInt(id, 10);
      });
    }
  }, {
    key: "updateFlagStatus",
    value: function updateFlagStatus(id) {
      var flag = this.findSingleFlag(id);
      flag.status = 'resolved';
      return flag;
    }
  }, {
    key: "deleteFlag",
    value: function deleteFlag(flag) {
      var flagIndex = this.flags.indexOf(flag);
      return this.flags.splice(flagIndex, 1);
    }
  }, {
    key: "getAllFlags",
    value: function getAllFlags() {
      return this.flags;
    }
  }]);

  return Flag;
}();

exports["default"] = new Flag();