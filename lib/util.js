"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fmtName = fmtName;
exports.fmtBlueprinterTitles = fmtBlueprinterTitles;
exports.deriveFilename = deriveFilename;
exports.desaturate = desaturate;
exports.isFunction = isFunction;
exports.idxSearcher = exports.fmtObj = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
/* eslint-enable */


function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces

    return match.toUpperCase();
  });
}

var fmtObj = _ramda["default"].curry(function (columnNames, row) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    noSpacesInKeys: false,
    hyphenatedKeys: false,
    camelCaseKeys: false
  };
  var obj = {};

  var fmtColName = function fmtColName(colName) {
    if (options.camelCaseKeys) {
      return camelize(colName);
    } else if (options.hyphenatedKeys) {
      return colName.toLowerCase().replaceAll(' ', '-');
    } else if (options.noSpacesInKeys) {
      return colName.replaceAll(' ', '');
    } else {
      return colName;
    }
  };

  columnNames.forEach(function (columnName, idx) {
    var value = row[idx] ? row[idx] : '';
    obj[fmtColName(columnName)] = value;
  });
  return obj;
});
/* search for object with key in array. Return index if exists, or -1 if not */


exports.fmtObj = fmtObj;

var idxSearcher = _ramda["default"].curry(function (attrName, searchValue, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][attrName] === searchValue) {
      return i;
    }
  }

  return -1;
});
/* more site specific functions. TODO: maybe move to another folder? */


exports.idxSearcher = idxSearcher;

function fmtName(name) {
  return name.replaceAll(' ', '-').toLowerCase();
}

function fmtBlueprinterTitles(tabs) {
  var obj = {};
  Object.keys(tabs).forEach(function (tab) {
    var name = fmtName(tab);
    obj[name] = tabs[tab];
  });
  return obj;
}

function deriveFilename(sheet, tab) {
  return "".concat(fmtName(sheet), "-").concat(fmtName(tab), ".json");
}

function desaturate(full) {
  var blueprint = {
    name: _ramda["default"].clone(full.name),
    sheet: _ramda["default"].clone(full.sheet),
    dialects: _ramda["default"].clone(full.dialects),
    resources: {}
  };
  Object.keys(full.resources).forEach(function (route) {
    blueprint.resources[route] = {
      options: _ramda["default"].clone(full.resources[route].options)
    };
  });
  return blueprint;
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}