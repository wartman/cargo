var _ = require('lodash')
var Promise = require('bluebird')
var Class = require('../class')
var Loader = require('./loader')

// Rabbit.Record.Document
// ----------------------
// Represents a single document or file
var Document = Class.extend({

  constructor: function (attributes, options) {
    this.path = ''
    this.attributes = {}
    this.set(attributes, options)
  },

  // Set an attribute
  set: function (key, value, options) {

  },


  get: function (key) {

  },

  fetch: Promise.method(function () {

  }),

  // Parse a loaded file
  parse: function (file) {

  },

  load: Promise.method(function (fileId) {
    var loader = Loader.getInstance()
    return loader.load(this.path, fileId)
  })

})

module.exports = Document
