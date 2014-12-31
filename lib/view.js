var _ = require('lodash')
var events = require('events')
var Class = require('./class')

// View
// ----
var View = Class.extend({

  constructor: function View(req, res) {
    events.EventEmitter.call(this)
    this._locals = req.locals
    this.req = req
    this.res = res
  },

  getReq: function () {
    return this.req
  },

  getRes: function () {
    return this.res
  },

  setLocals: function (key, value) {
    if ('object' === typeof key) {
      _.extend(this._locals, key)
      return this
    }
    this._locals[key] = value
    return this
  },

  getLocals: function (key) {
    if (key) return this._locals[key]
    return this._locals
  },

  pre: function (event, fn) {
    // to do
  },

  post: function (event, fn) {
    // to do
  },

  render: function (path, locals) {
    locals || (locals = {})
    locals = _.extend(this.getLocals(), locals)
    this.res.render(path, locals)
  }

})

_.extend(View.prototype, events.EventEmitter.prototype)

module.exports = View
