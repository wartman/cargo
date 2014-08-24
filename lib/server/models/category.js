var Promise = require('bluebird');
var db = require('../db');
var field = require('../db/field');

// Category
// --------
var Category = db.Model.extend({

  tableName: 'rabbit_category',

  schema: function () {
    return {
      id: field('primaryKey'),
      uuid: field('int', {nullable: false}),
      name: field('str', {maxlength: 100, nullable: false}),
      slug: field('slug', {maxlength: 100, nullable: false}),
      description: field('text'),
      created: field('dateTime', {nullable: false}),
      updated: field('dateTime')
    };
  },

  projects: function () {
    return this.hasMany('Project', 'category_id');
  }

});

Categories = db.Collection.extend({
  model: Category
});

module.exports = {
  Category: db.model('Category', Category),
  Categories: db.collection('Categories', Categories)
};