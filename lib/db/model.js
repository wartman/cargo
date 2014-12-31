var _ = require('lodash')
var moment = require('moment')
var util = require('../util')
var Class = require('../class')

// Model
// -----
// Not the actual model, this is a wrapper for a Bookshelf
// model that is created once a DB connection is made.
var Model = Class.extend({

  constructor: function (name, schema) {
    this._wrapped = null
    this._methods = {}
    if (schema.tableName) {
      // By default, `name` will be used as the table name,
      // but you can pass a custom one too.
      this._methods.tableName = schema.tableName.trim()
      this._tableName = schema.tableName.trim()
      delete schema.tableName
    } else {
      this._tableName = util.pluralize(name).toLowerCase().trim()
      this._methods.tableName = this._tableName
    }    this._schema = schema
    this._staticMethods = {}
    this._name = name
    return this
  },

  // Get the schema this model was created with
  getSchema: function () {
    return this._schema
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
  getBookshelfModel: function (options) {
    if (options)
      return new this._wrapped(options)
    return this._wrapped
  },

  // Add to the registry. You should always run this last.
  register: function () {
    this.constructor.registerModel(this._name, this)
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

Model._defaultMethods = {}
Model._defaultStaticMethods = {}
Model._registry = {}

// Add methods that will be applied to ALL models
Model.addDefaultMethods = function () {
  _.each(arguments, function (obj) {
    _.extend(this._defaultMethods, obj)
  }.bind(this))
}

// Add static methods that will be applied to ALL models
Model.addDefaultStaticMethods = function () {
  _.each(arguments, function (obj) {
    _.extend(this._defaultStaticMethods, obj)
  }.bind(this))
}

// Get a registered model
Model.getModel = function (name) {
  if (!name) return this._registry
  return this._registry[name]
}

Model.getModels = function () {
  return this._registry
}

// Register a model
Model.registerModel = function (name, model) {
  this._registry[name] = model
  return this
}

// Check if a model exists in the registry
Model.hasModel = function (name) {
  return !!this._registry[name]
}

// Compile all registered models using the provided
// bookshelf connection.
Model.compileModels = function (bookshelf) {
  _.each(this.getModel(), function (model) {
    model.compile(bookshelf)
  })
  return this
}

Model.addDefaultMethods({

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

Model.addDefaultStaticMethods({

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

module.exports = Model
