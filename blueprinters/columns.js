"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row. If two or more
 * column names are the same except for a different integer at the end
 * (e.g. 'tag1', and 'tag2'), then the values of those two columns are
 * aggregated into a list, which is the value of the prefix's key ('tag').
 * Any values in those columns that are empty will NOT be added to the list.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
var _default = function _default(data) {
  var columnNames = data[0];
  var columns = columnNames.map(function (name) {
    return [];
  });
  data.forEach(function (row, idx) {
    if (idx === 0) return;
    row.forEach(function (item, idx) {
      columns[idx].push(item);
    });
  });
  return columns.map(function (column, idx) {
    return {
      name: columnNames[idx],
      items: column
    };
  });
};

exports["default"] = _default;