var _ = require('lodash');
var Promise = require('bluebird');
var path = require('path');

var Base = require('../../core/base').Base;
var config = require('../../config').getInstance();
var Logger = require('../../util/logger');
var defaults = require('../defaults');
var versioning = require('./versioning');
// var defaultModels = require('../../models');
// var defaultCon = require('../connect').getConnection();

// Helper shortcut to log progress.
var logInfo = function (message) {
  Logger.logInfo('Migrations', message);
};

var Migrations = Base.extend({

  constructor: function (models, con) {
    this.models = models;
    this.con = con;
  },

  // Check if our database needs to be bootstrapped or not.
  // There are four possibilities:
  // 1. The database exists and is up-to-date
  // 2. The database exists but is out of date
  // 3. The database exists but the currentVersion setting does not or cannot be understood
  // 4. The database has not yet been created
  init: function (tablesOnly) {
    var self = this;
    var defaultVersion = versioning.getDefaultDbVersion();

    return versioning.getDbVersion().then(function (version) {
      if (version < defaultVersion) {
        // 2. We're out of date.
        logInfo('Database upgrade required from version ' + version + 'to' + defaultVersion);
        return self.migrateUp(version, defaultVersion).then(function () {
          // Set the new default version.
          return versioning.setDbVersion();
        });
      }
      if (version === defaultVersion) {
        // 1. We're up to date!
        logInfo('Up to date at version ' + version);
        return;
      }
      if (version > defaultVersion) {
        // 3. The version is too high.
        Logger.logError(
          'Your database is not compatible with this version of Rabbit',
          'Please create a new database'
        );
        // Stop node.
        process.exit(0);
      }
    }).catch(function (err) {
      if (err.message || err === 'Settings table does not exist') {
        // 4. We need to install a new DB.
        logInfo('Database initialization required for version ' + versioning.getDefaultDbVersion());
        return self.migrateUpFreshDb(tablesOnly);
      }
      // 3. Something else nasty happened.
      Logger.logError(
        'There is a problem with your database.',
        err.message || err
      );
      // Stop node.
      process.exit(0);
    })
  },

  // Iterate through models and parse their fields.
  getSchemaFromModels: function () {
    var self = this;
    var schema = {};
    _.each(this.models, function (model, name) {
      schema[model.prototype.tableName] = model.getSchema();
    });
    return schema;
  },

  // Delete all tables from the db in reverse order.
  reset: function () {
    // @todo
  },

  // Run when initializing a new database.
  migrateUpFreshDb: function (tablesOnly) {
    var schema = this.getSchemaFromModels();
    var self = this;
    var tables = _.map(schema, function (columns, tableName) {
      var table = self.con.schema.createTable(tableName, function (table) {
        _.each(columns, function (field, key) {
          field.toColumn(key, table);
        });
      });
      return table;
    });
    logInfo('Creating tables...');
    var promise = Promise.all(tables)
    if (tablesOnly) {
      return promise
    } else {
      return promise
        .then(this.populateDefaults.bind(this))
        .then(function (model) {
          versioning.setDbVersion();
          logInfo('Done.');
        }).catch (function (err) {
          Logger.logError('Something happened', err.message);
        });
    }
  },

  populateDefaults: function () {
    var self = this;
    logInfo('Installing defaults...');
    return Promise.all([
      self.models.Setting.add({
        key: 'dbVersion',
        value: versioning.getDefaultDbVersion()
      }),
      self.models.User.add({
        username: 'admin',
        firstname: 'Peter',
        lastname: 'Wartman',
        email: 'pw@peterwartman.com',
        role: 'Owner',
        password: 'admin'
      })
    ]).catch(function (err) {
      Logger.logError(err);
    });
  },

  migrateUp: function (fromVersion, toVersion) {
    //@todo
  }

});

module.exports = Migrations;
