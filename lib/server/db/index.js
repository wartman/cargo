var _ = require('lodash')
var knex = require('knex')
var bookshelf = require('bookshelf')

var Model = require('./model')
var Migrations = require('./migrations')
var Logger = require('../util/logger')

// DB
// --
// A wrapper around Bookshelf, `db` allows us to define
// models BEFORE connecting to a database. 
var db = {

	Model: Model,

	model: function (name, options) {
		if (this.Model._registry.hasOwnProperty(name))
			return this.Model._registry[name].getBookshelfModel(options)
		else {
			throw new Error('no model of that name exists: ' + name)
		}
	},

	field: require('./field'),

	// Connect to the database and register all models with bookshelf
	connect: function (database) {
		this._connection = knex(database)
		this._bookself = bookshelf(this._connection)
		this._bookself.plugin('registry')

		// NOTE: this is temp. Come up with a flexible way to include these guys.
		require('../models/category')
		require('../models/project')
		require('../models/role')
		require('../models/setting')
		require('../models/user')

		_.each(this.Model._registry, function (Model, name) {
			Model.compile(this._bookself)
		}.bind(this))

		return this.setup(this.Model._registry, this._connection, this)
	},

	// Setup a database, running default migrations OR first-time setup.
	setup: function (models, connection) {
		var migrate = new Migrations(models, connection, this)
		return migrate.init().catch(function (err) {
			Logger.logError(
				err,
				'db.setup()',
				'Make sure your database is set up correctly!'
			)
		})
	}

}

module.exports = db
