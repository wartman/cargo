var moment = require('moment');
var path = require('path');

var Base = require('../core/base').Base;
var mixins = require('../core/base').mixins;

// StorageBase
// -----------
// Generic handler for file-storage. Based on ghost's implementation.
var StorageBase = Base.extend({

  constructor: function (options) {
    this.options = options;
  },

  // Get a directory where folders are based on year/month
  getTargetDir: function (baseDir) {
    var m = moment(new Date().getTime());
    var month = m.format('MM');
    var year = m.format('YYYY');
    if (baseDir)
      return path.join(baseDir, year, month);
    return path.join(year, month);
  },

  // Generate a unique ID for this file.
  generateUnique: function (store, dir, name, ext, i) {
    var self = this;
    var append = (i)? '-' + i : '';
    var filename = path.join(dir, name + append + ext);
    
    return store.exists(filename).then(function (exists) {
      if (exists) {
        i = i + 1;
        return self.generateUnique(store, dir, name, ext, i);
      } else {
        return filename;
      }
    });
  },

  // Get a unique filename.
  getUniqueFilename: function (store, image, targetDir) {
    var ext = path.extname(image.name);
    var name = path.basename(image.name, ext).replace(/[\W]/gi, '-');
    var self = this;
    return self.generateUnique(store, targetDir, name, ext, 0);
  }

}, {

  setInstance: function (options) {
    this._instance = new this.prototype.constructor(options);
  }

});

StorageBase.mixinStatic(mixins.singleton);

module.exports = StorageBase;
