"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timemap = void 0;

var _blueprinters = _interopRequireDefault(require("./lib/blueprinters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function prefixedTabs(prefix, cfg) {
  var _ref;

  if (!cfg) cfg = {};

  var prf = function prf(key) {
    return cfg[key] ? "".concat(prefix, "_") : '';
  };

  return _ref = {}, _defineProperty(_ref, "".concat(prf('events'), "export_events"), _blueprinters["default"].deeprows), _defineProperty(_ref, "".concat(prf('associations'), "export_associations"), _blueprinters["default"].deeprows), _defineProperty(_ref, "".concat(prf('sources'), "export_sources"), _blueprinters["default"].deepids), _defineProperty(_ref, "".concat(prf('sites'), "export_sites"), _blueprinters["default"].rows), _ref;
}

var timemap = {
  "default": prefixedTabs(),
  prefixedTabs: prefixedTabs
};
exports.timemap = timemap;