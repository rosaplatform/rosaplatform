"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelLayerGeneric = modelLayerGeneric;
exports.noFragment = noFragment;
exports.noResource = noResource;
exports["default"] = void 0;

var _en = _interopRequireDefault(require("../copy/en"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function modelLayerGeneric(parts) {
  return new Error(_en["default"].errors.modelLayer(parts));
}

function noFragment(parts) {
  return new Error(_en["default"].errors.noFragment(parts));
}

function noResource(parts) {
  return new Error(_en["default"].errors.noResource(parts));
}

var _default = {
  modelLayerGeneric: modelLayerGeneric,
  noFragment: noFragment,
  noResource: noResource
};
exports["default"] = _default;