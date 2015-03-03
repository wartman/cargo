var _ = require('lodash')
var frontmatter = require('front-matter')
var marked = require('marked')
var Promise = require('bluebird')
var Class = require('../class')
var IO = require('./io')

// Manifest.Document
// -----------------
// Represents a single document or file
var Document = Class.extend({

  // @todo better initilization for paths?
  // @todo Better configuration for $map and $sep? Push all of them
  //       into `this.options` maybe, and then just pass through _.defaults?
  constructor: function (attributes, options) {
    options || (options = {})
    this.cid = _.uniqueId('doc')
    this.attributes = {}
    if (options.collection) this.collection = options.collection
    // Run init first, so we defer to user-defined stuff.
    this.init(options)
    this.idAttribute || (this.idAttribute = 'id')
    this.path || (this.path = this.collection ? this.collection.path : '')
    this.$map || (this.$map = this.collection ? this.collection.$map : {id: 0})
    this.$sep || (this.$sep = this.collection ? this.collection.$sep : '.')
    if (_.isString(attributes)) {
      attributes = this.parseFilename(attributes)
    }
    this.set(attributes, options)
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
      if (key === _this.idAttribute) _this.id = value
    })
    return this
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
  parse: function (resp) {
    // extract content
    var file = resp
    if (!_.isObject(file)) file = {contents: resp}
    if (file.filename) this.parseFilename(file.filename)
    var content = frontmatter(file.contents)
    if (content) {
      this.set(content.attributes)
      // 'Body' is where the markdown lives.
      this.set('body', marked(content.body))
    }
  },

  // Map a string (usually a filename) to attributes.
  parseFilename: function (str) {
    var parts = str.split(this.$sep)
    var attrs = {}
    for (var key in this.$map) {
      attrs[key] = parts[this.$map[key]]
    }
    return attrs
  },

  setIO: function (io) {
    this.io = io
  },

  // Fetch the model by ID or try to load by matching the first attribute.
  load: Promise.method(function () {
    var query = {$map: this.$map, $sep: this.$sep}
    if (this.id) {
      query.id = this.id
    } else {
      query = _.extend(query, this.attributes)
    }
    return this.io.load(this.path, {query: query, single: true})
  })

  // @todo
  // saving. This will also require a more complex parsing ability,
  // to allow you to parse into and parse out of yaml/markdown

})

module.exports = Document
