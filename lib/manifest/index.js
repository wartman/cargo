var _ = require('lodash')
var debug = require('debug')('Cargo:Manifest')
var Collection = require('./collection')
var Document = require('./document')
var IO = require('./io')
var Class = require('../class')

// Manifest
// --------
// Creates a new Manifest instance.
var Manifest = Class.extend({

  constructor: function (options) {
    this.documents = {}
    this.collections = {}

    if (options) 
      this.connect(new IO(options))

    // Use default collections and documents
    this.use('document', Document.extend())
    this.use('collection', Collection.extend())
  },

  // Register a Document or Collection with the Manifest.
  use: function (name, item) {
    if (!item) {
      item = name
      name = null
    }
    if (!name && _.isObject(item)) {
      for (var key in item) {
        if (item.hasOwnProperty(key)) this.use(key, item[key])
      }
      return this
    }
    if (item.prototype instanceof Document) {
      debug('registering document class: %s', name)
      this._registerWith('documents', name, item)
    } else if (item.prototype instanceof Collection) {
      debug('registering collection class: %s', name)
      this._registerWith('collections', name, item)
    } else if (_.isObject(item)) {
      this.use(item)
    } else {
      throw new TypeError('can only use Cargo.Manifest.Documents or Cargo.Manifest.Collections')
    }
    return this
  },

  getIO: function () {
    return this.io
  },

  connect: function (io) {
    debug('connecting to io')
    this.io = io
  },

  // Register as middleware, making collections and documents available
  // in routes as properties in `req`.
  middleware: function () {
    debug('registering middleware methods')
    return function (req, res, next) {
      req.documents = this.documents
      req.collections = this.collections
      next()
    }.bind(this)
  },

  // Register a factory for the provided type.
  _registerWith: function (hash, name, item) {
    if (!_.isString(name)) throw new TypeError()
    var _this = this
    // First letter is always lowercase.
    var propName = name.charAt(0).toLowerCase() + name.substring(1)
    Object.defineProperty(this[hash], propName, {
      get: function () {
        // Return a factory that creates a new instance of the requested
        // item and binds the current IO to it.
        return function (options) {
          var instance = new item(options)
          instance.setIO(_this.getIO())
          return instance
        }
      },
      enumerable: true
    })
  }

})

exports = module.exports = Manifest

exports.Collection = Collection
exports.Document = Document
exports.IO = IO
