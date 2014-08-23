var _ = require('lodash');
var knex = require('knex');
var Base = require('../../both/oop/base');
var singleton = require('../../both/oop/mixins').singleton;
var config = require('../../../config');

// DB
// --
// Database handler for Rabbit.
var DB = Base.extend({

  constructor: function (connect) {
    // Look into having default options
    // that are always used when connecting
    // if none are passed.
    this.options = {};
    if (connect) {
      this.options = connect;
      this.setConnection(connect);
    }
  },

  create: function () {
    // THIS IS NOT THE RIGHT WAY TO DO THIS
    // Look into hooking into migrations.
    
    // @todo: don't run if the database already
    // exists
    var con = this.getConnection();
    var schema = require('./schema');
    _.each(schema, function (table) {
      table(con);
    });
  },

  migrate: function (argument) {
    var con = this.getConnection();
    var db = (config.env === 'production')
      ? config.production.database
      : config.development.database;
    con.migrate.make('rabbit', {
      database: db,
      directory: config.migrations
    });
  },

  getConnection: function () {
    return this._connection;
  },

  setConnection: function (connect) {
    this._connection = knex(connect);
  }

}, singleton);

// Setup the base instance.
if (config.env === 'production')
  DB.setInstance(config.production.database);
else 
  DB.setInstance(config.development.database);

// Export the module.
module.exports = DB;