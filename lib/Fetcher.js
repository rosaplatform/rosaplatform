"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ramda = _interopRequireDefault(require("ramda"));

var _crypto = require("crypto");

var _blueprinters = require("./blueprinters");

var _util = require("./util");

var _googleapis = require("googleapis");

var _xlsx = _interopRequireDefault(require("xlsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Fetcher = /*#__PURE__*/function () {
  function Fetcher(db, name, bps) {
    _classCallCheck(this, Fetcher);

    /*
     * The database that the fetcher should use. This should be an instance of a model-compliant class.
     * See models/Interface.js for the specifications for a model-compliant class.
     */
    this.db = db;
    /*
     * The name of the sheet. This will prefix tabs saved in the database.
     */

    this.sheetName = name;
    /*
     * A unique ID for the Fetcher to identify its elements in the model layer
     */

    var bpsstring = Object.keys(bps).join(';');
    this.id = (0, _crypto.createHash)('md5').update(name).update(bpsstring).digest('hex');
    /*
     * These are the available tabs for storing and retrieving data.
     * Each blueprinter is a function that returns a Blueprint from a
     * list of lists (which will be retrieved from gsheets).
     */

    this.blueprinters = (0, _util.fmtBlueprinterTitles)(bps);
    /*
     * This object is the canonical represenation for the data that a Fetcher
     * proxies. When the fetcher is initialized, its model layer (db) is indexed,
     * and this object populated accordingly. Whenever the fetcher updates, this
     * data structure updates as well. It is the model layer that determines the
     * performance of indexing the blueprints.
     */

    this.blueprints = null;

    this._buildBlueprintsAsync(); // NB: modifies this.blueprints on completion

    /** curry to allow convenient syntax with map */


    this._saveViaBlueprinter = _ramda["default"].curry(this._saveViaBlueprinter.bind(this));
  }

  _createClass(Fetcher, [{
    key: "_buildBlueprintsAsync",
    value: function _buildBlueprintsAsync() {
      var _this = this;

      return this.db.index().then(function (allUrls) {
        var allParts = allUrls.reduce(function (acc, url) {
          if (url.startsWith(_this.id)) {
            var parts = url.split('/');
            var duplicateTab = acc.reduce(function (tabFound, p) {
              return tabFound || p[0] === parts[1];
            }, false);

            if (duplicateTab) {
              acc.forEach(function (p) {
                if (p[0] === parts[1]) {
                  p[1].push(parts[2]);
                }
              });
            } else {
              acc.push([parts[1], [parts[2]]]);
            }
          }

          return acc;
        }, []);
        return allParts.map(function (parts) {
          var bp = (0, _blueprinters.buildDesaturated)(_this.sheetId, _this.sheetName, parts[0], parts[1]);
          bp.urls = Object.keys(bp.resources).map(function (r) {
            return "/api/".concat(bp.sheet.name, "/").concat(bp.name, "/").concat(r);
          });
          return bp;
        });
      }).then(function (res) {
        _this.blueprints = res;
      });
    }
    /** save data under a given tab name via its blueprinter, which generates
     * its resource name. Note that this is curried in the constructor.
     */

  }, {
    key: "_saveViaBlueprinter",
    value: function _saveViaBlueprinter(tab, data, blueprinter) {
      var _this2 = this;

      var saturatedBp = blueprinter(this.sheetId, this.sheetName, tab, data);
      return Promise.all(Object.keys(saturatedBp.resources).map(function (route) {
        return _this2.db.save("".concat(_this2.id, "/").concat(tab, "/").concat(route), saturatedBp.resources[route].data);
      }));
    }
  }, {
    key: "save",
    value: function save(_tab, data) {
      var tab = (0, _util.fmtName)(_tab);

      if (Object.keys(this.blueprinters).indexOf(tab) > -1) {
        var bpConfig = this.blueprinters[tab];

        if ((0, _util.isFunction)(bpConfig)) {
          // if bpConfig specifies a single blueprinter
          return this._saveViaBlueprinter(tab, data, bpConfig);
        } else {
          // if bpConfig specifies an array of blueprinters
          return bpConfig.map(this._saveViaBlueprinter(tab, data));
        }
      } else {
        // NB: if a blueprinter is not specified for a tab,
        // just skip it.
        return true;
      }
    } // NB: could combine these functions by checking kwargs length

  }, {
    key: "retrieve",
    value: function retrieve(tab, resource) {
      var title = (0, _util.fmtName)(tab);
      var url = "".concat(this.id, "/").concat(tab, "/").concat(resource);
      return this.db.load(url, this.blueprints[title]);
    }
  }, {
    key: "retrieveFrag",
    value: function retrieveFrag(tab, resource, frag) {
      var title = (0, _util.fmtName)(tab);
      var url = "".concat(this.id, "/").concat(tab, "/").concat(resource, "/").concat(frag || '');
      return this.db.load(url, this.blueprints[title]);
    }
    /** Run on startup. Should be overridden if explicit auth is required **/

  }, {
    key: "authenticate",
    value: function authenticate(env) {
      return Promise.resolve(this);
    }
  }]);

  return Fetcher;
}();

var GsheetFetcher = /*#__PURE__*/function (_Fetcher) {
  _inherits(GsheetFetcher, _Fetcher);

  var _super = _createSuper(GsheetFetcher);

  function GsheetFetcher(db, name, bps, sheetId) {
    var _this3;

    _classCallCheck(this, GsheetFetcher);

    _this3 = _super.call(this, db, name, bps);
    _this3.type = 'Google Sheet';
    if (arguments.length < 4) throw Error('You must provide the sheet ID');
    /*
     * ID of the Google Sheet where the data is sheetd. Note that the privateKey.clientEmail
     * loaded here must be added to the sheet as an editor.
     */

    _this3.sheetId = sheetId;
    /*
     * Google API setup
     */

    _this3.API = _googleapis.google.sheets('v4');
    _this3.auth = null;
    return _this3;
  }
  /** returns a Promise that resolves if access is granted to the account, and rejects otherwise. */


  _createClass(GsheetFetcher, [{
    key: "authenticate",
    value: function authenticate(env) {
      var googleAuth = new _googleapis.google.auth.JWT(env.SERVICE_ACCOUNT_EMAIL, null, env.SERVICE_ACCOUNT_PRIVATE_KEY, ['https://www.googleapis.com/auth/spreadsheets']);
      this.auth = googleAuth;
      var sheetId = this.sheetId;
      var me = this;
      return new Promise(function (resolve, reject) {
        googleAuth.authorize(function (err) {
          if (err) {
            reject(err);
          } else {
            console.log("Connected to ".concat(me.sheetName, ". (").concat(me.type, " with ID ").concat(sheetId, ")."));
            console.log("    grant access to: ".concat(process.env.SERVICE_ACCOUNT_EMAIL));
            resolve(me);
          }
        });
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this4 = this;

      var tabTitles;
      /* Retrieve all available resources on a given sheet, and store formatted copies of it where a formatter is available */

      return this.API.spreadsheets.get({
        auth: this.auth,
        spreadsheetId: this.sheetId
      }).then(function (response) {
        tabTitles = response.data.sheets.map(function (sheet) {
          return sheet.properties.title;
        });
        return _this4.API.spreadsheets.values.batchGet({
          auth: _this4.auth,
          spreadsheetId: _this4.sheetId,
          ranges: tabTitles
        });
      }).then(function (results) {
        var tabData = results.data.valueRanges;
        return Promise.all(tabData.map(function (tab, idx) {
          var values = tab.values;

          if (values === undefined) {
            return Promise.resolve({});
          }

          var name = tabTitles[idx];
          return _this4.save(name, values);
        }));
      }).then(this._buildBlueprintsAsync()).then(function () {
        return true;
      })["catch"](function () {
        return false;
      });
    }
  }]);

  return GsheetFetcher;
}(Fetcher);

var LocalFetcher = /*#__PURE__*/function (_Fetcher2) {
  _inherits(LocalFetcher, _Fetcher2);

  var _super2 = _createSuper(LocalFetcher);

  function LocalFetcher(db, name, bps, path) {
    var _this5;

    _classCallCheck(this, LocalFetcher);

    _this5 = _super2.call(this, db, name, bps);
    _this5.path = path;

    _this5.update().then(function (res) {
      return console.log("".concat(res ? 'Successful' : 'Couldn\'t', " update ").concat(name));
    });

    return _this5;
  }

  _createClass(LocalFetcher, [{
    key: "update",
    value: function update() {
      var _this6 = this;

      var wb = _xlsx["default"].readFile(this.path);

      wb.SheetNames.forEach(function (name) {
        var sh = wb.Sheets[name];

        var csv = _xlsx["default"].utils.sheet_to_csv(sh, {
          FS: '\t'
        });

        var ll = csv.split('\n').map(function (line) {
          return line.split('\t');
        });

        _this6.save(name, ll);
      });
      return Promise.resolve(true);
    }
  }]);

  return LocalFetcher;
}(Fetcher);

var _default = {
  'gsheets': GsheetFetcher,
  'xlsx': LocalFetcher,
  'ods': LocalFetcher,
  'local': LocalFetcher
};
exports["default"] = _default;