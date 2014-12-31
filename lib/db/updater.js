var _ = require('lodash')
var Promise = require('bluebird')
var path = require('path')
var Logger = require('../logger')
var Set = require('../set')

// Updater
// -------
// Handles migrations and database setup.
var Updater = Set.extend({

  constructor: function (db, options) {
    this.super({
      'updates': './', // should point to a folder
      'tables only': false
    }, options)

    this.db = db
  },

  // Check if our database needs to be bootstrapped or not.
  // There are four possibilities:
  // 1. The database exists and is up-to-date
  // 2. The database exists but is out of date
  // 3. The database exists but the currentVersion setting does not or cannot be understood
  // 4. The database has not yet been created
  init: function (options) {
    if (options) this.set(options)

    var self = this
    var defaultVersion = this.get('default version', '0.0.1')

    return this
      .getDbVersion()
      .then(function (version) {
        if (version < defaultVersion) {
          // 2. We're out of date
          self.logInfo('Database upgrade required from version ' + version + 'to' + defaultVersion)
          return self.migrateUp(version, defaultVersion).then(function () {
            return self.setDbVersion()
          })
        }
        if (version === defaultVersion) {
          // 1. We're up to date!
          self.logInfo('Up to date at version ' + version)
          return
        }
        if (version > defaultVersion) {
          // 3. The version is too high.
          Logger.getInstance().logError(
            'Your database is not compatible with this version of Rabbit',
            'Please create a new database'
          )
          // Stop node.
          process.exit(0)
        }
      }).catch(function (err) {
        if (err.message || err === 'Settings table does not exist') {
          // 4. We need to install a new DB.
          self.logInfo('Database initialization required for version ' + defaultVersion)
          return self.migrateUpFreshDb(self.get('tables only'))
        }
        // 3. Something else nasty happened.
        Logger.getInstance().logError(
          'There is a problem with your database.',
          err.message || err
        )
        // Stop node.
        process.exit(0)
      })
  },

  logInfo: function (message) {
    Logger.getInstance().logInfo('Migrations', message)
  },

  // Iterate through models and parse their fields.
  getSchemaFromModels: function () {
    var self = this
    var schema = {}
    _.each(this.db.getModels(), function (model, name) {
      schema[model._tableName || name] = model.getSchema()
    })
    return schema
  },

  migrateUp: function () {
    // @todo
  },

  migrateUpFreshDb: function (tablesOnly) {
    var self = this
    var con = this.db.getConnection()
    var schema = this.getSchemaFromModels()
    var tables = _.map(schema, function (columns, tableName) {
      var table = con.schema.createTable(tableName, function (table) {
        _.each(columns, function (field, key) {
          field.toColumn(key, table)
        })
      })
      return table
    })
    this.logInfo('Creating tables...')
    var promise = Promise.all(tables)
    if (tablesOnly) {
      return promise
    } else {
      return promise
        .bind(this)
        .then(this.setDbVersion)
        .then(this.runUpdates)
        .catch(function (err) {
          Logger.getInstance().logError(err, 'Updater.migrateUpFreshDb()')
        })
    }
  },

  runUpdates: function () {
    // @todo
    // Need to load updates file based on the current version
    // @see this.get('updates')
    // The updates file should also set the current version??
    var setting = this.db.model('Setting', {
      key: 'dbVersion',
      value: this.get('default version', '0.0.1')
    })
    return setting.save()
  },

  setDbVersion: function () {
    return this.db.getConnection()('settings')
      .where('key', 'dbVersion')
      .update({value: this.get('default version', '0.0.1')})
  },

  getDbVersion: function () {
    var con = this.db.getConnection()
    var self = this
    return con.schema.hasTable('settings')
      .then(function (exists) {
        if (exists) {
          return con('settings')
            .where('key', 'dbVersion')
            .select('value')
            .then(function (setting) {
              version = setting.value
              if (!version || version.length === 0) {
                // we didn't get a response we understood, assume _initialVersion
                version = self.get('default version', '0.0.1')
              }
              return version
            })
        }
        return Promise.reject('Settings table does not exist')
      })
  }

})

module.exports = Updater
