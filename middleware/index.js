"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _morgan = _interopRequireDefault(require("morgan"));

var _mapbox = _interopRequireDefault(require("./mapbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line
var _default = function _default(_ref) {
  var config = _ref.config,
      db = _ref.db;
  var routes = (0, _express.Router)();
  /* logging middleware */

  routes.use((0, _morgan["default"])('dev'));

  if (process.env.MAPBOX_TOKEN) {
    routes.get('/mapbox/:z/:y/:x', (0, _mapbox["default"])(process.env.MAPBOX_TOKEN));
  }

  return routes;
};

exports["default"] = _default;