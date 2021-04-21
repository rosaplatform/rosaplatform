"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../lib/util");

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
var _default = function _default(data) {
  var itemLabels = data[0];
  var fmt = (0, _util.fmtObj)(itemLabels);
  var output = [];
  data.forEach(function (row, idx) {
    if (idx === 0) return;
    output.push(fmt(row));
  });
  return output;
};

exports["default"] = _default;