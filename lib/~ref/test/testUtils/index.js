var _ = require('lodash');

var Connect = require('../../db/connect');
var Migrations = require('../../db/migrations');
var models = require('../../models');
var Promise = require('bluebird');

var _dbReady = false;
var _migrate = false;

// Setup our testing database
var setup = function (done) {
  var con = Connect.getConnection();
  if (_dbReady) { 
    done();
    return;
  }
  if (_migrate) {
    // Just wait if an instance is already working.
    _migrate.then(function () {
      done();
    });
    return;
  }
  _migrate = new Migrations(models, con);
  // Drop tables first.
  Promise.all(_.map(models, function (model) {
    var tableName = model.prototype.tableName;
    return con.schema.dropTableIfExists(tableName);
  })).then(function () {
    return _migrate.init(true).then(function () {
      _dbReady = true;
      done();
    });
  });
};

// Clean out our database
var teardown = function () {
  // todo
};

// Wrapper to catch errors in async tests.
var catchError = function (done) {
  return function (err) {
    throw err;
    done();
  }
}

module.exports.setup = setup;
module.exports.catchError = catchError;
