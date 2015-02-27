var _ = require('lodash')
var Promise = require('bluebird')
var Class = require('../class')
var Document = require('./document')
var IO = require('./io')

// Record.Collection
// -----------------
var Collection = Class.extend({

  constructor: function (documents, options) {
    this.document || (this.document = Document)
    this.documents = []
    this._byID = {}
    if (_.isString(documents)) {
      this.path = documents
    } else {
      this.add(documents, options)
    }
    this.init(options)
    // Auto-set options. This ensures that a user-defined
    // document will be used.
    var proxy = new this.document()
    this.path || (this.path = proxy.path)
    this.$map || (this.$map = proxy.$map)
    this.$sep || (this.$sep = proxy.$sep)
  },

  init: function (options) {
    // user defined
  },

  // Add a new document. If a hash is passed, create a new document
  // from it.
  add: function (doc, options) {
    if (!doc) return this
    options || (options = {})
    options.collection = this
    if (!(doc instanceof Document) && _.isObject(doc)) {
      var attrs = doc
      doc = new this.document(attrs, options)
    }
    this.documents.push(doc)
    this._byID[doc.cid] = doc
    doc.setIO(this.io)
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

  // Return a JSON array of document attributes.
  toJSON: function () {
    var result = []
    this.each(function (doc) {
      result.push(doc.toJSON())
    })
    return result
  },

  query: function (query) {
    this._query = query
    return this
  },

  // Fetch documents and parse them.
  fetch: Promise.method(function () { 
    return this.load()
      .bind(this)
      .then(function (files) {
        _.each(files, this.parse.bind(this))
      }).then(function () {
        return this
      })
  }),

  // Pass data into the registered document type.
  parse: function (file) {
    var doc = new this.document(file.filename, {collection: this})
    doc.parse(file.contents)
    this.add(doc)
    return this
  },

  setIO: function (io) {
    this.io = io
  },

  load: Promise.method(function () {
    var query = {$map: this.$map, $sep: this.$sep}
    if (this._query) {
      query = _.extend(this._query, query)
      delete this._query
    }
    return this.io.load(this.path, {query: query})
  })

})

module.exports = Collection
