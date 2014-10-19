var _ = require('lodash');
var uuid = require('node-uuid');
var moment = require('moment');

var db = require('../db');
var field = require('./util/field');
var Base = require('../core/base').Base;

// Model
// -----
// The base model all other models inherit.
var Model = db.Model = db.Model.extend({

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

  initialize: function () {
    this.schema = _.result(this, 'schema');
    this.on('saving', this.validate, this);
  },

  validate: function () {
    // work on it
  },

  // validate: function () {
  //   var self = this;
  //   var pass = true;
  //   _.each(this.schema, function (field, key) {
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

module.exports = field;
module.exports.Model = Model;
module.exports.Collection = db.Collection;
// The following methods are used to register models
// with our Bookshelf instance:
module.exports.model = db.model;
module.exports.collection = db.collection;
