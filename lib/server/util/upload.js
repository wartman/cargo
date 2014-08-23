var fs = require('fs');
var when = require('when');

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