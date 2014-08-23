var _ = require('lodash');
var bookshelf = require('bookshelf');
var when = require('when');
var uuid = require('node-uuid');
var knex = require('knex');
var moment = require('moment');

var db = require('../db').getInstance();

// rabbitBookshelf
// ---------------
var rabbitBookshelf = bookshelf(db.getConnection());

// rabbitBookshelf.Model
// ---------------------
// The base model all other models inherit.
rabbitBookshelf.Model = rabbitBookshelf.Model.extend({

  defaults: function () {
    return {
      uuid: uuid.v4(),
      created: moment().format(),
      updated: moment().format()
    }
  },

  // look into validation, etc.

}, {

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
module.exports = rabbitBookshelf;