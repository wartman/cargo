var _ = require('lodash')
var Class = require('./class')

// Set
// ---
// A simple configurable class.
var Set = Class.extend({

  constructor: function (defaults, options) {
    defaults || (defaults = {})
    this._handlers = {}
    if (options) 
      this._options = _.defaults(options, defaults)
    else
      this._options = defaults
  },

  // Set a key or keys. Pass an Object Literal to `key`
  // to set many keys at once.
  set: function (key, value) {
    if ('object' === typeof key) {
      for (var item in key) {
        this.set(item, key[item])
      }
      return this
    }
    if (this._handlers[key])
      value = this._handlers[key].set(value)
    if (!value) return this
    this._options[key] = value
    return this
  },

  // Get a key or keys. Pass an array to `key` to get
  // several keys at once.
  get: function (key, def) {
    if (!key) return this._options
    if (Array.isArray(key)) {
      var results = {}
      key.forEach(function(key) {
        results[key] = this.get(key)
      }.bind(this))
      return results
    }
    var val = this._options[key]
    if (this._handlers[key])
      val = this._handlers[key].get(val)
    return val ? val : def
  },

  // Similar to Object.defineProperty, this method
  // lets you define custom getters and setters for
  // a given option.
  //
  //    set.defineOption('foo', {
  //      get: function (value) {
  //        // `value` is the current value of the key
  //        return 'foo' + value
  //      },
  //      set: function (value) {
  //        // Return the value you want to set
  //        return value + 'foo'
  //      }
  //    })
  //
  defineOption: function (key, handlers) {
    if ('object' !== typeof handlers)
      throw new TypeError('handlers must be an object')
    handlers.set = (handlers.set)
      ? handlers.set.bind(this)
      : function (value) { return value }.bind(this)
    handlers.get = (handlers.get)
      ? handlers.get.bind(this)
      : function (value) { return value }.bind(this)
    this._handlers[key] = handlers
    return this
  }

})

module.exports = Set
