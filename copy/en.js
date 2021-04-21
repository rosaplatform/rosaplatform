"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  errors: {
    update: 'The server could not update. Check your API credentials and internet connection and try again.',
    onlySheet: 'You cannot query a sheet directly. The URL needs to be in the format /:sheet/:tab/:resource.',
    onlyTab: 'You cannot query a tab directly. The URL needs to be in the format /:sheet/:tab/:resource.',
    noSheet: function noSheet(sheet) {
      return "The sheet ".concat(sheet, " is not available in this server.");
    },
    noResource: function noResource(prts) {
      return "The resource '".concat(prts[2], "' does not exists in the tab '").concat(prts[1], "' in this sheet.");
    },
    noFragment: function noFragment(prts) {
      return "Fragment index does not exist";
    },
    modelLayer: function modelLayer(prts) {
      return "Something went wrong at the model layer";
    }
  },
  success: {
    update: 'All sheets updated'
  }
};
exports["default"] = _default;