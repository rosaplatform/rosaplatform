"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDesaturated = buildDesaturated;
exports.defaultResource = exports.defaultBlueprint = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _ramda = _interopRequireDefault(require("ramda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultBlueprint = {
  name: null,
  sheet: {
    name: null,
    id: null
  },
  resources: {}
};
exports.defaultBlueprint = defaultBlueprint;
var defaultResource = {
  data: []
};
exports.defaultResource = defaultResource;

function buildDesaturated(sheetId, sheetName, tab, resources) {
  var bp = _ramda["default"].clone(defaultBlueprint);

  bp.sheet.name = sheetName;
  bp.sheet.id = sheetId;
  bp.name = tab;
  bp.resources = resources.reduce(function (acc, r) {
    acc[r] = null;
    return acc;
  }, {});
  return bp;
}

var buildBlueprinter = _ramda["default"].curry(function (datafierName, datafier, sheetId, sheetName, tabName, data) {
  var bp = _ramda["default"].clone(defaultBlueprint);

  bp.sheet = {
    name: sheetName,
    id: sheetId
  };
  bp.name = tabName;
  bp.resources[datafierName] = _ramda["default"].clone(defaultResource);
  bp.resources[datafierName].data = datafier(data);
  return bp;
}); // import all default exports from 'blueprinters' folder


var allBps = {};
var REL_PATH_TO_BPS = '../blueprinters';

var normalizedPath = _path["default"].join(__dirname, REL_PATH_TO_BPS);

_fs["default"].readdirSync(normalizedPath).forEach(function (file) {
  var bpName = file.replace('.js', '');

  var datafier = require("".concat(REL_PATH_TO_BPS, "/").concat(file))["default"];

  allBps[bpName] = buildBlueprinter(bpName, datafier);
}); // NB: revert to ES5 'module.exports' required to make blueprinters from
// each file in blueprinters folder available for granular import from here.


module.exports = Object.assign({
  defaultBlueprint: defaultBlueprint,
  defaultResource: defaultResource,
  buildDesaturated: buildDesaturated
}, allBps);