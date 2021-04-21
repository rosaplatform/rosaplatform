"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable */

/**
 * Model is a class whose sole responsibility is to save and load data through a custom URL format.
 * As an interfacce, it allows for different storage mechanisms, and different scale/performance for different kinds of data.
 * 
 * ERRORS:
 * When a load function fails, it should throw either:
 * 1. noResource(parts) if the resource doesn't exist on that sheet/tab.
 * 2. noFragment(parts) if a fragment lookup fails because it doesn't exist.
 * 3. modelLayerGeneric(parts) if something else goes wrong.
 *
 * This is a WIP layer. See StoreJson.js for an example in action.
 */
var Model = /*#__PURE__*/function () {
  function Model() {
    _classCallCheck(this, Model);
  }

  _createClass(Model, [{
    key: "index",

    /**
     * Index the data stored by this model, returning a list of the available URLs. 
     * @return {Promise(boolean)} Unpacks to a list of available URLs if successful, throws an error otherwise.
     */
    value: function index() {}
    /**
     * Save data at a URL. The URL is in the format
     *    /:fetcherID/:tab/:resource
     * Fetcher IDs must be unique, tabs and resources can be duplicated across
     * different fetchers.
     * 
     * @param  {string} url - the URL at which to save the data.
     * @param  {object} data - the data to be saved.
     * @return {Promise(boolean)} Unpacks to true if the update was successful, false if otherwise.
     */

  }, {
    key: "save",
    value: function save(url, data) {}
    /**
     * Load data from a URL, in the format
     *    /:fetcherID/:tab/:resource
     * 
     * @param  {string} url - the URL at which to load the data.
     * @return {Promise(object)} a Promise that unpacks to the data retrieved. An error will be thrown if the URL is invalid.
     */

  }, {
    key: "load",
    value: function load(url) {}
  }]);

  return Model;
}();