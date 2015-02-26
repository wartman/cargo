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
    if (_.isObject(file)){
      options = file
      file = null
    }
    options || (options = {})
    var path = this.resolve(collection)
    debug('starting load: %s', path)
    if (file) {
      options.query = {id: file}
      options.single = true
    }
    return this._readdir(path, options.query)
      .bind(this)
      .then(function (files) {
        // Filter files to load based on provided query
        return this.query(options.query, files)
      })
      .then(function (files) {
        if (options.single) {
          // If no file was found by the filter, throw an error.
          if (!files.length) return Promise.reject(new NotFoundError())
          // Load only the first match.
          return this._exists(this.resolve(collection, files[0], {noExtension: true}))
            .bind(this)
            .then(this._readFile)
        }
        // Load files.
        return Promise.all(files.map(function (file) {
          var path = this.resolve(collection, file, {noExtension: true})
          return this._exists(path)
            .bind(this)
            .then(this._readFile)
            .then(function (contents) {
              return {
                filename: file,
                contents: contents
              }
            })
        }.bind(this)))
      })
  }),

  // An ugly query method.
  // This is just the first pass, needs a lot of cleanup.
  query: function (filter, files) {
    if (!filter) return files
    var ext = '.' + this.get('extension')
    files.sort() // Should automatically sort based on ID
    files = files.filter(function (file) {
      if (path.extname(file) !== ext) return false
      var name = file.replace(ext, '')
      var parts = name.split('.')
      // names are split up by [id].[name]
      // If the length === 1, then assume the filename only has an ID
      if (parts.length > 1) {
        if (filter.id) 
          return filter.id === parts[0]
        if (filter.name)
          return filter.name === parts[1]
      } 
      if (filter.id)
        return filter.id === name
      if (filter.contains)
        return name.indexOf(filter.contains) > -1 
      return true
    })
    if (filter.start || filter.limit) {
      var start = 0
      if (filter.start) {
        files.forEach(function (file, index) {
          if (start) return
          var name = file.replace(ext, '')
          var parts = name.split('.')
          if (filter.start === parts[0]) start = index
        })
      }
      var limit = filter.limit ? start + filter.limit : files.length
      files = files.slice(start, limit)
    }
    return files
  },

  // Read all files in a dir. Note: For now, this is NOT recursive.
  _readdir: function (pathName) {
    var ext = '.' + this.get('extension')
    var _this = this
    return new Promise(function (resolve, reject) {
      fs.readdir(pathName, function (err, files) {
        if (err) {
          reject(err)
        } else {
          debug('directory found: %s', pathName)
          files = files.filter(function (file) {
            // Only include files that end with our specified
            // extension.
            return path.extname(file) === ext 
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
        if (!exists) {
          reject(new NotFoundError(path))
        } else {
          debug('file exists: %s', path)
          resolve(path)
        }
      })
    })
  }

})

module.exports = IO
