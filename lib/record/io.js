var _ = require('lodash')
var path = require('path')
var debug = require('debug')('Rabbit:Record:IO')
var Base = require('../base')
var Promise = require('bluebird')
var NotFoundError = require('../errors/not-found-error')
var fs = require('fs')

// Record.IO
// ---------
// Input/Output for records (only Input for now).
var IO = Base.extend({
  
  constructor: function (options) {
    this.super(_.defaults(options || {}, {
      'base path': '',
      'extension': 'md'
    }))
  },

  // Resolve a path
  resolve: function(collection, file, options) {
    if (_.isObject(file)) {
      options = file
      file = null
    }
    options || (options = {})
    if (file) {
      file = options.noExtension ? file : file + '.' + this.get('extension')
      return path.join(this.get('base path'), collection, file)
    }
    return path.join(this.get('base path'), collection)
  },

  // Load relative to the collection and file. If only a collection is passed,
  // `load` will return an object of `filename:contents`
  load: Promise.method(function(collection, file, options) {
    var path = this.resolve(collection, file)
    debug('loading file: %s', path)
    if (file) {
      return this._exists(path)
        .bind(this)
        .then(this._readFile)
    } else if (collection) {
      return this._readdir(path)
        .bind(this)
        .then(function (files) {
          // handle filtering here
          // for now, just read em all.
          var mappedFiles = {}
          return Promise.all(files.map(function (file) {
            var path = this.resolve(collection, file, {noExtension: true})
            return this._exists(path)
              .bind(this)
              .then(this._readFile)
              .then(function (body) {
                mappedFiles[file] = body
              })
          }.bind(this)))
            .then(function () {
              return mappedFiles
            })
        })
    }
    return Promise.reject('Nothing to find')
  }),

  // Read all files in a dir. Note: For now, this is NOT recursive.
  _readdir: function (path) {
    var ext = '.' + this.get('extension')
    return new Promise(function (resolve, reject) {
      fs.readdir(path, function (err, files) {
        if (err) {
          reject(err)
        } else {
          files = files.filter(function (file) {
            // Only include files that end with our specified
            // extension.
            return file.lastIndexOf(ext) === ext.length 
          })
          resolve(files)
        }
      })
    })
  },

  // Read a single file. Returns a promise.
  _readFile: function (path) {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf-8', function (err, file) {
        if (err) {
          reject(err)
        } else {
          debug('file loaded: %s', path)
          resolve(file)
        }
      })
    })
  },

  // Check if a file exists. If it does, will resolve a promise
  // with the matching path.
  _exists: function (path) {
    return new Promise(function (resolve, reject) { 
      fs.exists(path, function (exists) {
        if (!exists) 
          reject(new NotFoundError(path))
        else {
          debug('file exists: %s', path)
          resolve(path)
        }
      })
    })
  }

})

module.exports = IO
