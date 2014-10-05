var _ = require('lodash');
var knex = require('knex');

var Base = require('../core/base').Base;
var mixins = require('../core/base').mixins;
var config = require('../config').getInstance();

// Connect
// -------
// Database connection handler for Rabbit.
// Just a litte wrapper around Knex.
var Connect = Base.extend({

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

  // migrate: function (argument) {
  //   var con = this.getConnection();  
  //   var db = (config.env === 'production')
  //     ? config.production.database
  //     : config.development.database;
  //   con.migrate.make('rabbit', {
  //     database: db,
  //     directory: config.migrations
  //   });
  // },

  getConnection: function () {
    return this._connection;
  },

  setConnection: function (connect) {
    this._connection = knex(connect);
  }

});

Connect.mixinStatic(mixins.singleton);

// Setup the base instance.
Connect.setInstance(config.get('database'));

// Export the module.
module.exports = Connect;