var _ = require('lodash')
var frontmatter = require('front-matter')
var marked = require('marked')
var Promise = require('bluebird')
var Class = require('../class')
var IO = require('./io')

// Record.Document
// ---------------
// Represents a single document or file
var Document = Class.extend({

  // @todo better initilization for paths?
  constructor: function (attributes, options) {
    this.cid = _.uniqueId('doc')
    this.path || (this.path = '')
    this.idAttribute || (this.idAttribute = 'id')
    this.attributes = {}
    if (_.isString(attributes)) {
      var id = attributes
      attributes = {}
      attributes[this.idAttribute] = id
    }
    this.set(attributes, options)
    this.init(options)
  },

  init: function (options) {
    // user defined
  },

  // Set an attribute
  set: function (key, value, options) {
    var attrs = key
    if (!_.isObject(key)) {
      attrs = {}
      attrs[key] = value
    } else {
      options = value
    }
    options || (options = {})
    var _this = this
    _.each(attrs, function (value, key) {
      _this.attributes[key] = value
      if (key === _this.idAttribute) 
        _this.attributes[key] = _this.setId(value)
    })
    return this
  },

  setId: function (id) {
    // Make sure no extensions get passed in
    if (_.isString(id) && id.indexOf('.') > 0) { 
      var parts = id.split('.')
      id = parts[0]
    }
    this.id = id
    return id 
  },

  // Get an attribute
  get: function (key) {
    return this.attributes[key]
  },

  has: function (key) {
    return !!this.attributes[key]
  },

  // Return a clone of this.attributes
  toJSON: function () {
    return _.clone(this.attributes)
  },

  fetch: Promise.method(function () {
    return this.load().bind(this).then(function (file) {
      this.parse(file)
      return this
    })
  }),

  // Parse a loaded file
  parse: function (file) {
    // extract content
    var content = frontmatter(file)
    if (content) {
      this.set(content.attributes)
      // 'Body' is where the markdown lives.
      this.set('body', marked(content.body))
    }
  },

  setIO: function (io) {
    this.io = io
  },

  // Fetch the model by ID or try to load by matching the first attribute.
  load: Promise.method(function () {
    if (this.id)
      return this.io.load(this.path, this.id)
    else
      return this.io.load(this.path, {query: this.attributes, single: true})
  })

  // @todo
  // saving. This will also require a more complex parsing ability,
  // to allow you to parse into and parse out of yaml/markdown

})

module.exports = Document
