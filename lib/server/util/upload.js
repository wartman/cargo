var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var Base = require('../../both/oop/base');
var singleton = require('../../both/oop/mixins').singleton;

// Upload
// ------

var Upload = module.exports = Base.extend({

  constructor: function () {
    // body...
  },

  validate: function () {
    // make sure its an image
  },

  save: function (path, dest) {
    return readFile(path, function (err, data) {
  }

}, singleton);