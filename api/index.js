"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _package = require("../../package.json");

var _express = require("express");

var _en = _interopRequireDefault(require("../copy/en"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(_ref) {
  var config = _ref.config,
      controller = _ref.controller;
  var api = (0, _express.Router)();
  api.get('/', function (req, res) {
    res.json({
      version: _package.version
    });
  });
  api.get('/blueprints', function (req, res) {
    var bps = controller.blueprints();
    res.render('blueprints', {
      bps: bps.map(function (bp) {
        return {
          source: bp.sheet.name,
          tab: bp.name,
          urls: bp.urls
        };
      })
    });
  });
  api.get('/update', function (req, res) {
    controller.update().then(function (msg) {
      return res.json({
        success: msg
      });
    })["catch"](function (err) {
      return res.status(404).send({
        error: err.message,
        err: err
      });
    });
  });
  api.get('/:sheet/:tab/:resource/:frag', function (req, res) {
    var _req$params = req.params,
        sheet = _req$params.sheet,
        tab = _req$params.tab,
        resource = _req$params.resource,
        frag = _req$params.frag;
    controller.retrieveFrag(sheet, tab, resource, frag).then(function (data) {
      return res.json(data);
    })["catch"](function (err) {
      return res.status(err.status || 404).send({
        error: err.message
      });
    });
  });
  api.get('/:sheet/:tab/:resource', function (req, res) {
    var _req$params2 = req.params,
        sheet = _req$params2.sheet,
        tab = _req$params2.tab,
        resource = _req$params2.resource;
    controller.retrieve(sheet, tab, resource).then(function (data) {
      return res.json(data);
    })["catch"](function (err) {
      return res.status(err.status || 404).send({
        error: err.message
      });
    });
  }); // ERROR routes. Note that it is important that these come AFTER routes
  // like /update, so that the regex does not greedily match these routes.

  api.get('/:sheet', function (req, res) {
    res.status(400).send({
      error: _en["default"].errors.onlysheet
    });
  });
  api.get('/:sheet/:tab', function (req, res) {
    res.status(400).send({
      error: _en["default"].errors.onlyTab
    });
  });
  return api;
};

exports["default"] = _default;