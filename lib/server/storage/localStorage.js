var express = require('express');
var fs = require('fs');
var Promise = require('bluebird');

var StorageBase = require('./base');
var config = require('../config').getInstance();
var util = require('../util');

// LocalStorage
// ------------
// Store things locally.
var LocalStorage = StorageBase.extend({

  // Save the image to the file system.
  // - image is the express image object
  // - returns a promise which ultimately returns the full url to the uploaded image  
  save: function (image) {
    var targetDir = this.getTargetDir(config.get('paths').media);
    var targetFilename;
    return this.getUniqueFilename(this, image, targetDir)
      .then(function (filename) {
        targetFilename = filename;
        return Promise.promisify(fs.mkdirs)(targetDir);
      }).then(function () {
        return Promise.promisify(fs.copy)(image.path, targetFilename);
      }).then(function () {
        // Convert path to URI
        var fullURL = path.relative(config.get('paths').media, targetFilename)
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
    return express['static'](config.get('paths').media, {maxAge: util.ONE_YEAR_MS})
  }

});

module.exports = LocalStorage;
