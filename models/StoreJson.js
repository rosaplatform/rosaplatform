"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("mz/fs"));

var _errors = _interopRequireDefault(require("../lib/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var STORAGE_DIRNAME = 'data';

function partsFromFilename(fname) {
  var body = fname.slice(0, -5);
  return body.split('__');
}

var StoreJson = /*#__PURE__*/function () {
  function StoreJson() {
    _classCallCheck(this, StoreJson);
  }

  _createClass(StoreJson, [{
    key: "index",
    value: function index() {
      return Promise.resolve().then(function () {
        return _fs["default"].readdir(STORAGE_DIRNAME);
      }).then(function (files) {
        return files.filter(function (f) {
          return f.match(/.*\.json$/);
        });
      }).then(function (jsons) {
        return jsons.map(partsFromFilename);
      }).then(function (parts) {
        return parts.map(function (p) {
          return "".concat(p[0], "/").concat(p[1], "/").concat(p[2]);
        });
      });
    }
  }, {
    key: "save",
    value: function save(url, data) {
      var parts = url.split('/');
      return _fs["default"].writeFile("".concat(STORAGE_DIRNAME, "/").concat(parts[0], "__").concat(parts[1], "__").concat(parts[2], ".json"), JSON.stringify(data));
    }
  }, {
    key: "load",
    value: function load(url) {
      var parts = url.split('/');
      var fname = "".concat(STORAGE_DIRNAME, "/").concat(parts[0], "__").concat(parts[1], "__").concat(parts[2], ".json");

      if (_fs["default"].existsSync(fname)) {
        return _fs["default"].readFile(fname, 'utf8').then(function (data) {
          return JSON.parse(data);
        }).then(function (data) {
          if (parts.length === 3) {
            // No lookup if the requested url doesn't have a fragment
            return data;
          } else if (parts[2] === 'ids') {
            // Do a lookup if fragment is included to filter a relevant item
            // When the resource requested is 'ids'
            var id = parseInt(parts[3]);

            if (!isNaN(id) && id >= 0 && id < data.length) {
              return data[id];
            } else {
              throw _errors["default"].noFragment(parts);
            }
          } else {
            // Do a lookup if fragment is included to filter a relevant item
            var index = parseInt(parts[3]);

            if (!isNaN(index) && index >= 0 && index < data.length) {
              return data.filter(function (vl, idx) {
                return idx === index;
              })[0];
            } else {
              throw _errors["default"].noFragment(parts);
            }
          }
        });
      } else {
        return Promise.reject(_errors["default"].noResource(parts));
      }
    } // TODO: add method to build blueprint from data sheet

  }]);

  return StoreJson;
}();

var _default = StoreJson;
exports["default"] = _default;