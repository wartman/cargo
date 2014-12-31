var _ = require('lodash')
var path = require('path')
var knex = require('knex')
var bookshelf = require('bookshelf')
var Set = require('../set')
var Model = require('./model')
var Field = require('./field')
var Updater = require('./updater')
var Logger = require('../logger')
var util = require('../util')

// DB
// --
// A wrapper around Bookshelf, `db` allows us to define
// models BEFORE connecting to a database. 
var Db = Set.extend({

  constructor: function (options) {
    this.super({
      'database': {
        client: 'sqlite3',
        connection: {
          filename: path.join(process.cwd(), '/content/data/rabbit-dev.db')
        },
        debug: false
      }
    }, options)
    this.defineOption('connection', {
      set: function (value) {
        this.setConnection(value)
      },
      get: function () {
        return this.getConnection()
      }
    })
    this.defineOption('bookshelf', {
      set: function () {}, // not settable
      get: function () {
        return this.getBookshelf()
      }
    })

    // Public classes
    this.Field = Field
    this.Model = Model

    // Load all fields and default models
    var imports = util.createImporter(__dirname)
    var defaultFields = imports('./fields')
    var defaultModels = imports('./models');

    this.fields = {}
    // Create factories for each field
    _.each(defaultFields, function (FieldClass, name) {
      this.fields[name] = function (options) {
        return new FieldClass(options)
      }
    }.bind(this))

    // Register default models (must be done AFTER fields 
    // are registered)
    _.each(defaultModels, function (modelFactory) {
      modelFactory(this)
    }.bind(this))
  },

  model: function (name, options) {
    if (this.Model.hasModel(name))
      return this.Model.getModel(name).getBookshelfModel(options)
    else {
      throw new Error('no model of that name exists: ' + name)
    }
  },

  getModels: function () {
    return this.Model.getModels()
  },

  // Connect to the database and register all models with bookshelf
  connect: function () {
    this.setConnection(this.get('database'))
      .getBookshelf()
      .plugin('registry')

    this.Model.compileModels(this.getBookshelf())

    return this.setup()
  },

  // Setup a database, running default migrations OR first-time setup.
  setup: function () {
    var updater = new Updater(this, {
      updates: this.get('updates')
    })
    return updater.init().catch(function (err) {
      Logger.getInstance().logError(
        err,
        'rabbit.db.setup()',
        'Make sure your database is set up correctly!'
      )
    })
  },

  // Connect to a database with knex, and create a new bookshelf
  // instance
  setConnection: function (connection) {
    this._connection = knex(connection)
    this._bookshelf = bookshelf(this._connection)
    return this
  },

  getConnection: function () {
    return this._connection
  },

  getBookshelf: function () {
    return this._bookshelf
  }

})

module.exports = Db
