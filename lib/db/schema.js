var _ = require('lodash')
var moment = require('moment')
var util = require('../util')
var Class = require('../class')

// Schema
// ------
// A wrapper that creates bookshelf models and binds them
// to a given schema. This also allows db connections to be made
// after defining models.
var Schema = Class.extend({

  constructor: function (name, schema) {
    this._wrapped = null
    this._methods = {}
    this._staticMethods = {}
    this._name = name
    if (schema.tableName) {
      // By default, `name` will be used as the table name,
      // but you can pass a custom one too.
      this._methods.tableName = schema.tableName.trim()
      this._tableName = schema.tableName.trim()
      delete schema.tableName
    } else {
      this._tableName = util.pluralize(name).toLowerCase().trim()
      this._methods.tableName = this._tableName
    }
    this._schema = schema
    return this
  },

  // Get the schema this model was created with
  getSchema: function () {
    return this._schema
  },

  getTableName: function () {
    return this._tableName
  },

  // Methods to be added to the bookshelf model.
  addMethods: function () {
    _.each(arguments, function (obj) {
      _.extend(this._methods, obj)
    }.bind(this))
    return this
  },

  // Get methods
  getMethods: function () {
    return this._methods
  },

  // Class methods to be added to the bookshelf model.
  addStaticMethods: function () {
    _.each(arguments, function (obj) {
      _.extend(this._staticMethods, obj)
    }.bind(this))
    return this
  },

  // Get static methods
  getStaticMethods: function () {
    return this._staticMethods
  },

  // Get the wrapped bookshelf model. If an options object
  // is passed, this will create an instance. Otherwise, the model
  // will be returned.
  getModel: function (options) {
    if (options)
      return new this._wrapped(options)
    return this._wrapped
  },

  // Add to the registry. You should always run this last.
  register: function () {
    this.constructor.registerSchema(this._name, this)
    return this
  },

  // Create the actual Bookshelf model, mixing in any custom methods
  compile: function (bookshelf) {
    this._methods._schema = this._schema
    this._methods = _.defaults(this._methods, this.constructor._defaultMethods)
    this._staticMethods = _.defaults(this._staticMethods, this.constructor._defaultStaticMethods)
    this._wrapped = bookshelf.Model.extend(this._methods, this._staticMethods)
    var collection = bookshelf.Collection.extend({
      model: this._wrapped
    })
    // Register with bookshelf too
    bookshelf.model(this._name, this._wrapped)
    bookshelf.collection(util.pluralize(this._name), collection)
    return this._wrapped
  }

})

Schema._defaultMethods = {}
Schema._defaultStaticMethods = {}
Schema._registry = {}

// Add methods that will be applied to ALL models
Schema.addDefaultMethods = function () {
  _.each(arguments, function (obj) {
    _.extend(this._defaultMethods, obj)
  }.bind(this))
}

// Add static methods that will be applied to ALL models
Schema.addDefaultStaticMethods = function () {
  _.each(arguments, function (obj) {
    _.extend(this._defaultStaticMethods, obj)
  }.bind(this))
}

// Get a registered schema
Schema.getSchema = function (name) {
  if (!name) return this._registry
  return this._registry[name]
}

Schema.getSchemas = function () {
  return this._registry
}

// Register a model
Schema.registerSchema = function (name, model) {
  this._registry[name] = model
  return this
}

// Check if a model exists in the registry
Schema.hasSchema = function (name) {
  return !!this._registry[name]
}

// Compile all registered models using the provided
// bookshelf connection.
Schema.createModels = function (bookshelf) {
  _.each(this.getSchemas(), function (model) {
    model.compile(bookshelf)
  })
  return this
}

// Helper to create new schemas. Preferred to creating
// new classes directly.
Schema.add = function (name, definition) {
  var methods = {}
  var staticMethods = {}
  if (definition.methods) {
    methods = definition.methods
    delete definition.methods
  }
  if (definition.staticMethods) {
    staticMethods = definition.staticMethods
    delete definition.staticMethods
  }
  var schema = new Schema(name, definition)
  return schema
    .addMethods(methods)
    .addStaticMethods(staticMethods)
    .register()
}

// Setup defaults

Schema.addDefaultMethods({

  defaults: function () {
    return {
      created: moment().format(),
      updated: moment().format()
    }
  },

  initialize: function () {
    this.on('saving', this.validate, this)
  },

  validate: function () {
    // work on it
  }

})

Schema.addDefaultStaticMethods({

  // Add a new model.
  add: function (attributes, options) {
    return this.forge(attributes, options).save()
  },

  // Delete a matching model.
  remove: function (attributes, options) {
    return this.forge(attributes, options).destroy()
  },

  // Find a single item.
  findOne: function (attributes, options) {
    return this.forge(attributes, options).fetch(options)
  },

  // Get a collection of items.
  findAll: function (attributes, options) {
    return this.forge(attributes, options).fetchAll(options)
  },

  getSchema: function () {
    return this.prototype._schema
  }

})

module.exports = Schema
