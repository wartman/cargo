var express = require('express');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var StorageBase = require('./base');
var config = require('../config').getInstance();
var util = require('../util');

// LocalStorage
// ------------
// Store things locally.
var LocalStorage = StorageBase.extend({

  constructor: function (options) {
    this.options = _.defaults(options || {}, {
      baseDir: ''
    });
  },

  // Save the image to the file system.
  // - image is the express image object
  // - returns a promise which ultimately returns the full url to the uploaded image  
  save: function (image) {
    var self = this;
    var targetDir = this.getTargetDir(this.options.baseDir);
    var targetFilename;
    return this.getUniqueFilename(this, image, targetDir)
      .then(function (filename) {
        targetFilename = filename;
        return fs.mkdirsAsync(targetDir);
      }).then(function () {
        return fs.copyAsync(image.path, targetFilename);
      }).then(function () {
        // Convert path to URI
        var fullURL = path.relative(self.options.baseDir, targetFilename)
          .replace(new RegExp('\\' + path.sep, 'g'), '/');
        return fullUrl;
      }).catch(function (err) {
        // log errors somehow!
        // errors.logError(err)
        return Promise.reject(err);
      });
  },

  // Does what it says on the tin.
  exists: function (filename) {
    return new Promise(function (res, rej) {
      fs.exists(filename, function (exists) {
        res(exists);
      });
    });
  },

  // Middleware for serving files.
  serve: function () {
    return express['static'](this.options.baseDir, {maxAge: util.ONE_YEAR_MS});
  }

});

// Set instance using default configuration.
LocalStorage.setInstance({
  baseDir: config.get('paths').media
});

module.exports = LocalStorage;
