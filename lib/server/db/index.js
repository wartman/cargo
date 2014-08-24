var _ = require('lodash');
var bookshelf = require('bookshelf');
var uuid = require('node-uuid');
var knex = require('knex');
var moment = require('moment');

var field = require('./field');
var connect = require('./connect').getInstance();

// db
// --
var db = bookshelf(connect.getConnection());

// Use the registry plugin, which allows us to avoid 
// circular dependencies.
db.plugin('registry');

// db.Model
// ---------------------
// The base model all other models inherit.
db.Model = db.Model.extend({

  defaults: function () {
    return {
      uuid: uuid.v4(),
      created: moment().format(),
      updated: moment().format()
    }
  },

  schema: function () {
    return {};
  },

  // validate: function () {
  //   var pass = true;
  //   var schema = this.schema();
  //   var self = this;
  //   _.each(schema, function (field, key) {
  //     if (self.isNew() && field.type === 'primary')
  //       return;
  //     if(!field.validate(self.get(key))) {
  //       // this.addError(field.getErrorMessage())
  //       pass = false;
  //     }
  //   });
  //   return pass;
  // }

}, {

  // Install this model into the database.
  install: function (db) {
    var self = this.prototype;
    var table = db.schema.createTable(self.tableName, function (table) {
      var schema = self.schema();
      _.each(schema, function (field, key) {
        field.toColumn(key, table);
      });
    }).then(function () {
      console.log(self.tableName + ' created');
    });
    return table;
  },

  // Find a single item.
  findOne: function (attributes, options) {
    return this.forge(attributes, options).fetch(options);
  },

  // Get a collection of items.
  findAll: function (attributes, options) {
    return this.forge(attributes, options).fetchAll(options);
  }

});

// Export module
module.exports = db;
module.exports.connect = connect;
module.exports.field = field;