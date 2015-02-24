var _ = require('lodash')
var Promise = require('bluebird')
var Class = require('../class')
var Document = require('./document')
var Loader = require('./loader')

// Rabbit.Record.Collection
// ------------------------
var Collection = Class.extend({

  constructor: function (documents, options) {
    this.document || (this.document = Document)
    this.path || (this.path = '')
    this.documents = []
    this._byID = {}
    if (_.isString(documents)) {
      this.path = documents
    } else {
      this.add(documents, options)
    }
    this.init(options)
  },

  init: function (options) {
    // user defined
  },

  // Add a new document. If a hash is passed, create a new document
  // from it.
  add: function (doc, options) {
    if (!doc) return this
    if (!(doc instanceof Document) && _.isObject(doc)) {
      var attrs = doc
      doc = new this.document(attrs, options)
    }
    this.documents.push(doc)
    this._byID[doc.cid] = doc
    if (doc.id)
      this._byID[doc.id] = doc
    return this
  },

  get: function (id) {
    if (id instanceof Document)
      return _.findWhere(this.documents, id)
    else return this._byID[id]
  },

  at: function (index) {
    return this.documents[index]
  },

  each: function (cb) {
    _.each(this.documents, cb.bind(this))
  },

  // Fetch documents and parse them.
  fetch: Promise.method(function () { 
    return this.load()
      .bind(this)
      .then(function (files) {
        _.each(files, this.parse.bind(this))
      }).then(function () {
        return this.documents
      })
  }),

  // Pass data into the registered document type.
  parse: function (file, id) {
    var doc = new this.document(id)
    doc.parse(file)
    this.add(doc)
    return this
  },

  load: Promise.method(function () {
    var loader = Loader.getInstance()
    return loader.load(this.path)
  })

})

module.exports = Collection
