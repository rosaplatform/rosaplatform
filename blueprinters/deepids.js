"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _deeprows = _interopRequireDefault(require("./deeprows"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row. If two or more
 * column names are the same except for a different integer at the end
 * (e.g. 'tag1', and 'tag2'), then the values of those two columns are
 * aggregated into a list, which is the value of the prefix's key ('tag').
 * Any values in those columns that are empty will NOT be added to the list.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Object      the structured data.
 */
var _default = function _default(data) {
  var output = {};
  (0, _deeprows["default"])(data).forEach(function (row) {
    output[row.id] = row;
  });
  return output;
};

exports["default"] = _default;