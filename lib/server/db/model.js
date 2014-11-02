var _ = require('lodash')
var jajom = require('jajom')
var uuid = require('node-uuid')
var moment = require('moment')

var util = require('../util')

// Model
// -----
// Not the actual model, this is a wrapper for a Bookshelf
// model that is created once a DB connection is made.
var Model = jajom.Object.extend({

	constructor: function (name, schema) {
		this._wrapped = null
		this._methods = {}
		if (schema.tableName) {
			// By default, `name` will be used as the table name,
			// but you can pass a custom one too.
			this._methods.tableName = schema.tableName
			this._tableName = schema.tableName
			delete schema.tableName
		}
		this._schema = schema
		this._staticMethods = {}
		this._name = name
		return this
	},

	// Get the schema this model was created with
	getSchema: function () {
		return this._schema
	},

	// Get the wrapped bookshelf model. If an options object
	// is passed, this will create an instance. Otherwise, the model
	// will be returned.
	getBookshelfModel: function (options) {
		if (options)
			return new this._wrapped(options)
		return this._wrapped
	},

	// Methods to be added to the bookshelf model.
	methods: function () {
		_.each(arguments, function (obj) {
			_.extend(this._methods, obj)
		}.bind(this))
		return this
	},

	staticMethods: function () {
		_.each(arguments, function (obj) {
			_.extend(this._staticMethods, obj)
		}.bind(this))
		return this
	},

	// Add to the registry. You should always run this last.
	register: function () {
		this.constructor._registry[this._name] = this
	},

	// Create the actual Bookshelf model, mixing in any custom methods
	compile: function (bookshelf) {
		this._methods._schema = this._schema
		_.defaults(this._methods, this.constructor._defaultMethods)
		_.defaults(this._staticMethods, this.constructor._defaultStaticMethods)
		this._wrapped = bookshelf.Model.extend(this._methods, this._staticMethods)
		var collection = bookshelf.Collection.extend({
			model: this._wrapped
		})
		// Register with bookshelf too
		bookshelf.model(this._name, this._wrapped)
		bookshelf.collection(util.pluralize(this._name), collection)
		return this._wrapped
	}

}, {

	_registry: {},

	_defaultMethods: {},
	_defaultStaticMethods: {},

	// Add default mixins
	defaultMethods: function () {
		_.each(arguments, function (obj) {
			_.extend(this._defaultMethods, obj)
		}.bind(this))
	},

	// Add default mixins
	defaultStaticMethods: function () {
		_.each(arguments, function (obj) {
			_.extend(this._defaultStaticMethods, obj)
		}.bind(this))
	}

})

// Setup defaults
Model.defaultMethods({

	defaults: function () {
    return {
      uuid: uuid.v4(),
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

Model.defaultStaticMethods({

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
