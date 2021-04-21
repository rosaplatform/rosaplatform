"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../lib/util");

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
  var itemLabels = data[0];
  var baseFmt = (0, _util.fmtObj)(itemLabels);
  var output = []; // create a structure to indicate which columns needs to be aggregated

  var endsWithNumber = new RegExp('(.*?)[0-9]+$');
  var structure = {
    __flat: []
  };
  itemLabels.forEach(function (label) {
    var matches = label.match(endsWithNumber);

    if (!matches) {
      structure.__flat.push(label);
    } else {
      var labelPrefix = "".concat(matches[1], "s");

      if (labelPrefix in structure) {
        structure[labelPrefix].push(label);
      } else {
        structure[labelPrefix] = [label];
      }
    }
  }); // generate the value for deep labels using the structure created

  data.forEach(function (row, idx) {
    if (idx === 0) return;
    var baseRow = baseFmt(row);
    var deepRow = {}; // generate deep row labels using structure

    Object.keys(structure).forEach(function (newLabel) {
      if (newLabel !== '__flat') {
        var oldLabels = structure[newLabel]; // only add new value if not ''

        var labelValues = [];
        oldLabels.forEach(function (l) {
          var vl = baseRow[l];

          if (vl !== '') {
            labelValues.push(vl);
          }
        });
        deepRow[newLabel] = labelValues;
      }
    }); // move values for flat labels over from base

    structure.__flat.forEach(function (label) {
      deepRow[label] = baseRow[label];
    });

    if (!Object.keys(deepRow).every(function (k) {
      return deepRow[k] === '' || Array.isArray(deepRow[k]) && deepRow[k].length === 0;
    })) {
      output.push(deepRow);
    }
  });
  return output;
};

exports["default"] = _default;