"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var baseUrl = 'http://a.tiles.mapbox.com/v4/mapbox.satellite';

var _default = function _default(accessToken) {
  return function (req, res) {
    var _req$params = req.params,
        x = _req$params.x,
        y = _req$params.y,
        z = _req$params.z; // const filename = `${z}-${y}-${x}.png`
    // const fileStream = fs.createWriteStream(`${z}-${y}-${x}.png`)

    (0, _nodeFetch["default"])("".concat(baseUrl, "/").concat(z, "/").concat(y, "/").concat(x, "@2x.png?access_token=").concat(accessToken)).then(function (result) {
      res.set('Content-Type', 'image/png');
      result.body.pipe(res);
    });
  };
};

exports["default"] = _default;