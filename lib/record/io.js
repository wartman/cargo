var _ = require('lodash')
var path = require('path')
var debug = require('debug')('Rabbit:Record:IO')
var Base = require('../base')
var Promise = require('bluebird')
var NotFoundError = require('../errors/not-found-error')
var fs = require('fs')

// Used to filter options in _parseQuery
var dollarFilters = [
  '$map', '$sep', '$startAtIndex', '$startAtId',
  '$limit', '$contains'
]

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

  // Run a query on the provided files array, filtering out
  // any that don't match.
  query: function (rawAttrs, files) {
    var q = this._parseQuery(rawAttrs || {})
    var config = q.config
    var attrs = q.attrs
    var idPos = config.$map.id // Common-use, so cache it
    debug('running query')
    files.sort() // May make configurable in the future?
    files = files.filter(function (fileName) {
      var parts = fileName.split(config.$sep)
      if (attrs.id) return attrs.id === parts[idPos]
      for (var key in attrs) {
        if (attrs[key] !== parts[config.$map[key]]) return false
      }
      if (config.$contains) {
        return parts.indexOf(config.$contains) > -1
      }
      return true
    })
    if (!files.length) return files
    var start = 0
    if (config.$startAtId) {
      for (var i = 0, len = files.length; i < len; i++) {
        if (files[i].split(config.$sep)[idPos] === config.$startAtId){
          start = i
          break
        }
      }
    } else if (config.$startAtIndex !== undefined) {
      for (var i = 0, len = files.length; i < len; i++) {
        if (i === config.$startAtIndex) {
          start = i
          break
        }
      }
    }
    if (!start && !config.$limit) return files
    var limit = config.$limit ? start + config.$limit : files.length
    files = files.slice(start, limit)
    return files
  },

  // This method extracts `$` options from a provided query. Available
  // options:
  //  
  // - $map: A hash matching attribute-keys to their position in the
  //         filename. For example, `{id: 0}` will match position '0' in
  //         the following filename: `[0].[1].md`
  // - $sep: The separator to use on filenames. Defaults to '.'.
  // - $startAtId: Start loading files at the given id.
  // - $startAtIndex: Start loading files at the given index in the array.
  // - $limit: Only load this number of files.
  // - $contains: Load any file that matches this string somewhere 
  //         in its filename.
  //
  // Returns an object containing a `config` property with these options
  // and a filtered `attrs` property.
  _parseQuery: function (attrs) {
    return {
      config: _.defaults(attrs, _.pick(dollarFilters), {
        $map: {id: 0, name: 1},
        $sep: '.',
      }),
      attrs: _.omit(attrs, dollarFilters)
    }
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
  _readFile: function (fileName) {
    return new Promise(function (resolve, reject) {
      fs.readFile(fileName, 'utf-8', function (err, file) {
        if (err) {
          reject(err)
        } else {
          debug('file loaded: %s', fileName)
          resolve(file)
        }
      })
    })
  },

  // Check if a file exists. If it does, will resolve a promise
  // with the matching path.
  _exists: function (fileName) {
    return new Promise(function (resolve, reject) { 
      fs.exists(fileName, function (exists) {
        if (!exists) {
          reject(new NotFoundError(fileName))
        } else {
          debug('file exists: %s', fileName)
          resolve(fileName)
        }
      })
    })
  }

})

module.exports = IO
