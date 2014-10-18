var _ = require('lodash');
var bookshelf = require('bookshelf');
var uuid = require('node-uuid');
var moment = require('moment');

var field = require('./field');
var connect = require('./connect').getInstance();
var Migrations = require('./migrations');

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

  // NOTE:
  // Look into droping the whole schema thing and using CheckIt
  // for model validation.
  // https://github.com/tgriesser/checkit
  // Here's a good discussion on implementation:
  // https://github.com/tgriesser/bookshelf/issues/39
  // Might be a way to integrate fields with this? Hm.

  schema: function () {
    return {};
  },

  initialize: function () {
    this.on('saving', this.validate, this);
  },

  validate: function () {
    // work on it
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

  getSchema: function () {
    return _.result(this.prototype, 'schema');
  },

  // Add a new model.
  add: function (attributes, options) {
    return this.forge(attributes, options).save();
  },

  // Delete a matching model.
  remove: function (attributes, options) {
    return this.forge(attributes, options).destroy();
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
