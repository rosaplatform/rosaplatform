"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../lib/util");

/**
 * Very similar to the rows blueprinter, but inserts each row as a value in
 * an object, where the value in the 'id' column of the row will be used as
 * the search key
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Object      the structured data.
 */
var _default = function _default(data) {
  var itemLabels = data[0];
  var fmt = (0, _util.fmtObj)(itemLabels);
  var output = {};
  data.forEach(function (row, idx) {
    if (idx === 0) return;
    output[fmt(row).id] = fmt(row);
  });
  return output;
};

exports["default"] = _default;