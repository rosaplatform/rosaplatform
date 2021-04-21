"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _en = _interopRequireDefault(require("../copy/en"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Controller
 *
 */
var Controller = /*#__PURE__*/function () {
  function Controller(fetchers) {
    _classCallCheck(this, Controller);

    this.fetchers = fetchers;
  }

  _createClass(Controller, [{
    key: "_sheetExists",
    value: function _sheetExists(sheet) {
      return Object.keys(this.fetchers).indexOf(sheet) >= 0;
    }
  }, {
    key: "blueprints",
    value: function blueprints() {
      var _this = this;

      return Object.keys(this.fetchers).map(function (sheet) {
        return _this.fetchers[sheet].blueprints;
      }).reduce(function (acc, curr) {
        return acc.concat(curr);
      });
    }
  }, {
    key: "rebuildBlueprintsAsync",
    value: function rebuildBlueprintsAsync() {
      Object.values(this.fetchers).forEach(function (t) {
        return t._buildBlueprintsAsync();
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      var me = this;
      return Promise.all(Object.keys(this.fetchers).map(function (sheet) {
        return _this2.fetchers[sheet].update();
      })).then(function (results) {
        if (results.every(function (r) {
          return r;
        })) {
          me.rebuildBlueprintsAsync();
          return _en["default"].success.update;
        } else {
          throw new Error(_en["default"].errors.update);
        }
      });
    }
  }, {
    key: "retrieve",
    value: function retrieve(sheet, tab, resource) {
      if (this._sheetExists(sheet)) {
        var fetcher = this.fetchers[sheet];
        return fetcher.retrieve(tab, resource);
      } else {
        return Promise.reject(new Error(_en["default"].errors.noResource(sheet)));
      }
    }
  }, {
    key: "retrieveFrag",
    value: function retrieveFrag(sheet, tab, resource, frag) {
      if (this._sheetExists(sheet)) {
        var fetcher = this.fetchers[sheet];
        return fetcher.retrieveFrag(tab, resource, frag);
      } else {
        return Promise.reject(new Error(_en["default"].errors.noResource(sheet)));
      }
    }
  }]);

  return Controller;
}();

var _default = Controller;
exports["default"] = _default;