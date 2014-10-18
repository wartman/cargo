var _ = require('lodash');
var Promise = require('bluebird');

var errors = require('../../errors');
var defaults = require('../defaults');
var con = require('../connect').getConnection();


// Find the default DB version, as set in 'lib/server/db/defaults.json'.
var _initialVersion = '000';
var _defaultDbVersion;
var getDefaultDbVersion = function () {
  if (!_defaultDbVersion) {
    _defaultDbVersion = defaults.core.dbVersion.defaultValue;
  }
  return _defaultDbVersion;
};

// Find out what version the database currently is at.
var getDbVersion = function () {
  // First, check if we even have a settings table.
  return con.schema.hasTable('rabbit_settings').then(function (exists) {
    if (exists) {
      return con('rabbit_settings')
        .where('key', 'dbVersion')
        .select('value')
        .then(function (setting) {
          version = setting.value;
          if (!version || version.length === 0) {
            // we didn't get a response we understood, assume _initialVersion
            version = _initialVersion;
          }
          return version;
        });
    }
    return Promise.reject('Settings table does not exist');
  });
};

var setDbVersion = function () {
  return con('rabbit_settings')
    .where('key', 'dbVersion')
    .update({value: getDefaultDbVersion()})
};

module.exports.getDefaultDbVersion = getDefaultDbVersion;
module.exports.getDbVersion = getDbVersion;
module.exports.setDbVersion = setDbVersion;
