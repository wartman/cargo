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

  use: function (name, item) {
    if (item.prototype instanceof Document) {
      debug('registering document class: %s', name)
      this._registerWith('documents', name, item)
    } else if (item.prototype instanceof Collection) {
      debug('registering collection class: %s', name)
      this._registerWith('collections', name, item)
    } else {
      throw new Error('can only use Cargo.Manifest.Documents or Cargo.Manifest.Collections')
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

  middleware: function () {
    debug('registering middleware methods')
    return function (req, res, next) {
      req.documents = this.documents
      req.collections = this.collections
      next()
    }.bind(this)
  },

  _registerWith: function (hash, name, item) {
    var _this = this
    Object.defineProperty(this[hash], name, {
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
