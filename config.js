"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lib = require("./lib");

var _default = {
  gsheets: [],
  xlsx: [{
    name: 'timemap_data',
    path: 'data/timemap_data.xlsx',
    tabs: _lib.timemap["default"]
  }]
};
exports["default"] = _default;