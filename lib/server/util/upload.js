var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var Base = require('../core/base');
var mixins = Base.mixins;

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
    return fs.readFile(path, 'utf-8')
      .then(function (data) {
        return fs.writeFile(dest, data)
      })
    return when.promise(function (res, rej) {
      fs.readFile(path, function (err, data) {
        if (err) rej(err);
        fs.writeFile(dest, data, function (err) {
          if (err) 
            rej(err);
          else
            res(data);
        });
      });
    });
  }

}, singleton);