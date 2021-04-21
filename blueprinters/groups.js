"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../lib/util");

/**
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted into the data list at idx = id.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
var _default = function _default(data) {
  var itemLabels = data[0];
  var fmt = (0, _util.fmtObj)(itemLabels);
  var output = [];
  var dataGroups = {};
  data.forEach(function (row, idx) {
    if (idx === 0) return;
    var group = fmt(row).group;

    if (!dataGroups[group]) {
      dataGroups[group] = [fmt(row)];
    } else {
      dataGroups[group].push(fmt(row));
    }
  });
  Object.keys(dataGroups).forEach(function (groupKey) {
    output.push({
      group: groupKey,
      group_label: dataGroups[groupKey][0].group_label,
      data: dataGroups[groupKey]
    });
  });
  return output;
};

exports["default"] = _default;