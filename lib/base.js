var _ = require('lodash')
var events = require('events')
var Class = require('./class')

// Base
// ----
// Base class most other classes extend. Adds 'set' and
// 'get' methods, as well as events.
var Base = Class.extend({

  constructor: function (options) {
    events.EventEmitter.call(this)
    this.options = {}
    if (options) this.set(options)
  },

  // Set a key or keys.
  set: function (key, value) {
    var attrs = key
    if (!_.isObject(key)) {
      attrs = {}
      attrs[key] = value
    }
    for (var key in attrs) {
      this.options[key] = attrs[key]
    }
    return this
  },

  // Get a key or keys from the options.
  get: function (key) {
    return this.options[key]
  }

})

// Add in the events.EventEmitter
Base.prototype = _.extend(Base.prototype, events.EventEmitter.prototype)
Base.prototype.constructor = Base

module.exports = Base
