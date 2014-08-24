var Promise = require('bluebird');
var db = require('../db');
var field = require('../db/field')

// Project
// -------
// Holds a single project, including attachments, etc.
var Project = db.Model.extend({

  tableName: 'rabbit_project',

  schema: function () {
    return {
      'id': field('primaryKey'),
      'uuid': field('int', {nullable: false}),
      'title': field('str', {maxlength: 100, nullable: false}),
      'slug': field('slug', {maxlength: 100, nullable: false}),
      'attachment': field('url'),
      'description': field('text'),
      'category_id': field('int', {references: 'rabbit_category.id'}),
      'created': field('dateTime', {nullable:false}),
      'updated': field('dateTime')
    }
  },

  category: function () {
    return this.belongsTo('Category', 'category_id');
  }

});

var Projects = db.Collection.extend({
  model: Project
});

module.exports = {
  Project: db.model('Project', Project),
  Projects: db.collection('Projects', Projects)
};