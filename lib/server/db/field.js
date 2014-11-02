var _ = require('lodash')
var jajom = require('jajom')

var validator = require('../util/validator')

// Field
// -----
// A helper for creating model schema.
// Has validation and install options, based on
// the type of field this is.
var Field = jajom.Object.extend({

  type: '',

  attributes: function () {
    return {}
  },

  constructor: function (options) {
    options = options || {}
    this.attributes = _.defaults(options, _.result(this, 'attributes'))
  },

  // Parse the field as a Knex column.
  toColumn: function (name, table) {
    var attr = this.attributes
    var type = this.type
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
    var attr = this.attributes
    if (attr.nullable && validator.empty(input)) {
      return true
    } else if (validator.empty(input)) {
      return false
    }
    return this.validateType(input)
  },

  validateType: function () {
    return true
  },

  // Modify input before it is validated.
  parse: function (input) {
    return input
  }

})

// Fields
// ------
// Default field types.
var fields = {}

fields.Str = Field.extend({
  type: 'string'
})

fields.Txt = Field.extend({
  type: 'text'
})

fields.Int = Field.extend({
  type: 'integer',

  validateType: function (input) {
    return validator.isNumeric(input)
  }

})

fields.Email = Field.extend({
  type: 'string',

  validateType: function (input) {
    return validator.isEmail(input)
  }

})

fields.Password = Field.extend({
  type: 'string',
  
  // more??
})

fields.DateTime = Field.extend({
  type: 'dateTime',

  validateType: function (input) {
    // to do
    return true
  }

})

fields.PrimaryKey = Field.extend({
  type: 'increments',

  attributes: function () {
    return {
      nullable: false,
      primary: true
    }
  },

  validateType: function (input) {
    // Not 100% sure how to handle this guy.
    return true
  }

})

fields.Slug = Field.extend({
  type: 'string',

  attributes: function () {
    return {
      nullable: false,
      unique: true
    }
  },

  parse: function (input) {
    return input.replace(/\s/g, '_').toLowerCase()
  },

  validateType: function (input) {
    return true
  }

})

fields.Url = Field.extend({
  type: 'string',

  validateType: function(input) {
    return validator.isURL(input)
  }
})

module.exports.Field = Field
_.each(fields, function (FeildClass, name) {
  module.exports[name] = function (options) {
    return new FeildClass(options)
  }
})
