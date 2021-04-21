"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _initialize = _interopRequireDefault(require("./initialize"));

var _middleware = _interopRequireDefault(require("./middleware"));

var _api = _interopRequireDefault(require("./api"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var hbs = require('express-handlebars');

_dotenv["default"].config();

var app = (0, _express["default"])();
app.server = _http["default"].createServer(app);
app.engine('.hbs', hbs({
  extname: '.hbs',
  defaultLayout: 'default'
}));
app.set('view engine', '.hbs'); // enable cross origin requests explicitly in development

if (process.env.NODE_ENV === 'development') {
  var cors = require('cors');

  console.log('Enabling CORS in development...');
  app.use(cors());
}

var config = process.env;
(0, _initialize["default"])(function (controller) {
  app.use((0, _middleware["default"])({
    config: config,
    controller: controller
  }));
  app.use('/api', (0, _api["default"])({
    config: config,
    controller: controller
  }));
  app.use(_express["default"]["static"](_path["default"].join(__dirname, 'public')));
  app.server.listen(process.env.PORT || 4040, function () {
    console.log('===========================================');
    console.log("Server running on port ".concat(app.server.address().port));
  });
});
var _default = app;
exports["default"] = _default;