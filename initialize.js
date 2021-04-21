"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _StoreJson = _interopRequireDefault(require("./models/StoreJson"));

var _Fetcher = _interopRequireDefault(require("./lib/Fetcher"));

var _Controller = _interopRequireDefault(require("./lib/Controller"));

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isntNull = function isntNull(n) {
  return n !== null;
};

var filterNull = function filterNull(ls) {
  return _ramda["default"].filter(isntNull, ls);
};

var flattenfilterNull = function flattenfilterNull(ls) {
  return filterNull(_ramda["default"].flatten(ls));
};

var themFetchers;
var config;

try {
  config = require('./local.config.js')["default"];
} catch (_) {
  config = require('./config.js')["default"];
}

var _default = function _default(callback) {
  return Promise.resolve().then(function () {
    return Object.keys(config).map(function (fType) {
      // skip config attrs that don't have corresponding fetchers
      if (!(fType in _Fetcher["default"])) return null;
      var FFetcher = _Fetcher["default"][fType];
      return config[fType].map(function (sheet) {
        var otherArgs = _objectSpread({}, sheet);

        delete otherArgs.name;
        delete otherArgs.tabs;
        return {
          name: sheet.name,
          fetcher: _construct(FFetcher, [new _StoreJson["default"](), sheet.name, sheet.tabs].concat(_toConsumableArray(Object.values(otherArgs))))
        };
      });
    });
  }).then(function (res) {
    themFetchers = flattenfilterNull(res);
  }).then(function () {
    return Promise.all(themFetchers.map(function (f) {
      return f.fetcher.authenticate(process.env);
    }));
  }).then(function (fetchers) {
    var config = _ramda["default"].zipObj(themFetchers.map(function (f) {
      return f.name;
    }), fetchers);

    var controller = new _Controller["default"](config);
    callback(controller);
  })["catch"](function (err) {
    console.log(err);
    console.log("ERROR: the server couldn't connect to all of the sheets you provided. Ensure you have granted access to ".concat(process.env.SERVICE_ACCOUNT_EMAIL, " on ALL listed sheets."));
  });
};

exports["default"] = _default;