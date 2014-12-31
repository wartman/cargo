var _ = require('lodash')
var Class = require('../class')
var validator = require('../util').validator

// Field
// -----
// A helper for creating model schema.
// Has validation and install options, based on
// the type of field this is.
var Field = Class.extend({

  attributes: function () {
    return {}
  },

  type: function () {
    return 'string'
  },

  validators: function () {
    return []
  },

  constructor: function (options) {
    options || (options = {})
    this
      .addValidators(_.result(this, 'validators'))
      .setType(_.result(this, 'type'))
      .setAttributes(_.defaults(options, _.result(this, 'attributes')))
  },

  // Parse the field as a Knex column.
  toColumn: function (name, table) {
    var attr = this.getAttributes()
    var type = this.getType()
    var column

    if (type === 'text' && attr.hasOwnProperty('fieldtype')) {
      column = table[type](name, attr.fieldtype)
    } else if (type === 'string' && attr.hasOwnProperty('maxlength')) {
      column = table[type](name, attr.maxlength)
    } else {
      column = table[type](name)
    }

    if (attr.hasOwnProperty('nullable') && attr.nullable === true) {
      column.nullable()
    } else {
      column.notNullable()
    }

    if (attr.hasOwnProperty('primary') && attr.primary === true)
      column.primary()
    if (attr.hasOwnProperty('unique') && attr.unique === true)
      column.unique()
    if (attr.hasOwnProperty('unsigned') && attr.unsigned)
      column.unsigned()
    if (attr.hasOwnProperty('references'))
      column.references(attr.references)
    if (attr.hasOwnProperty('defaultTo'))
      column.defaultTo(attr.defaultTo)

    return column
  },

  // This will be run whenever saving or creating
  // a model.
  validate: function (input) {
    var attr = this.getAttributes()
    if (attr.nullable && validator.empty(input)) {
      return true
    } else if (validator.empty(input)) {
      return false
    }
    var result = true
    _.each(this.getValidators(), function (fn) {
      if (!fn(input)) result = false
    })
    return result
  },

  addValidators: function (fn) {
    if (!this._validators) this._validators = []
    if (_.isArray(fn)) {
      fn.forEach(function (fn) {
        this.addValidators(fn)
      }.bind(this))
      return this
    }
    this._validators.push(fn)
    return this
  },

  getValidators: function () {
    return this._validators
  },

  setType: function (type) {
    this._type = type
    return this
  },

  getType: function () {
    return this._type
  },

  setAttributes: function (attrs) {
    this._attributes = attrs
    return this
  },

  getAttributes: function () {
    return this._attributes
  },

  // Modify input before it is validated.
  parse: function (input) {
    return input
  }

})

module.exports = Field
